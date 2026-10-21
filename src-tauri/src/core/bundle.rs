//! A whole setup in one file: the settings, and the pictures the widgets were given (which are files kept beside the
//! settings, so a copy of the settings alone would show every Picture widget empty on another machine).
//!
//! The file is JSON: `{ "format": "liquidock-setup", "version": 1, "exportedAt": "2026-10-21", "settings": { ... },
//! "media": [ { "name": "id-1a2b.gif", "data": "<base64>" } ] }`. Import takes that, or a plain settings file as the
//! program has always written them. The pictures go back into this machine's media folder (under the names they had:
//! nothing that could name another place is accepted) and each widget's `src` is pointed at them.

use std::path::Path;

use serde::{Deserialize, Serialize};

use crate::core::settings::Settings;
use crate::core::{AeroError, AeroResult};

pub const FORMAT: &str = "liquidock-setup";

/// What a picture may be (the same list the Picture widget takes).
const MEDIA_TYPES: &[&str] = &["gif", "png", "jpg", "jpeg", "webp", "apng", "avif", "bmp"];

#[derive(Serialize, Deserialize)]
struct Bundle {
    format: String,
    version: u32,
    #[serde(rename = "exportedAt")]
    exported_at: String,
    settings: Settings,
    #[serde(default)]
    media: Vec<MediaFile>,
}

#[derive(Serialize, Deserialize)]
struct MediaFile {
    name: String,
    data: String,
}

/// The file name of a widget's picture, if it has one: its `src` option, whatever folder it names.
fn picture_name(src: &serde_json::Value) -> Option<String> {
    let path = Path::new(src.as_str()?);
    path.file_name().map(|n| n.to_string_lossy().to_string())
}

/// Only a plain name of a picture: letters, digits, `-`, `_` and one dot before a picture's extension. No folder, no
/// `..`, nothing a path could be made of.
fn valid_media_name(name: &str) -> bool {
    if name.is_empty() || name.len() > 120 {
        return false;
    }
    let Some((stem, ext)) = name.rsplit_once('.') else { return false };
    !stem.is_empty()
        && stem.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_')
        && MEDIA_TYPES.contains(&ext.to_ascii_lowercase().as_str())
}

/// The setup as one file's text: the settings, and every picture a widget points at that is in `media_dir`.
pub fn export(settings: &Settings, media_dir: &Path, today: &str) -> AeroResult<String> {
    let mut media = Vec::new();
    let mut seen = std::collections::BTreeSet::new();
    for widget in &settings.widgets.widgets {
        let Some(name) = widget.options.extra.get("src").and_then(picture_name) else { continue };
        if !valid_media_name(&name) || !seen.insert(name.clone()) {
            continue;
        }
        // (a picture that has gone is simply not in the file)
        if let Ok(bytes) = std::fs::read(media_dir.join(&name)) {
            media.push(MediaFile { data: base64_encode(&bytes), name });
        }
    }
    let bundle = Bundle { format: FORMAT.into(), version: 1, exported_at: today.into(), settings: settings.clone(), media };
    Ok(serde_json::to_string_pretty(&bundle)?)
}

/// What was read from a file: the settings, and how many pictures were put into `media_dir`.
pub struct Imported {
    pub settings: Settings,
    pub pictures: usize,
}

/// Read a setup file (or a plain settings file). The pictures are written to `media_dir` and the widgets pointed at them;
/// nothing is applied here.
pub fn import(json: &str, media_dir: &Path) -> AeroResult<Imported> {
    let text = json.trim_start_matches('\u{feff}');
    let value: serde_json::Value = serde_json::from_str(text).map_err(|e| AeroError::other(format!("that is not a settings file: {e}")))?;
    if value.get("format").and_then(|f| f.as_str()) != Some(FORMAT) {
        let settings: Settings = serde_json::from_value(value).map_err(|e| AeroError::other(format!("invalid settings file: {e}")))?;
        return Ok(Imported { settings, pictures: 0 });
    }
    let bundle: Bundle = serde_json::from_value(value).map_err(|e| AeroError::other(format!("invalid setup file: {e}")))?;
    if bundle.version > 1 {
        return Err(AeroError::other("this setup file is from a newer Liquidock than this one"));
    }
    let mut settings = bundle.settings;
    let mut written = std::collections::BTreeSet::new();
    if !bundle.media.is_empty() {
        std::fs::create_dir_all(media_dir)?;
    }
    for file in bundle.media {
        if !valid_media_name(&file.name) {
            return Err(AeroError::other(format!("the setup file holds a picture with a name that is not allowed: {}", file.name)));
        }
        let bytes = base64_decode(&file.data).ok_or_else(|| AeroError::other(format!("the picture {} in the setup file is damaged", file.name)))?;
        std::fs::write(media_dir.join(&file.name), bytes)?;
        written.insert(file.name);
    }
    for widget in &mut settings.widgets.widgets {
        let Some(name) = widget.options.extra.get("src").and_then(picture_name) else { continue };
        if written.contains(&name) {
            widget.options.extra.insert("src".into(), serde_json::Value::from(media_dir.join(&name).to_string_lossy().to_string()));
        }
    }
    Ok(Imported { settings, pictures: written.len() })
}

const TABLE: &[u8; 64] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

pub fn base64_encode(bytes: &[u8]) -> String {
    let mut out = String::with_capacity(bytes.len().div_ceil(3) * 4);
    for chunk in bytes.chunks(3) {
        let n = (chunk[0] as u32) << 16 | (*chunk.get(1).unwrap_or(&0) as u32) << 8 | *chunk.get(2).unwrap_or(&0) as u32;
        out.push(TABLE[(n >> 18) as usize & 63] as char);
        out.push(TABLE[(n >> 12) as usize & 63] as char);
        out.push(if chunk.len() > 1 { TABLE[(n >> 6) as usize & 63] as char } else { '=' });
        out.push(if chunk.len() > 2 { TABLE[n as usize & 63] as char } else { '=' });
    }
    out
}

/// `None` for anything that is not base64 (white space is let through, as a file may be wrapped).
pub fn base64_decode(text: &str) -> Option<Vec<u8>> {
    let mut out = Vec::with_capacity(text.len() / 4 * 3);
    let (mut acc, mut bits) = (0u32, 0u32);
    for b in text.bytes().filter(|b| !b.is_ascii_whitespace()) {
        if b == b'=' {
            break;
        }
        let v = TABLE.iter().position(|t| *t == b)? as u32;
        acc = acc << 6 | v;
        bits += 6;
        if bits >= 8 {
            bits -= 8;
            out.push((acc >> bits) as u8);
            acc &= (1 << bits) - 1;
        }
    }
    Some(out)
}

/// The date of a Unix time (UTC) as `2026-10-21`, for the file's name.
pub fn date_of(unix_secs: u64) -> String {
    // days since 1970-01-01 to a civil date (Howard Hinnant's algorithm)
    let z = (unix_secs / 86_400) as i64 + 719_468;
    let era = z.div_euclid(146_097);
    let doe = z.rem_euclid(146_097);
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    let y = yoe + era * 400 + i64::from(m <= 2);
    format!("{y:04}-{m:02}-{d:02}")
}

#[cfg(test)]
mod tests {
    use super::*;

    fn with_picture(dir: &Path, id: &str, name: &str) -> Settings {
        let mut s = Settings::default();
        let mut w: crate::core::widgets::WidgetInstance = serde_json::from_value(serde_json::json!({ "id": id, "kind": "picture" })).unwrap();
        w.options.extra.insert("src".into(), serde_json::Value::from(dir.join(name).to_string_lossy().to_string()));
        s.widgets.widgets.push(w);
        s
    }

    #[test]
    fn base64_round_trips_and_matches_the_standard_examples() {
        assert_eq!(base64_encode(b"foobar"), "Zm9vYmFy");
        assert_eq!(base64_encode(b"fo"), "Zm8=");
        for bytes in [&b""[..], b"f", b"fo", b"foo", b"\x00\xff\x10\x80binary", &[7u8; 1000][..]] {
            assert_eq!(base64_decode(&base64_encode(bytes)).unwrap(), bytes);
        }
        assert_eq!(base64_decode("Zm9v\nYmFy").unwrap(), b"foobar", "a wrapped file is read");
        assert!(base64_decode("not*base64").is_none());
    }

    #[test]
    fn a_date_is_made_from_the_unix_time() {
        assert_eq!(date_of(0), "1970-01-01");
        assert_eq!(date_of(1_792_601_660), "2026-10-21");
        assert_eq!(date_of(951_782_400), "2000-02-29", "a leap day");
    }

    #[test]
    fn a_setup_carries_its_pictures_and_they_land_where_they_are_wanted() {
        let from = std::env::temp_dir().join("aero-bundle-from");
        let to = std::env::temp_dir().join("aero-bundle-to");
        let _ = std::fs::remove_dir_all(&to);
        std::fs::create_dir_all(&from).unwrap();
        std::fs::write(from.join("w1-1a2b.gif"), b"GIF89a-pretend").unwrap();
        let settings = with_picture(&from, "w1", "w1-1a2b.gif");
        let file = export(&settings, &from, "2026-10-21").unwrap();
        assert!(file.contains("liquidock-setup") && file.contains("2026-10-21"));

        let got = import(&file, &to).unwrap();
        assert_eq!(got.pictures, 1);
        assert_eq!(std::fs::read(to.join("w1-1a2b.gif")).unwrap(), b"GIF89a-pretend");
        let src = got.settings.widgets.widgets[0].options.extra["src"].as_str().unwrap().to_string();
        assert_eq!(Path::new(&src), to.join("w1-1a2b.gif"), "the widget now points at this machine's copy");
    }

    #[test]
    fn a_plain_settings_file_is_still_taken_and_a_missing_picture_is_left_out() {
        let dir = std::env::temp_dir().join("aero-bundle-plain");
        let _ = std::fs::remove_dir_all(&dir);
        let plain = serde_json::to_string(&Settings::default()).unwrap();
        let got = import(&plain, &dir).unwrap();
        assert_eq!(got.pictures, 0);
        // a picture the widget names but which has gone: exported without it, no failure
        let settings = with_picture(&dir, "w2", "w2-gone.png");
        let file = export(&settings, &dir, "2026-10-21").unwrap();
        assert_eq!(import(&file, &dir).unwrap().pictures, 0);
    }

    #[test]
    fn a_picture_that_names_another_place_is_refused() {
        let dir = std::env::temp_dir().join("aero-bundle-evil");
        for name in ["..\\..\\evil.png", "../evil.png", "a/b.png", "x.exe", ".png", "no-extension", "a..b.png"] {
            assert!(!valid_media_name(name), "{name} must not be accepted");
        }
        assert!(valid_media_name("w1-1a2b.GIF") && valid_media_name("my_pic-2.webp"));
        let bad = serde_json::json!({
            "format": FORMAT, "version": 1, "exportedAt": "x",
            "settings": Settings::default(),
            "media": [{ "name": "../evil.png", "data": "AAAA" }]
        });
        let err = import(&bad.to_string(), &dir).err().expect("refused");
        assert!(err.to_string().contains("not allowed"), "{err}");
        assert!(!dir.join("../evil.png").exists());
    }

    #[test]
    fn a_setup_from_a_newer_version_is_not_guessed_at() {
        let newer = serde_json::json!({ "format": FORMAT, "version": 9, "exportedAt": "x", "settings": Settings::default() });
        assert!(import(&newer.to_string(), &std::env::temp_dir().join("aero-bundle-newer")).is_err());
    }
}

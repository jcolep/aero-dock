//! Now playing, for the Control Center and the music widget.
//!
//! Windows keeps a system-wide list of media sessions, the same one the
//! volume flyout shows, so this works with anything that registers: media
//! keys, browsers, Spotify, the built-in player. There is no per-app
//! integration to write and nothing to configure.
//!
//! A session carries more than a title: the cover (a browser hands over the
//! video's thumbnail), where in the track it is, what the player lets us do,
//! and which program it is. All of that is read here; none of it is required,
//! because players fill in as much or as little as they like.
//!
//! Everything here is best effort. Nothing is playing most of the time,
//! and a session can disappear between asking for it and reading it, so
//! every step degrades to "nothing playing" rather than an error.

use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};

use parking_lot::Mutex;
use serde::Serialize;
use windows::Media::Control::{
    GlobalSystemMediaTransportControlsSession as Session,
    GlobalSystemMediaTransportControlsSessionManager as SessionManager,
    GlobalSystemMediaTransportControlsSessionPlaybackStatus as PlaybackStatus,
};
use windows::Media::MediaPlaybackAutoRepeatMode;
use windows::Storage::Streams::DataReader;

use super::running::{self, WindowInfo};

/// One entry of the list of players, when there is more than one.
#[derive(Debug, Clone, Serialize, Default, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct PlayerBrief {
    /// The session's app id: what to pass back to choose it.
    pub id: String,
    pub name: String,
    pub title: String,
    pub playing: bool,
    /// The one the card is showing.
    pub current: bool,
}

#[derive(Debug, Clone, Serialize, Default, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct NowPlaying {
    /// False when nothing has a media session at all.
    pub active: bool,
    pub title: String,
    pub artist: String,
    pub album: String,
    pub playing: bool,
    /// Which app owns the session (its app id), for the label under the title.
    pub source: String,
    /// The program's own name ("Spotify", "Google Chrome").
    pub source_name: String,
    /// What to ask the icon cache for to get the program's icon: its exe, or
    /// its Start menu entry for a Store app. Empty if the program has no window.
    pub source_target: String,
    /// A window of the program, the one showing this track if it can be told
    /// (a browser's tab title holds the page's title). 0 if there is none.
    pub source_hwnd: isize,
    /// Changes when the track does; the cover is fetched again when it does.
    pub key: String,
    pub has_artwork: bool,
    /// Where in the track, in milliseconds, as of this reading.
    pub position_ms: i64,
    /// How long the track is. 0 for a live stream or a player that does not say.
    pub duration_ms: i64,
    pub can_seek: bool,
    pub can_previous: bool,
    pub can_next: bool,
    /// None when the player has no shuffle to switch.
    pub shuffle: Option<bool>,
    /// "none", "track" or "list"; None when the player has no repeat.
    pub repeat: Option<String>,
    /// Only filled in when there is more than one player.
    pub players: Vec<PlayerBrief>,
}

/// The player the card was told to follow (its app id), or None for whichever
/// the system thinks is current.
static PREFERRED: Mutex<Option<String>> = Mutex::new(None);

/// Choose which player to follow, or go back to the system's choice.
pub fn select(id: Option<String>) {
    *PREFERRED.lock() = id.filter(|s| !s.is_empty());
}

async fn manager() -> Option<SessionManager> {
    SessionManager::RequestAsync().ok()?.await.ok()
}

async fn current_session() -> Option<Session> {
    let manager = manager().await?;
    let wanted = PREFERRED.lock().clone();
    if let (Some(id), Ok(all)) = (wanted, manager.GetSessions()) {
        for s in all {
            if s.SourceAppUserModelId().map(|a| a.to_string()).is_ok_and(|a| a == id) {
                return Some(s);
            }
        }
    }
    manager.GetCurrentSession().ok()
}

// ---- the arithmetic: no windows in this part ----

/// 100 ns ticks from 1601 to 1970, the gap between the two calendars Windows
/// and everyone else count from.
const EPOCH_GAP_TICKS: i64 = 116_444_736_000_000_000;

fn now_unix_ms() -> i64 {
    SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as i64).unwrap_or(0)
}

fn ticks_to_ms(ticks: i64) -> i64 {
    ticks / 10_000
}

/// A time stamp from a session (ticks since 1601) as milliseconds since 1970.
fn stamp_to_unix_ms(ticks: i64) -> Option<i64> {
    (ticks > EPOCH_GAP_TICKS).then(|| ticks_to_ms(ticks - EPOCH_GAP_TICKS))
}

/// Where the track is now. A player reports its position when something changes
/// (a seek, a pause, a track) with the time it said so; in between, a playing
/// track has moved on by the time since, at the playback rate. A stamp that is
/// missing, in the future or more than a day old is not trusted, and the
/// position is as reported.
pub fn position_now(reported_ms: i64, stamped_unix_ms: Option<i64>, now_ms: i64, rate: f64, playing: bool, duration_ms: i64) -> i64 {
    let mut at = reported_ms.max(0);
    if playing {
        if let Some(stamp) = stamped_unix_ms {
            let since = now_ms - stamp;
            if (0..86_400_000).contains(&since) {
                at += (since as f64 * if rate > 0.0 { rate } else { 1.0 }) as i64;
            }
        }
    }
    if duration_ms > 0 {
        at = at.min(duration_ms);
    }
    at
}

/// Whether a running window belongs to the program that owns a media session.
/// The session's app id is the exe's name for a desktop program ("Spotify.exe"),
/// a family name for a browser that goes on with a suffix ("Firefox-308046B0AF4A39CB",
/// "MSEdge"), and the package's id for a Store app, which its window also carries.
pub fn source_matches(session_id: &str, exe: &str, window_aumid: Option<&str>) -> bool {
    if session_id.is_empty() {
        return false;
    }
    if window_aumid.is_some_and(|w| w.eq_ignore_ascii_case(session_id)) {
        return true;
    }
    let id = session_id.to_ascii_lowercase();
    let id = id.split('!').next().unwrap_or(&id);
    let id = id.strip_suffix(".exe").unwrap_or(id);
    let file = exe.rsplit(['\\', '/']).next().unwrap_or(exe).to_ascii_lowercase();
    let stem = file.strip_suffix(".exe").unwrap_or(&file);
    if stem.is_empty() || stem == "applicationframehost" {
        return false;
    }
    id == stem || id.starts_with(&format!("{stem}-")) || id.starts_with(&format!("{stem}."))
}

/// Which of the windows is showing this track: among those of the program, the
/// one whose title holds the track's (a browser puts the page's title in its
/// own), else the first.
pub fn pick_window<'a>(windows: &'a [WindowInfo], session_id: &str, title: &str) -> Option<&'a WindowInfo> {
    let mine: Vec<&WindowInfo> =
        windows.iter().filter(|w| source_matches(session_id, &w.exe, w.aumid.as_deref())).collect();
    let wanted = title.trim().to_lowercase();
    if !wanted.is_empty() {
        if let Some(w) = mine.iter().find(|w| w.title.to_lowercase().contains(&wanted)) {
            return Some(w);
        }
    }
    mine.first().copied()
}

/// A name for a program that has no window to ask: its app id without the
/// package decoration ("Microsoft.ZuneMusic_8wekyb3d8bbwe!App" is "ZuneMusic").
pub fn plain_name(session_id: &str) -> String {
    let id = session_id.split('!').next().unwrap_or(session_id);
    let id = id.strip_suffix(".exe").unwrap_or(id);
    let id = id.split('_').next().unwrap_or(id);
    id.rsplit('.').next().unwrap_or(id).to_string()
}

fn base64(bytes: &[u8]) -> String {
    const T: &[u8; 64] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut out = String::with_capacity(bytes.len().div_ceil(3) * 4);
    for chunk in bytes.chunks(3) {
        let n = (chunk[0] as u32) << 16 | (*chunk.get(1).unwrap_or(&0) as u32) << 8 | *chunk.get(2).unwrap_or(&0) as u32;
        out.push(T[(n >> 18) as usize & 63] as char);
        out.push(T[(n >> 12) as usize & 63] as char);
        out.push(if chunk.len() > 1 { T[(n >> 6) as usize & 63] as char } else { '=' });
        out.push(if chunk.len() > 2 { T[n as usize & 63] as char } else { '=' });
    }
    out
}

/// A cover as a `data:` address the page can show. Big covers (a streaming
/// service sends 640 px) are brought down to what the card needs; one the
/// decoder cannot read goes through as it came, unless it is too big to be
/// worth sending.
pub fn cover_data_url(bytes: &[u8], content_type: &str) -> Option<String> {
    if bytes.is_empty() {
        return None;
    }
    if let Ok(img) = image::load_from_memory(bytes) {
        let small = img.thumbnail(360, 360).to_rgb8();
        let mut jpeg = Vec::new();
        let encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(&mut jpeg, 86);
        if small.write_with_encoder(encoder).is_ok() {
            return Some(format!("data:image/jpeg;base64,{}", base64(&jpeg)));
        }
    }
    if bytes.len() > 1_500_000 {
        return None;
    }
    let mime = if content_type.starts_with("image/") { content_type } else { "image/png" };
    Some(format!("data:{mime};base64,{}", base64(bytes)))
}

// ---- reading a session ----

/// Friendly program names, found once per program: reading a file's version
/// information is not something to do on every poll.
static NAMES: Mutex<Option<HashMap<String, String>>> = Mutex::new(None);

fn program_name(exe: &str, session_id: &str) -> String {
    let mut guard = NAMES.lock();
    let names = guard.get_or_insert_with(HashMap::new);
    if let Some(n) = names.get(exe) {
        return n.clone();
    }
    let name = super::apps::file_description(exe)
        .filter(|n| !n.trim().is_empty())
        .unwrap_or_else(|| plain_name(session_id));
    names.insert(exe.to_string(), name.clone());
    name
}

/// Everything the card needs to say about where a session's audio is from.
struct Origin {
    name: String,
    target: String,
    hwnd: isize,
}

fn origin_of(session_id: &str, title: &str) -> Origin {
    let snapshot = running::snapshot();
    match pick_window(&snapshot.windows, session_id, title) {
        Some(w) => {
            let packaged = w.aumid.is_some() && w.exe.to_ascii_lowercase().ends_with("applicationframehost.exe");
            let target = match (&w.aumid, packaged) {
                (Some(a), true) => format!("shell:AppsFolder\\{a}"),
                _ => w.exe.clone(),
            };
            let name = if packaged { plain_name(session_id) } else { program_name(&w.exe, session_id) };
            Origin { name, target, hwnd: w.hwnd }
        }
        // no window, but a Store app is still found by its id in the Start menu,
        // which gives it its proper name and its icon
        None if session_id.contains('!') => Origin {
            name: plain_name(session_id),
            target: format!("shell:AppsFolder\\{session_id}"),
            hwnd: 0,
        },
        None => Origin { name: plain_name(session_id), target: String::new(), hwnd: 0 },
    }
}

async fn title_of(session: &Session) -> String {
    match session.TryGetMediaPropertiesAsync() {
        Ok(op) => op.await.ok().and_then(|p| p.Title().ok()).map(|t| t.to_string()).unwrap_or_default(),
        Err(_) => String::new(),
    }
}

/// What is playing right now, if anything.
pub async fn now_playing() -> NowPlaying {
    let Some(session) = current_session().await else {
        return NowPlaying::default();
    };

    let mut out = NowPlaying { active: true, ..Default::default() };

    let props = match session.TryGetMediaPropertiesAsync() {
        Ok(op) => op.await.ok(),
        Err(_) => None,
    };
    if let Some(props) = &props {
        out.title = props.Title().map(|s| s.to_string()).unwrap_or_default();
        out.artist = props.Artist().map(|s| s.to_string()).unwrap_or_default();
        out.album = props.AlbumTitle().map(|s| s.to_string()).unwrap_or_default();
        out.has_artwork = props.Thumbnail().is_ok();
    }

    let mut rate = 1.0;
    if let Ok(info) = session.GetPlaybackInfo() {
        out.playing = info.PlaybackStatus().map(|s| s == PlaybackStatus::Playing).unwrap_or(false);
        rate = info.PlaybackRate().and_then(|r| r.Value()).unwrap_or(1.0);
        if let Ok(c) = info.Controls() {
            out.can_previous = c.IsPreviousEnabled().unwrap_or(false);
            out.can_next = c.IsNextEnabled().unwrap_or(false);
            out.can_seek = c.IsPlaybackPositionEnabled().unwrap_or(false);
            if c.IsShuffleEnabled().unwrap_or(false) {
                out.shuffle = Some(info.IsShuffleActive().and_then(|b| b.Value()).unwrap_or(false));
            }
            if c.IsRepeatEnabled().unwrap_or(false) {
                out.repeat = Some(
                    match info.AutoRepeatMode().and_then(|m| m.Value()) {
                        Ok(MediaPlaybackAutoRepeatMode::Track) => "track",
                        Ok(MediaPlaybackAutoRepeatMode::List) => "list",
                        _ => "none",
                    }
                    .to_string(),
                );
            }
        }
    }

    if let Ok(t) = session.GetTimelineProperties() {
        let start = t.StartTime().map(|d| d.Duration).unwrap_or(0);
        let end = t.EndTime().map(|d| d.Duration).unwrap_or(0);
        let position = t.Position().map(|d| d.Duration).unwrap_or(0);
        let stamp = t.LastUpdatedTime().ok().and_then(|d| stamp_to_unix_ms(d.UniversalTime));
        out.duration_ms = ticks_to_ms((end - start).max(0));
        out.position_ms =
            position_now(ticks_to_ms(position - start), stamp, now_unix_ms(), rate, out.playing, out.duration_ms);
        // a track with no length cannot be moved around in
        out.can_seek = out.can_seek && out.duration_ms > 0;
    }

    out.source = session.SourceAppUserModelId().map(|s| s.to_string()).unwrap_or_default();
    let origin = origin_of(&out.source, &out.title);
    out.source_name = origin.name;
    out.source_target = origin.target;
    out.source_hwnd = origin.hwnd;
    out.key = format!("{}|{}|{}|{}", out.source, out.title, out.artist, out.album);

    // a session with no title is a player sitting idle, which reads
    // better as nothing playing than as a blank card
    if out.title.trim().is_empty() {
        out.active = false;
    }

    // other players, if there are any: the card lets you choose
    if let Some(manager) = manager().await {
        if let Ok(all) = manager.GetSessions() {
            if all.Size().unwrap_or(0) > 1 {
                for s in all {
                    let id = s.SourceAppUserModelId().map(|a| a.to_string()).unwrap_or_default();
                    let title = title_of(&s).await;
                    if title.trim().is_empty() {
                        continue;
                    }
                    let playing = s
                        .GetPlaybackInfo()
                        .and_then(|i| i.PlaybackStatus())
                        .map(|p| p == PlaybackStatus::Playing)
                        .unwrap_or(false);
                    let name = origin_of(&id, &title).name;
                    out.players.push(PlayerBrief { current: id == out.source, id, name, title, playing });
                }
            }
        }
    }

    out
}

/// The current cover as a `data:` address. Kept for as long as the track is
/// the same, unless `fresh` asks for it to be read again (players often post
/// the cover a moment after the title).
pub async fn artwork(fresh: bool) -> Option<String> {
    static CACHE: Mutex<Option<(String, String)>> = Mutex::new(None);

    let session = current_session().await?;
    let props = session.TryGetMediaPropertiesAsync().ok()?.await.ok()?;
    let key = format!(
        "{}|{}|{}|{}",
        session.SourceAppUserModelId().map(|s| s.to_string()).unwrap_or_default(),
        props.Title().map(|s| s.to_string()).unwrap_or_default(),
        props.Artist().map(|s| s.to_string()).unwrap_or_default(),
        props.AlbumTitle().map(|s| s.to_string()).unwrap_or_default(),
    );
    if !fresh {
        if let Some((k, url)) = CACHE.lock().as_ref() {
            if *k == key {
                return Some(url.clone());
            }
        }
    }

    let reference = props.Thumbnail().ok()?;
    let stream = reference.OpenReadAsync().ok()?.await.ok()?;
    let size = stream.Size().ok()? as u32;
    if size == 0 || size > 8_000_000 {
        return None;
    }
    let reader = DataReader::CreateDataReader(&stream.GetInputStreamAt(0).ok()?).ok()?;
    reader.LoadAsync(size).ok()?.await.ok()?;
    let mut bytes = vec![0u8; size as usize];
    reader.ReadBytes(&mut bytes).ok()?;
    let content_type = stream.ContentType().map(|s| s.to_string()).unwrap_or_default();

    let url = cover_data_url(&bytes, &content_type)?;
    *CACHE.lock() = Some((key, url.clone()));
    Some(url)
}

/// What the transport buttons can ask for.
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum MediaAction {
    PlayPause,
    Next,
    Previous,
}

/// Send a transport command to whatever owns the session. Returns false
/// when there is nothing to control or the app refused.
pub async fn control(action: MediaAction) -> bool {
    let Some(session) = current_session().await else {
        return false;
    };
    let op = match action {
        MediaAction::PlayPause => session.TryTogglePlayPauseAsync(),
        MediaAction::Next => session.TrySkipNextAsync(),
        MediaAction::Previous => session.TrySkipPreviousAsync(),
    };
    match op {
        Ok(op) => op.await.unwrap_or(false),
        Err(_) => false,
    }
}

/// Move to a point in the track, in milliseconds from its start.
pub async fn seek(position_ms: i64) -> bool {
    let Some(session) = current_session().await else {
        return false;
    };
    let start = session
        .GetTimelineProperties()
        .and_then(|t| t.StartTime())
        .map(|d| d.Duration)
        .unwrap_or(0);
    let ticks = start + position_ms.max(0) * 10_000;
    match session.TryChangePlaybackPositionAsync(ticks) {
        Ok(op) => op.await.unwrap_or(false),
        Err(_) => false,
    }
}

/// Move by an amount from where the track is now (negative goes back).
pub async fn seek_by(delta_ms: i64) -> bool {
    let now = now_playing().await;
    if !now.active || !now.can_seek {
        return false;
    }
    seek((now.position_ms + delta_ms).clamp(0, now.duration_ms)).await
}

pub async fn set_shuffle(on: bool) -> bool {
    let Some(session) = current_session().await else {
        return false;
    };
    match session.TryChangeShuffleActiveAsync(on) {
        Ok(op) => op.await.unwrap_or(false),
        Err(_) => false,
    }
}

pub async fn set_repeat(mode: &str) -> bool {
    let Some(session) = current_session().await else {
        return false;
    };
    let mode = match mode {
        "track" => MediaPlaybackAutoRepeatMode::Track,
        "list" => MediaPlaybackAutoRepeatMode::List,
        _ => MediaPlaybackAutoRepeatMode::None,
    };
    match session.TryChangeAutoRepeatModeAsync(mode) {
        Ok(op) => op.await.unwrap_or(false),
        Err(_) => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn window(exe: &str, title: &str, aumid: Option<&str>) -> WindowInfo {
        WindowInfo {
            hwnd: 1,
            title: title.into(),
            exe: exe.into(),
            pid: 1,
            aumid: aumid.map(Into::into),
            monitor: String::new(),
        }
    }

    #[test]
    fn reading_now_playing_never_fails_whatever_the_machine_is_doing() {
        let n = tauri::async_runtime::block_on(now_playing());
        // Nothing may be playing on a build machine, and something may be
        // playing on a desktop. Both are fine; the invariant is that an
        // inactive result carries no half-filled fields to render.
        if !n.active {
            assert!(n.title.is_empty(), "inactive sessions have no title");
        }
        assert!(n.position_ms >= 0);
        assert!(n.duration_ms == 0 || n.position_ms <= n.duration_ms);
    }

    /// Prints what the machine is playing, cover included. Reads only.
    /// `cargo test --lib what_is_playing -- --ignored --nocapture`
    #[test]
    #[ignore]
    fn what_is_playing() {
        let n = tauri::async_runtime::block_on(now_playing());
        println!("{n:#?}");
        let art = tauri::async_runtime::block_on(artwork(true));
        println!("cover: {}", art.map(|a| format!("{} chars", a.len())).unwrap_or("none".into()));
    }

    #[test]
    fn actions_parse_from_the_frontend_spelling() {
        for (text, want) in [
            (r#""playpause""#, MediaAction::PlayPause),
            (r#""next""#, MediaAction::Next),
            (r#""previous""#, MediaAction::Previous),
        ] {
            let got: MediaAction = serde_json::from_str(text).expect(text);
            assert_eq!(got, want);
        }
    }

    #[test]
    fn a_playing_track_moves_on_from_the_time_it_was_reported() {
        let now = 1_000_000;
        // reported at 30 s two seconds ago, playing: 32 s now
        assert_eq!(position_now(30_000, Some(now - 2_000), now, 1.0, true, 200_000), 32_000);
        // paused: where it was
        assert_eq!(position_now(30_000, Some(now - 2_000), now, 1.0, false, 200_000), 30_000);
        // at double speed
        assert_eq!(position_now(30_000, Some(now - 2_000), now, 2.0, true, 200_000), 34_000);
        // never past the end
        assert_eq!(position_now(199_000, Some(now - 5_000), now, 1.0, true, 200_000), 200_000);
        // a stamp from the future or from long ago is not believed
        assert_eq!(position_now(30_000, Some(now + 9_000), now, 1.0, true, 200_000), 30_000);
        assert_eq!(position_now(30_000, Some(now - 90_000_000), now, 1.0, true, 200_000), 30_000);
        assert_eq!(position_now(30_000, None, now, 1.0, true, 200_000), 30_000);
        // a position before the start is the start
        assert_eq!(position_now(-5, None, now, 1.0, false, 0), 0);
    }

    #[test]
    fn a_session_stamp_is_read_as_a_time_since_1970() {
        // 2020-01-01 00:00:00 UTC is 1577836800 s since 1970
        let ticks = (1_577_836_800i64 * 1000) * 10_000 + EPOCH_GAP_TICKS;
        assert_eq!(stamp_to_unix_ms(ticks), Some(1_577_836_800_000));
        assert_eq!(stamp_to_unix_ms(0), None);
    }

    #[test]
    fn a_session_is_matched_to_its_program() {
        assert!(source_matches("Spotify.exe", r"C:\Users\x\AppData\Roaming\Spotify\Spotify.exe", None));
        assert!(source_matches("chrome.exe", r"C:\Program Files\Google\Chrome\Application\chrome.exe", None));
        assert!(source_matches("MSEdge", r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe", None));
        assert!(source_matches("Firefox-308046B0AF4A39CB", r"C:\Program Files\Mozilla Firefox\firefox.exe", None));
        assert!(source_matches(
            "Microsoft.ZuneMusic_8wekyb3d8bbwe!Microsoft.ZuneMusic",
            r"C:\Windows\System32\ApplicationFrameHost.exe",
            Some("Microsoft.ZuneMusic_8wekyb3d8bbwe!Microsoft.ZuneMusic"),
        ));
        // other programs are not
        assert!(!source_matches("Spotify.exe", r"C:\Windows\explorer.exe", None));
        assert!(!source_matches("chrome.exe", r"C:\Program Files\Brave\brave.exe", None));
        // the frame host is every Store app's exe, and so says nothing
        assert!(!source_matches("Foo.exe", r"C:\Windows\System32\ApplicationFrameHost.exe", None));
        assert!(!source_matches("", "x.exe", None));
    }

    #[test]
    fn the_window_showing_the_track_is_the_one_with_its_title() {
        let windows = vec![
            window(r"C:\c\chrome.exe", "Some other page - Google Chrome", None),
            window(r"C:\c\chrome.exe", "Never Gonna Give You Up - YouTube - Google Chrome", None),
            window(r"C:\s\Spotify.exe", "Spotify", None),
        ];
        let picked = pick_window(&windows, "chrome.exe", "Never Gonna Give You Up").expect("a window");
        assert!(picked.title.starts_with("Never Gonna"));
        // no title match: the program's first window
        let first = pick_window(&windows, "chrome.exe", "Unheard song").expect("a window");
        assert!(first.title.starts_with("Some other"));
        assert!(pick_window(&windows, "vlc.exe", "x").is_none());
    }

    #[test]
    fn a_program_with_no_window_is_still_called_something() {
        assert_eq!(plain_name("Spotify.exe"), "Spotify");
        assert_eq!(plain_name("Microsoft.ZuneMusic_8wekyb3d8bbwe!Microsoft.ZuneMusic"), "ZuneMusic");
        assert_eq!(plain_name("MSEdge"), "MSEdge");
    }

    #[test]
    fn base64_matches_the_standard_examples() {
        assert_eq!(base64(b""), "");
        assert_eq!(base64(b"f"), "Zg==");
        assert_eq!(base64(b"fo"), "Zm8=");
        assert_eq!(base64(b"foo"), "Zm9v");
        assert_eq!(base64(b"foobar"), "Zm9vYmFy");
    }

    #[test]
    fn a_cover_comes_out_small_and_as_a_data_address() {
        // a 600 px square picture, as a PNG
        let img = image::RgbImage::from_fn(600, 600, |x, y| image::Rgb([(x % 255) as u8, (y % 255) as u8, 90]));
        let mut png = Vec::new();
        img.write_to(&mut std::io::Cursor::new(&mut png), image::ImageFormat::Png).expect("encode");
        let url = cover_data_url(&png, "image/png").expect("a cover");
        assert!(url.starts_with("data:image/jpeg;base64,"));
        assert!(url.len() < 150_000, "kept small: {} bytes", url.len());
        // nothing is no cover, and bytes that are not a picture still go through (the page decides)
        assert!(cover_data_url(&[], "image/png").is_none());
        assert!(cover_data_url(b"not a picture", "image/webp").unwrap().starts_with("data:image/webp;base64,"));
    }
}

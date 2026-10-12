//! Who is signed in, for the Start menu: their name and their account picture.
//!
//! The name is the one Windows displays; where it will not give one (an
//! organisation's account often has none to give a program) it is made from the
//! sign-in name. The picture is the one Windows keeps for the account, found in
//! the registry by the account's id, in the size nearest what is wanted.

use serde::Serialize;
use windows::core::{PWSTR, PCWSTR};
use windows::Win32::Foundation::{CloseHandle, HANDLE, HLOCAL};
use windows::Win32::Security::Authentication::Identity::{GetUserNameExW, NameDisplay};
use windows::Win32::Security::Authorization::ConvertSidToStringSidW;
use windows::Win32::Security::{GetTokenInformation, TokenUser, TOKEN_QUERY, TOKEN_USER};
use windows::Win32::System::Registry::{RegGetValueW, HKEY_LOCAL_MACHINE, RRF_RT_REG_SZ};
use windows::Win32::System::Threading::{GetCurrentProcess, OpenProcessToken};

#[derive(Debug, Clone, Serialize, Default, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Profile {
    pub name: String,
    /// The account picture as a `data:` address, or empty.
    pub picture: String,
}

/// A name for the person from how they sign in: `azuread\jakepascoe` is
/// "Jakepascoe", `DESKTOP-1\anna_lee` is "Anna Lee". It cannot know where the
/// capitals go, so it only makes a start of each word.
pub fn name_from_sign_in(sign_in: &str) -> String {
    let user = sign_in.rsplit(['\\', '/']).next().unwrap_or(sign_in);
    let user = user.split('@').next().unwrap_or(user);
    let words: Vec<String> = user
        .split(['.', '_', ' ', '-'])
        .filter(|w| !w.is_empty())
        .map(|w| {
            let mut chars = w.chars();
            match chars.next() {
                Some(first) => first.to_uppercase().collect::<String>() + chars.as_str(),
                None => String::new(),
            }
        })
        .collect();
    if words.is_empty() { "You".into() } else { words.join(" ") }
}

fn display_name() -> Option<String> {
    let mut size = 0u32;
    unsafe {
        // the first call says how much room it needs
        let _ = GetUserNameExW(NameDisplay, None, &mut size);
        if size == 0 {
            return None;
        }
        let mut buf = vec![0u16; size as usize + 1];
        let mut len = buf.len() as u32;
        if !GetUserNameExW(NameDisplay, Some(PWSTR(buf.as_mut_ptr())), &mut len) {
            return None;
        }
        let name = String::from_utf16_lossy(&buf[..len as usize]);
        (!name.trim().is_empty()).then_some(name)
    }
}

/// The text form of the signed-in user's id (`S-1-5-21-...`).
fn user_sid() -> Option<String> {
    unsafe {
        let mut token = HANDLE::default();
        OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &mut token).ok()?;
        let result = (|| {
            let mut needed = 0u32;
            let _ = GetTokenInformation(token, TokenUser, None, 0, &mut needed);
            if needed == 0 {
                return None;
            }
            let mut buf = vec![0u8; needed as usize];
            GetTokenInformation(token, TokenUser, Some(buf.as_mut_ptr() as *mut _), needed, &mut needed).ok()?;
            let user = &*(buf.as_ptr() as *const TOKEN_USER);
            let mut text = PWSTR::null();
            ConvertSidToStringSidW(user.User.Sid, &mut text).ok()?;
            let sid = text.to_string().ok();
            let _ = windows::Win32::Foundation::LocalFree(Some(HLOCAL(text.0 as *mut _)));
            sid
        })();
        let _ = CloseHandle(token);
        result
    }
}

fn registry_string(subkey: &str, value: &str) -> Option<String> {
    let key: Vec<u16> = subkey.encode_utf16().chain(std::iter::once(0)).collect();
    let name: Vec<u16> = value.encode_utf16().chain(std::iter::once(0)).collect();
    let mut buf = vec![0u16; 1024];
    let mut size = (buf.len() * 2) as u32;
    let rc = unsafe {
        RegGetValueW(
            HKEY_LOCAL_MACHINE,
            PCWSTR(key.as_ptr()),
            PCWSTR(name.as_ptr()),
            RRF_RT_REG_SZ,
            None,
            Some(buf.as_mut_ptr() as *mut _),
            Some(&mut size),
        )
    };
    if rc.0 != 0 {
        return None;
    }
    let len = (size as usize / 2).saturating_sub(1);
    Some(String::from_utf16_lossy(&buf[..len]))
}

/// The account picture as a `data:` address, if Windows has one for this account.
fn picture() -> Option<String> {
    let sid = user_sid()?;
    let key = format!(r"SOFTWARE\Microsoft\Windows\CurrentVersion\AccountPicture\Users\{sid}");
    // the size nearest what a small round portrait wants
    let path = ["Image96", "Image64", "Image192", "Image48", "Image208"]
        .iter()
        .find_map(|v| registry_string(&key, v))?;
    let bytes = std::fs::read(&path).ok()?;
    if bytes.is_empty() || bytes.len() > 2_000_000 {
        return None;
    }
    let mime = if path.to_ascii_lowercase().ends_with(".png") { "image/png" } else { "image/jpeg" };
    Some(format!("data:{mime};base64,{}", super::media::base64(&bytes)))
}

/// Who is signed in.
pub fn read() -> Profile {
    let sign_in = std::env::var("USERNAME").unwrap_or_default();
    Profile {
        name: display_name().unwrap_or_else(|| name_from_sign_in(&sign_in)),
        picture: picture().unwrap_or_default(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_name_is_made_from_how_someone_signs_in() {
        assert_eq!(name_from_sign_in(r"azuread\jakepascoe"), "Jakepascoe");
        assert_eq!(name_from_sign_in(r"DESKTOP-1\anna_lee"), "Anna Lee");
        assert_eq!(name_from_sign_in("sam.jones@example.com"), "Sam Jones");
        assert_eq!(name_from_sign_in(""), "You");
    }

    #[test]
    fn reading_the_profile_never_fails() {
        let p = read();
        assert!(!p.name.is_empty());
        assert!(p.picture.is_empty() || p.picture.starts_with("data:image/"));
    }

    /// Prints who this machine thinks is signed in. `cargo test --lib who_is_signed_in -- --ignored --nocapture`
    #[test]
    #[ignore]
    fn who_is_signed_in() {
        let p = read();
        println!("name: {:?}; picture: {} chars; sid: {:?}", p.name, p.picture.len(), user_sid());
    }
}

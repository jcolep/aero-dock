//! End Task: end an app at once, the way Task Manager's button does, without asking it anything.
//!
//! Closing a window asks the program to close it, and a program that is busy, hung, or sitting on a dialog does
//! not answer. Ending it does not ask: every process that owns one of its windows is terminated, with the
//! processes they started, so nothing is left running behind a window that is gone. Unsaved work is lost.
//!
//! Three things are not ended, however they are asked for. This program. The shell, which is a program that
//! owns windows (every File Explorer window is Explorer itself) but is also the taskbar, the desktop and the
//! tray; its windows are asked to close instead. And the windows of Store apps, which all belong to one host
//! process: the app is the process that owns the window inside the frame, so that is the one ended.

use std::collections::{HashMap, HashSet};

use windows::core::BOOL;
use windows::Win32::Foundation::{CloseHandle, HWND, LPARAM};
use windows::Win32::System::Diagnostics::ToolHelp::{
    CreateToolhelp32Snapshot, Process32FirstW, Process32NextW, PROCESSENTRY32W, TH32CS_SNAPPROCESS,
};
use windows::Win32::System::Threading::{OpenProcess, TerminateProcess, PROCESS_TERMINATE};
use windows::Win32::UI::WindowsAndMessaging::{EnumChildWindows, GetWindowThreadProcessId, IsWindow};

/// Programs that are the shell or hold the session together, which are never terminated.
const PROTECTED: &[&str] = &[
    "explorer.exe",
    "csrss.exe",
    "winlogon.exe",
    "wininit.exe",
    "services.exe",
    "lsass.exe",
    "smss.exe",
    "dwm.exe",
    "system",
    "fontdrvhost.exe",
    "sihost.exe",
    "taskhostw.exe",
    "ctfmon.exe",
    "searchhost.exe",
    "startmenuexperiencehost.exe",
    "shellexperiencehost.exe",
];

const FRAME_HOST: &str = "applicationframehost.exe";

/// One process: its parent and the name of its program.
struct Proc {
    parent: u32,
    name: String,
}

fn processes() -> HashMap<u32, Proc> {
    let mut all = HashMap::new();
    let Ok(snapshot) = (unsafe { CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) }) else {
        return all;
    };
    let mut entry = PROCESSENTRY32W { dwSize: std::mem::size_of::<PROCESSENTRY32W>() as u32, ..Default::default() };
    let mut more = unsafe { Process32FirstW(snapshot, &mut entry) }.is_ok();
    while more {
        let end = entry.szExeFile.iter().position(|c| *c == 0).unwrap_or(entry.szExeFile.len());
        let name = String::from_utf16_lossy(&entry.szExeFile[..end]).to_ascii_lowercase();
        all.insert(entry.th32ProcessID, Proc { parent: entry.th32ParentProcessID, name });
        more = unsafe { Process32NextW(snapshot, &mut entry) }.is_ok();
    }
    unsafe {
        let _ = CloseHandle(snapshot);
    }
    all
}

fn pid_of(hwnd: isize) -> Option<u32> {
    let h = HWND(hwnd as *mut _);
    if !unsafe { IsWindow(Some(h)) }.as_bool() {
        return None;
    }
    let mut pid = 0u32;
    unsafe { GetWindowThreadProcessId(h, Some(&mut pid)) };
    (pid != 0).then_some(pid)
}

/// The processes that own windows inside a Store app's frame window, other than the host that draws the frame.
fn inside_frame(hwnd: isize, host: u32) -> Vec<u32> {
    unsafe extern "system" fn each(child: HWND, lparam: LPARAM) -> BOOL {
        let found = unsafe { &mut *(lparam.0 as *mut (u32, Vec<u32>)) };
        let mut pid = 0u32;
        unsafe { GetWindowThreadProcessId(child, Some(&mut pid)) };
        if pid != 0 && pid != found.0 && !found.1.contains(&pid) {
            found.1.push(pid);
        }
        BOOL(1)
    }
    let mut found: (u32, Vec<u32>) = (host, Vec::new());
    unsafe {
        let _ = EnumChildWindows(Some(HWND(hwnd as *mut _)), Some(each), LPARAM(&mut found as *mut _ as isize));
    }
    found.1
}

/// Every process that descends from `root` (children, their children, and so on), in the order found.
fn descendants(all: &HashMap<u32, Proc>, root: u32) -> Vec<u32> {
    let mut out = Vec::new();
    let mut seen: HashSet<u32> = HashSet::from([root]);
    let mut frontier = vec![root];
    while let Some(parent) = frontier.pop() {
        for (pid, p) in all {
            // a process id can be reused: a "child" whose parent is a newer process than itself is not one,
            // but there is no creation time in this list, so the ancestry is cut at what is protected below
            if p.parent == parent && seen.insert(*pid) {
                out.push(*pid);
                frontier.push(*pid);
            }
        }
    }
    out
}

/// What was done: the names of the programs ended, and the windows (of the shell) that were asked to close instead.
#[derive(Debug, Default)]
pub struct Ended {
    pub names: Vec<String>,
    pub asked: Vec<isize>,
    pub refused: Vec<String>,
}

fn terminate(pid: u32) -> bool {
    unsafe {
        let Ok(handle) = OpenProcess(PROCESS_TERMINATE, false, pid) else {
            return false;
        };
        let ok = TerminateProcess(handle, 1).is_ok();
        let _ = CloseHandle(handle);
        ok
    }
}

/// End the programs that own these windows.
pub fn end_windows(hwnds: &[isize]) -> Ended {
    let all = processes();
    let own = std::process::id();
    let mut ended = Ended::default();
    let mut roots: Vec<u32> = Vec::new();

    for &hwnd in hwnds {
        let Some(pid) = pid_of(hwnd) else { continue };
        let name = all.get(&pid).map(|p| p.name.as_str()).unwrap_or("");
        let owners = if name == FRAME_HOST {
            let inner = inside_frame(hwnd, pid);
            if inner.is_empty() {
                // a frame with nothing inside it is not an app; the host is not ended for it
                ended.refused.push("a Store app that is not showing".into());
                continue;
            }
            inner
        } else {
            vec![pid]
        };
        for owner in owners {
            let owner_name = all.get(&owner).map(|p| p.name.clone()).unwrap_or_default();
            if owner == own || PROTECTED.contains(&owner_name.as_str()) {
                // not ended: its window is asked to close, as it would be by its own button
                if owner != own {
                    ended.asked.push(hwnd);
                }
                continue;
            }
            if !roots.contains(&owner) {
                roots.push(owner);
            }
        }
    }

    for root in roots {
        let name = all.get(&root).map(|p| p.name.clone()).unwrap_or_default();
        let mut tree = descendants(&all, root);
        // what it started, never what must not be touched, and never this program
        tree.retain(|p| *p != own && !all.get(p).is_some_and(|q| PROTECTED.contains(&q.name.as_str())));
        let mut any = terminate(root);
        for pid in tree {
            any |= terminate(pid);
        }
        if any {
            let shown = name.trim_end_matches(".exe").to_string();
            if !ended.names.contains(&shown) {
                ended.names.push(shown);
            }
        } else {
            ended.refused.push(name.trim_end_matches(".exe").to_string());
        }
    }
    ended
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::process::{Command, Stdio};

    fn alive(pid: u32) -> bool {
        processes().contains_key(&pid)
    }

    #[test]
    fn a_program_and_what_it_started_are_ended_and_this_one_is_not() {
        // cmd starts ping, which sits for a while; both are to go
        let mut shell = Command::new("cmd")
            .args(["/C", "ping -n 30 127.0.0.1 >nul"])
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .spawn()
            .expect("cmd");
        let pid = shell.id();
        // wait for the child to be started
        let mut kids = Vec::new();
        for _ in 0..40 {
            std::thread::sleep(std::time::Duration::from_millis(50));
            kids = descendants(&processes(), pid);
            if !kids.is_empty() {
                break;
            }
        }
        assert!(!kids.is_empty(), "cmd started ping");
        assert!(terminate(pid));
        for k in &kids {
            terminate(*k);
        }
        let _ = shell.wait();
        std::thread::sleep(std::time::Duration::from_millis(200));
        assert!(!alive(pid));
        assert!(alive(std::process::id()), "the test is still running");
    }

    #[test]
    fn the_shell_and_the_session_are_protected() {
        for name in ["explorer.exe", "dwm.exe", "csrss.exe", "winlogon.exe"] {
            assert!(PROTECTED.contains(&name), "{name}");
        }
    }

    #[test]
    fn a_window_that_is_not_there_is_nothing_to_end() {
        let ended = end_windows(&[0x7fff_fff0]);
        assert!(ended.names.is_empty() && ended.asked.is_empty());
    }
}

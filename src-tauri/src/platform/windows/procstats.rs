//! What the machine is busy with: the programs using the most processor and
//! memory, and how fast data is moving over the network.
//!
//! Like the total CPU figure next door (`sysstats`), none of this is a number
//! Windows hands out: CPU is how much time a process used between two looks,
//! and network speed is how many bytes moved between two looks. The previous
//! look is kept here, so each call reports since the last one, and the first
//! call after start (which has nothing to compare with) reports zero speed.
//!
//! All read only. Processes this program may not look inside (protected system
//! ones) are left out of the CPU figures rather than guessed at.

use std::collections::HashMap;
use std::sync::OnceLock;
use std::time::Instant;

use parking_lot::Mutex;
use serde::Serialize;
use windows::Win32::Foundation::{CloseHandle, FILETIME, HANDLE};
use windows::Win32::NetworkManagement::IpHelper::{FreeMibTable, GetIfTable2, MIB_IF_TABLE2};
use windows::Win32::NetworkManagement::Ndis::IfOperStatusUp;
use windows::Win32::System::Diagnostics::ToolHelp::{
    CreateToolhelp32Snapshot, Process32FirstW, Process32NextW, PROCESSENTRY32W, TH32CS_SNAPPROCESS,
};
use windows::Win32::System::ProcessStatus::{GetProcessMemoryInfo, PROCESS_MEMORY_COUNTERS};
use windows::Win32::System::SystemInformation::GetSystemInfo;
use windows::Win32::System::Threading::{
    GetProcessTimes, OpenProcess, PROCESS_QUERY_LIMITED_INFORMATION,
};

/// A program (all of its processes together) and what it is using.
#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Program {
    pub name: String,
    /// Of the whole machine's processor, 0 to 100.
    pub cpu_percent: f32,
    pub memory_mb: u64,
    /// How many processes it is.
    pub processes: u32,
}

/// One process, as sampled.
#[derive(Debug, Clone, PartialEq)]
pub struct Sample {
    pub name: String,
    pub cpu_percent: f32,
    pub memory_mb: u64,
}

/// Processes with the same name are one program: a browser is a dozen
/// processes and a person thinks of it as one thing.
pub fn group(samples: Vec<Sample>) -> Vec<Program> {
    let mut by_name: HashMap<String, Program> = HashMap::new();
    for s in samples {
        let key = s.name.to_lowercase();
        let entry = by_name.entry(key).or_insert_with(|| Program {
            name: s.name.trim_end_matches(".exe").trim_end_matches(".EXE").to_string(),
            cpu_percent: 0.0,
            memory_mb: 0,
            processes: 0,
        });
        entry.cpu_percent += s.cpu_percent;
        entry.memory_mb += s.memory_mb;
        entry.processes += 1;
    }
    by_name.into_values().collect()
}

/// The `limit` programs using the most of what is asked for, most first.
pub fn rank(mut programs: Vec<Program>, by_cpu: bool, limit: usize) -> Vec<Program> {
    programs.sort_by(|a, b| {
        let (x, y) = if by_cpu {
            (b.cpu_percent, a.cpu_percent)
        } else {
            (b.memory_mb as f32, a.memory_mb as f32)
        };
        x.partial_cmp(&y).unwrap_or(std::cmp::Ordering::Equal).then_with(|| a.name.cmp(&b.name))
    });
    programs.truncate(limit);
    programs
}

fn ticks(ft: FILETIME) -> u64 {
    ((ft.dwHighDateTime as u64) << 32) | ft.dwLowDateTime as u64
}

fn processor_count() -> u32 {
    static COUNT: OnceLock<u32> = OnceLock::new();
    *COUNT.get_or_init(|| {
        let mut info = Default::default();
        unsafe { GetSystemInfo(&mut info) };
        info.dwNumberOfProcessors.max(1)
    })
}

/// The CPU time each process had used at the last look, and when that was.
static LAST: Mutex<Option<(Instant, HashMap<u32, u64>)>> = Mutex::new(None);

/// Every process, with the processor it used since the last call.
pub fn sample() -> Vec<Sample> {
    let Ok(snapshot) = (unsafe { CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) }) else {
        return Vec::new();
    };
    let now = Instant::now();
    let previous = LAST.lock().take();
    let mut used_now: HashMap<u32, u64> = HashMap::new();
    let mut out = Vec::new();

    let mut entry = PROCESSENTRY32W { dwSize: std::mem::size_of::<PROCESSENTRY32W>() as u32, ..Default::default() };
    let mut more = unsafe { Process32FirstW(snapshot, &mut entry) }.is_ok();
    while more {
        let pid = entry.th32ProcessID;
        let name = {
            let end = entry.szExeFile.iter().position(|c| *c == 0).unwrap_or(entry.szExeFile.len());
            String::from_utf16_lossy(&entry.szExeFile[..end])
        };
        if pid != 0 {
            let mut cpu = 0.0f32;
            let mut memory_mb = 0u64;
            if let Ok(handle) = unsafe { OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, false, pid) } {
                let (mut created, mut exited, mut kernel, mut user) =
                    (FILETIME::default(), FILETIME::default(), FILETIME::default(), FILETIME::default());
                if unsafe { GetProcessTimes(handle, &mut created, &mut exited, &mut kernel, &mut user) }.is_ok() {
                    let used = ticks(kernel) + ticks(user);
                    used_now.insert(pid, used);
                    if let Some((then, before)) = &previous {
                        if let Some(was) = before.get(&pid) {
                            // 100 ns units; a process can use every processor at once
                            let elapsed = now.duration_since(*then).as_nanos() as f64 / 100.0;
                            if elapsed > 0.0 {
                                let delta = used.saturating_sub(*was) as f64;
                                cpu = (delta / (elapsed * processor_count() as f64) * 100.0) as f32;
                            }
                        }
                    }
                }
                let mut counters = PROCESS_MEMORY_COUNTERS {
                    cb: std::mem::size_of::<PROCESS_MEMORY_COUNTERS>() as u32,
                    ..Default::default()
                };
                if unsafe { GetProcessMemoryInfo(handle, &mut counters, counters.cb) }.is_ok() {
                    memory_mb = counters.WorkingSetSize as u64 / (1024 * 1024);
                }
                unsafe {
                    let _ = CloseHandle(handle);
                }
            }
            out.push(Sample { name, cpu_percent: cpu.clamp(0.0, 100.0), memory_mb });
        }
        more = unsafe { Process32NextW(snapshot, &mut entry) }.is_ok();
    }
    unsafe {
        let _ = CloseHandle(HANDLE(snapshot.0));
    }
    *LAST.lock() = Some((now, used_now));
    out
}

/// The `limit` programs using the most processor (or memory, with `by_cpu` off).
pub fn top(by_cpu: bool, limit: usize) -> Vec<Program> {
    rank(group(sample()), by_cpu, limit)
}

// ---- the network ----

/// How fast data is moving, in bytes a second.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Throughput {
    pub down: u64,
    pub up: u64,
}

/// Bytes received and sent by every adapter that is up and is real (not the
/// loopback or a tunnel), at the last look, and when.
static LAST_NET: Mutex<Option<(Instant, u64, u64)>> = Mutex::new(None);

/// Ethernet, Wi-Fi and the like: the kinds of adapter that carry traffic off
/// the machine, as `IfType` numbers.
fn is_real_link(if_type: u32) -> bool {
    matches!(if_type, 6 | 71 | 62 | 117 | 144)
}

fn totals() -> Option<(u64, u64)> {
    let mut table: *mut MIB_IF_TABLE2 = std::ptr::null_mut();
    if unsafe { GetIfTable2(&mut table) }.0 != 0 || table.is_null() {
        return None;
    }
    let (mut down, mut up) = (0u64, 0u64);
    unsafe {
        let t = &*table;
        let rows = std::slice::from_raw_parts(t.Table.as_ptr(), t.NumEntries as usize);
        for row in rows {
            if row.OperStatus == IfOperStatusUp && is_real_link(row.Type) {
                down += row.InOctets;
                up += row.OutOctets;
            }
        }
        FreeMibTable(table as *const _);
    }
    Some((down, up))
}

/// Bytes a second over `seconds`, from two byte counts.
pub fn rate(before: u64, after: u64, seconds: f64) -> u64 {
    if seconds <= 0.0 {
        return 0;
    }
    (after.saturating_sub(before) as f64 / seconds).round() as u64
}

/// Network speed since the last call.
pub fn throughput() -> Throughput {
    let Some((down, up)) = totals() else { return Throughput::default() };
    let now = Instant::now();
    let previous = LAST_NET.lock().replace((now, down, up));
    match previous {
        Some((then, d0, u0)) => {
            let seconds = now.duration_since(then).as_secs_f64();
            Throughput { down: rate(d0, down, seconds), up: rate(u0, up, seconds) }
        }
        None => Throughput::default(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn s(name: &str, cpu: f32, mb: u64) -> Sample {
        Sample { name: name.into(), cpu_percent: cpu, memory_mb: mb }
    }

    #[test]
    fn processes_with_one_name_are_one_program() {
        let grouped = group(vec![s("chrome.exe", 4.0, 300), s("Chrome.exe", 1.5, 200), s("code.exe", 2.0, 500)]);
        let chrome = grouped.iter().find(|p| p.name == "chrome").expect("grouped by name, any case");
        assert_eq!(chrome.processes, 2);
        assert_eq!(chrome.memory_mb, 500);
        assert!((chrome.cpu_percent - 5.5).abs() < 1e-6);
        assert_eq!(grouped.len(), 2);
    }

    #[test]
    fn the_ranking_is_by_what_is_asked_for_and_is_cut_short() {
        let programs = group(vec![s("a.exe", 1.0, 900), s("b.exe", 9.0, 100), s("c.exe", 5.0, 400), s("d.exe", 5.0, 50)]);
        let by_cpu = rank(programs.clone(), true, 3);
        assert_eq!(by_cpu.iter().map(|p| p.name.as_str()).collect::<Vec<_>>(), vec!["b", "c", "d"]);
        let by_memory = rank(programs, false, 2);
        assert_eq!(by_memory.iter().map(|p| p.name.as_str()).collect::<Vec<_>>(), vec!["a", "c"]);
    }

    #[test]
    fn a_rate_is_bytes_over_seconds_and_never_negative() {
        assert_eq!(rate(1_000, 3_000, 2.0), 1_000);
        // a counter that went backwards (an adapter reset) is not a speed
        assert_eq!(rate(5_000, 1_000, 1.0), 0);
        assert_eq!(rate(0, 100, 0.0), 0);
    }

    #[test]
    fn only_traffic_carrying_adapters_count() {
        assert!(is_real_link(6) && is_real_link(71));
        assert!(!is_real_link(24), "the loopback is not a link");
        assert!(!is_real_link(131), "a tunnel is not a link");
    }

    #[test]
    fn the_machine_can_be_sampled_here() {
        // reading only; the second look has something to compare with
        let _ = sample();
        std::thread::sleep(std::time::Duration::from_millis(150));
        let programs = rank(group(sample()), true, 5);
        assert!(!programs.is_empty(), "a machine runs something");
        assert!(programs.iter().all(|p| p.cpu_percent >= 0.0 && p.cpu_percent <= 100.0));
        let _ = throughput();
    }
}

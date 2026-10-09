//! Records for finding out why the app stopped.
//!
//! Two files, both beside the settings:
//!
//!   - `crash.log`, always: a panic with where it happened and which thread
//!     it was on, or a native exception of the kind that ends a process. A
//!     panic on a thread Windows does not treat as fatal ends the app with no
//!     error dialog and no entry in the event log, so without this nothing
//!     at all would be left to read.
//!   - `trace.log`, only when asked for (a file named `trace.on` beside the
//!     settings, or the `AERO_TRACE` environment variable): a line for each
//!     step of the things that have gone wrong before, flushed as it is
//!     written, so the last line is the last thing that happened. It is off
//!     by default because it is a write to disk on every window placement.

use std::fs::{File, OpenOptions};
use std::io::Write;
use std::sync::OnceLock;
use std::time::Instant;

use parking_lot::Mutex;

struct Trace {
    file: Mutex<File>,
    started: Instant,
}

static TRACE: OnceLock<Trace> = OnceLock::new();

/// Open (and empty) `trace.log` if tracing was asked for. Without this, `log`
/// does nothing.
pub fn init() {
    let Some(crash) = super::paths::crash_log_path() else {
        return;
    };
    let switch = crash.with_file_name("trace.on");
    if std::env::var_os("AERO_TRACE").is_none() && !switch.is_file() {
        return;
    }
    if let Some(dir) = crash.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    if let Ok(file) = File::create(crash.with_file_name("trace.log")) {
        let _ = TRACE.set(Trace {
            file: Mutex::new(file),
            started: Instant::now(),
        });
    }
}

/// Add one line to the trace: seconds since launch, the thread, and the
/// message. Costs a branch when tracing is off.
pub fn log(message: &str) {
    let Some(trace) = TRACE.get() else {
        return;
    };
    let thread = std::thread::current();
    let line = format!(
        "{:9.3} [{}] {message}\n",
        trace.started.elapsed().as_secs_f64(),
        thread.name().unwrap_or("unnamed")
    );
    let mut file = trace.file.lock();
    let _ = file.write_all(line.as_bytes());
    let _ = file.flush();
}

/// `trace!("placing {}", name)`
#[macro_export]
macro_rules! trace {
    ($($arg:tt)*) => {
        if $crate::core::trace::enabled() {
            $crate::core::trace::log(&format!($($arg)*))
        }
    };
}

/// Whether `trace!` will write anything. Lets the macro skip building its
/// message when it would only be thrown away.
pub fn enabled() -> bool {
    TRACE.get().is_some()
}

/// Add an entry to `crash.log`.
pub fn crash(entry: &str) {
    let Some(path) = super::paths::crash_log_path() else {
        return;
    };
    if let Some(dir) = path.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(path) {
        let _ = file.write_all(entry.as_bytes());
    }
}

fn unix_time() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_or(0, |d| d.as_secs())
}

/// Write any panic to `crash.log` before it goes any further.
pub fn install_panic_log() {
    let previous = std::panic::take_hook();
    std::panic::set_hook(Box::new(move |info| {
        crate::trace!("PANIC: {info}");
        let thread = std::thread::current();
        crash(&format!(
            "[unix time {}] thread '{}'\n{info}\n{}\n\n",
            unix_time(),
            thread.name().unwrap_or("unnamed"),
            std::backtrace::Backtrace::force_capture()
        ));
        previous(info);
    }));
}

/// Record a native exception (a crash that is not a Rust panic) before it
/// takes the process down. It only writes; it never handles anything, so the
/// system still deals with the exception as it would have.
#[cfg(windows)]
pub fn log_native_exceptions() {
    use windows::Win32::System::Diagnostics::Debug::{
        AddVectoredExceptionHandler, EXCEPTION_POINTERS,
    };

    unsafe extern "system" fn handler(info: *mut EXCEPTION_POINTERS) -> i32 {
        const CONTINUE_SEARCH: i32 = 0;
        if let Some(info) = unsafe { info.as_ref() } {
            if let Some(record) = unsafe { info.ExceptionRecord.as_ref() } {
                let code = record.ExceptionCode.0 as u32;
                // plenty of exceptions are raised and handled as a matter of
                // course (C++ throws, debugger probes); only the ones that
                // are usually fatal are worth a line
                let fatal = matches!(
                    code,
                    0xC000_0005 // access violation
                        | 0xC000_00FD // stack overflow
                        | 0xC000_0374 // heap corruption
                        | 0xC000_0409 // fast fail
                        | 0xC000_001D // illegal instruction
                        | 0xC000_0094 // integer divide by zero
                        | 0xC000_0096 // privileged instruction
                );
                if fatal {
                    crash(&format!(
                        "[unix time {}] native exception {code:#010x} at {:?}\n",
                        unix_time(),
                        record.ExceptionAddress
                    ));
                }
            }
        }
        CONTINUE_SEARCH
    }

    unsafe {
        AddVectoredExceptionHandler(1, Some(handler));
    }
}

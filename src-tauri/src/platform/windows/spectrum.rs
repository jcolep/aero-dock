//! The sound wave in the Now Playing card: what the speakers are playing, as
//! a row of bars.
//!
//! It listens to the default output the way a recorder of "what you hear"
//! does (a loopback capture, which needs no permission and does not touch the
//! microphone), takes the last few milliseconds, and says how loud each band of
//! pitch is. The samples are not kept or sent anywhere: a dozen bytes of bar
//! heights leave this file, thirty times a second, to the one window that draws
//! them. It runs only while the card keeps asking for it, and stops by itself
//! when it stops being asked.
//!
//! It hears everything that is playing, not just the one program, which for a
//! card that shows the program playing now is the same thing nearly always.

use std::f32::consts::PI;
use std::sync::atomic::{AtomicBool, AtomicI64, Ordering};
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

use tauri::{AppHandle, Emitter};

/// How many bars.
pub const BANDS: usize = 24;
/// Samples looked at once: about 21 ms at 48 kHz.
const FFT_SIZE: usize = 1024;
/// The event the bars go out on.
pub const EVENT: &str = "media://spectrum";
/// The thread stops this long after the last time it was asked for.
const KEEP_FOR_MS: i64 = 3_500;

// ---- the arithmetic: no windows in this part ----

/// The size of each frequency in a stretch of samples (the first half of the
/// spectrum; the second is its mirror). The samples are shaped by a Hann window
/// first so that the edges of the stretch do not smear into every band.
fn magnitudes(samples: &[f32]) -> Vec<f32> {
    let n = FFT_SIZE;
    let mut re = vec![0f32; n];
    let mut im = vec![0f32; n];
    let take = samples.len().min(n);
    let from = samples.len() - take;
    for i in 0..take {
        let window = 0.5 - 0.5 * (2.0 * PI * i as f32 / (n as f32 - 1.0)).cos();
        re[i] = samples[from + i] * window;
    }

    // bit-reversal order
    let mut j = 0usize;
    for i in 1..n {
        let mut bit = n >> 1;
        while j & bit != 0 {
            j ^= bit;
            bit >>= 1;
        }
        j ^= bit;
        if i < j {
            re.swap(i, j);
            im.swap(i, j);
        }
    }
    // butterflies
    let mut len = 2;
    while len <= n {
        let step = -2.0 * PI / len as f32;
        let (wr, wi) = (step.cos(), step.sin());
        for start in (0..n).step_by(len) {
            let (mut cr, mut ci) = (1.0f32, 0.0f32);
            for k in 0..len / 2 {
                let (a, b) = (start + k, start + k + len / 2);
                let tr = re[b] * cr - im[b] * ci;
                let ti = re[b] * ci + im[b] * cr;
                re[b] = re[a] - tr;
                im[b] = im[a] - ti;
                re[a] += tr;
                im[a] += ti;
                let next = cr * wr - ci * wi;
                ci = cr * wi + ci * wr;
                cr = next;
            }
        }
        len <<= 1;
    }
    (0..n / 2).map(|i| (re[i] * re[i] + im[i] * im[i]).sqrt()).collect()
}

/// The quietest level that shows, in decibels below the loudest.
const FLOOR_DB: f32 = -62.0;
/// What a full-scale sine measures after the window: a quarter of the size.
const FULL_SCALE: f32 = FFT_SIZE as f32 / 4.0;
/// Music is loud at the bottom and quiet at the top; the bars are tilted up
/// toward the treble by this much over their length so that they all move.
const TILT_DB: f32 = 14.0;

/// How loud each of the bars is, 0 to 255: bands spaced evenly in pitch from
/// 50 Hz up to 16 kHz (or what the rate can hold), the loudest bin in each.
pub fn bands(samples: &[f32], rate: u32) -> [u8; BANDS] {
    let mut out = [0u8; BANDS];
    if samples.len() < 64 || rate < 8_000 {
        return out;
    }
    let mags = magnitudes(samples);
    let top = (rate as f32 / 2.0 - 1.0).min(16_000.0);
    let low = 50.0f32;
    let bin_hz = rate as f32 / FFT_SIZE as f32;
    for (i, slot) in out.iter_mut().enumerate() {
        let f0 = low * (top / low).powf(i as f32 / BANDS as f32);
        let f1 = low * (top / low).powf((i + 1) as f32 / BANDS as f32);
        let first = ((f0 / bin_hz).floor() as usize).clamp(1, mags.len() - 1);
        let last = ((f1 / bin_hz).ceil() as usize).clamp(first + 1, mags.len());
        let peak = mags[first..last].iter().cloned().fold(0.0f32, f32::max);
        let db = 20.0 * (peak / FULL_SCALE).max(1e-9).log10() + TILT_DB * i as f32 / BANDS as f32;
        *slot = (((db - FLOOR_DB) / -FLOOR_DB).clamp(0.0, 1.0) * 255.0) as u8;
    }
    out
}

// ---- listening ----

static RUNNING: AtomicBool = AtomicBool::new(false);
static WANTED_UNTIL_MS: AtomicI64 = AtomicI64::new(0);

fn now_ms() -> i64 {
    SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as i64).unwrap_or(0)
}

/// The card is open and wants the bars: start listening if not, and say that
/// it is still wanted. Call again every second or so for as long as it is.
pub fn keep_alive(app: &AppHandle) {
    WANTED_UNTIL_MS.store(now_ms() + KEEP_FOR_MS, Ordering::SeqCst);
    if RUNNING.swap(true, Ordering::SeqCst) {
        return;
    }
    let app = app.clone();
    let spawned = std::thread::Builder::new().name("spectrum".into()).spawn(move || {
        let emit = |bars: Vec<u8>| {
            let _ = app.emit_to(crate::commands::menubar::LABEL, EVENT, bars);
        };
        if let Err(why) = listen(&emit) {
            log::debug!("the sound wave stopped: {why}");
        }
        RUNNING.store(false, Ordering::SeqCst);
    });
    if spawned.is_err() {
        RUNNING.store(false, Ordering::SeqCst);
    }
}

/// Stop listening now (the card closed).
pub fn stop() {
    WANTED_UNTIL_MS.store(0, Ordering::SeqCst);
}

/// How a block of the system's mix is laid out, as far as this needs to know.
#[derive(Clone, Copy)]
struct Layout {
    channels: usize,
    rate: u32,
    bits: u16,
    float: bool,
}

/// Add a block of interleaved samples to `mono`, averaging the channels.
fn push_mono(block: &[u8], layout: Layout, mono: &mut Vec<f32>) {
    let bytes = (layout.bits / 8) as usize;
    let frame = bytes * layout.channels;
    if bytes == 0 || frame == 0 {
        return;
    }
    for f in block.chunks_exact(frame) {
        let mut sum = 0.0f32;
        for c in 0..layout.channels {
            let s = &f[c * bytes..(c + 1) * bytes];
            sum += match (layout.float, layout.bits) {
                (true, 32) => f32::from_le_bytes([s[0], s[1], s[2], s[3]]),
                (false, 16) => i16::from_le_bytes([s[0], s[1]]) as f32 / 32768.0,
                (false, 32) => i32::from_le_bytes([s[0], s[1], s[2], s[3]]) as f32 / 2_147_483_648.0,
                (false, 24) => (i32::from_le_bytes([0, s[0], s[1], s[2]]) >> 8) as f32 / 8_388_608.0,
                _ => 0.0,
            };
        }
        mono.push(sum / layout.channels as f32);
    }
}

fn listen(emit: &dyn Fn(Vec<u8>)) -> Result<(), String> {
    use windows::Win32::Media::Audio::{
        eConsole, eRender, IAudioCaptureClient, IAudioClient, IMMDeviceEnumerator, MMDeviceEnumerator,
        AUDCLNT_BUFFERFLAGS_SILENT, AUDCLNT_SHAREMODE_SHARED, AUDCLNT_STREAMFLAGS_LOOPBACK, WAVEFORMATEX,
        WAVEFORMATEXTENSIBLE,
    };
    use windows::Win32::System::Com::{CoCreateInstance, CoTaskMemFree, CLSCTX_ALL, CLSCTX_INPROC_SERVER};

    let _com = crate::platform::ComApartment::new();
    let err = |e: windows::core::Error| e.to_string();
    unsafe {
        let enumerator: IMMDeviceEnumerator =
            CoCreateInstance(&MMDeviceEnumerator, None, CLSCTX_INPROC_SERVER).map_err(err)?;
        let device = enumerator.GetDefaultAudioEndpoint(eRender, eConsole).map_err(err)?;
        let client: IAudioClient = device.Activate(CLSCTX_ALL, None).map_err(err)?;

        let format = client.GetMixFormat().map_err(err)?;
        let wf: WAVEFORMATEX = std::ptr::read_unaligned(format);
        let float = match wf.wFormatTag {
            3 => true,
            0xFFFE => {
                let ext: WAVEFORMATEXTENSIBLE = std::ptr::read_unaligned(format as *const WAVEFORMATEXTENSIBLE);
                // the first word of the sub-format's id says float (3) or whole numbers (1)
                ext.SubFormat.data1 == 3
            }
            _ => false,
        };
        let layout = Layout { channels: wf.nChannels as usize, rate: wf.nSamplesPerSec, bits: wf.wBitsPerSample, float };

        let started = client.Initialize(
            AUDCLNT_SHAREMODE_SHARED,
            AUDCLNT_STREAMFLAGS_LOOPBACK,
            1_000_000,
            0,
            format,
            None,
        );
        CoTaskMemFree(Some(format as *const _));
        started.map_err(err)?;

        let capture: IAudioCaptureClient = client.GetService().map_err(err)?;
        client.Start().map_err(err)?;

        let mut mono: Vec<f32> = Vec::with_capacity(FFT_SIZE * 4);
        let mut last_heard = Instant::now();
        let mut last_sent = Instant::now();
        let mut quiet_sent = false;
        while now_ms() < WANTED_UNTIL_MS.load(Ordering::SeqCst) {
            std::thread::sleep(Duration::from_millis(12));
            loop {
                let waiting = capture.GetNextPacketSize().map_err(err)?;
                if waiting == 0 {
                    break;
                }
                let (mut data, mut frames, mut flags) = (std::ptr::null_mut(), 0u32, 0u32);
                capture.GetBuffer(&mut data, &mut frames, &mut flags, None, None).map_err(err)?;
                let silent = flags & (AUDCLNT_BUFFERFLAGS_SILENT.0 as u32) != 0 || data.is_null();
                if silent {
                    mono.extend(std::iter::repeat_n(0.0, frames as usize));
                } else {
                    let len = frames as usize * layout.channels * (layout.bits / 8) as usize;
                    push_mono(std::slice::from_raw_parts(data, len), layout, &mut mono);
                    last_heard = Instant::now();
                    quiet_sent = false;
                }
                capture.ReleaseBuffer(frames).map_err(err)?;
            }
            // only the latest stretch matters
            if mono.len() > FFT_SIZE * 2 {
                mono.drain(..mono.len() - FFT_SIZE);
            }

            if last_sent.elapsed() >= Duration::from_millis(33) {
                last_sent = Instant::now();
                if last_heard.elapsed() > Duration::from_millis(250) {
                    // nothing is being played: the capture simply delivers nothing
                    if !quiet_sent {
                        emit(vec![0u8; BANDS]);
                        quiet_sent = true;
                    }
                } else if mono.len() >= FFT_SIZE {
                    let bars = bands(&mono, layout.rate);
                    emit(bars.to_vec());
                }
            }
        }
        let _ = client.Stop();
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sine(hz: f32, rate: u32, n: usize, amplitude: f32) -> Vec<f32> {
        (0..n).map(|i| amplitude * (2.0 * PI * hz * i as f32 / rate as f32).sin()).collect()
    }

    fn loudest(bars: &[u8; BANDS]) -> usize {
        bars.iter().enumerate().max_by_key(|(_, v)| **v).map(|(i, _)| i).unwrap()
    }

    /// Listens to the real output for three seconds and prints the tallest bars
    /// seen. Reads only. `cargo test --lib hears_the_speakers -- --ignored --nocapture`
    #[test]
    #[ignore]
    fn hears_the_speakers() {
        use std::sync::Mutex;
        let seen = Mutex::new(Vec::<Vec<u8>>::new());
        WANTED_UNTIL_MS.store(now_ms() + 3_000, Ordering::SeqCst);
        listen(&|bars| seen.lock().unwrap().push(bars)).expect("listen");
        let seen = seen.into_inner().unwrap();
        let mut peaks = vec![0u8; BANDS];
        for frame in &seen {
            for (p, v) in peaks.iter_mut().zip(frame) {
                *p = (*p).max(*v);
            }
        }
        println!("{} frames; tallest bar per band: {peaks:?}", seen.len());
    }

    #[test]
    fn silence_is_flat() {
        assert_eq!(bands(&vec![0.0; 2048], 48_000), [0u8; BANDS]);
        assert_eq!(bands(&[], 48_000), [0u8; BANDS]);
    }

    #[test]
    fn a_tone_lights_the_bar_for_its_pitch_and_the_higher_the_tone_the_further_along() {
        let mut last = 0;
        for hz in [100.0, 400.0, 1_500.0, 6_000.0, 12_000.0] {
            let bars = bands(&sine(hz, 48_000, 2048, 0.8), 48_000);
            let at = loudest(&bars);
            assert!(bars[at] > 120, "{hz} Hz is loud enough to see ({})", bars[at]);
            assert!(at >= last, "{hz} Hz is at or after the one before ({at} vs {last})");
            // and the far end of the row stays dark for a low tone
            if hz < 500.0 {
                assert!(bars[BANDS - 1] < 40, "{hz} Hz does not light the treble ({})", bars[BANDS - 1]);
            }
            last = at;
        }
        assert!(last > 12, "twelve kilohertz is in the upper half");
    }

    #[test]
    fn louder_sound_is_taller() {
        let quiet = bands(&sine(1_000.0, 48_000, 2048, 0.02), 48_000);
        let loud = bands(&sine(1_000.0, 48_000, 2048, 0.9), 48_000);
        assert!(loud.iter().max() > quiet.iter().max());
    }

    #[test]
    fn the_transform_finds_a_known_frequency_exactly() {
        // a sine that fits the stretch an exact number of times lands in one bin
        let rate = 48_000.0;
        let bin = 32usize;
        let hz = bin as f32 * rate / FFT_SIZE as f32;
        let m = magnitudes(&sine(hz, 48_000, FFT_SIZE, 1.0));
        let (top, _) = m.iter().enumerate().max_by(|a, b| a.1.partial_cmp(b.1).unwrap()).unwrap();
        assert_eq!(top, bin);
    }

    #[test]
    fn samples_of_each_kind_become_the_same_mono_value() {
        let layout = |bits, float| Layout { channels: 2, rate: 48_000, bits, float };
        let mut a = Vec::new();
        push_mono(&[0, 0, 0, 0x3f, 0, 0, 0, 0x3f], layout(32, true), &mut a); // 0.5 and 0.5 as floats
        let mut b = Vec::new();
        push_mono(&[0x00, 0x40, 0x00, 0x40], layout(16, false), &mut b); // 0.5 and 0.5 as 16-bit
        assert!((a[0] - 0.5).abs() < 1e-6 && (b[0] - 0.5).abs() < 1e-4, "{a:?} {b:?}");
        // a half-block at the end is dropped, not read past
        let mut c = Vec::new();
        push_mono(&[0, 0, 0], layout(16, false), &mut c);
        assert!(c.is_empty());
    }
}

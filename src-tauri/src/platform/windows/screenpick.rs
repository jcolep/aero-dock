//! Reading colours off the screen as it is drawn.
//!
//! The frame's fringe has to match what the margin looks like beside a corner, which is the margin's glass over
//! whatever the wallpaper is at that spot. That cannot be worked out (a wallpaper is a picture, and a slideshow
//! changes it), but it can be looked at: a few pixels in the margin, which nothing but the glass and the wallpaper
//! are in. The desktop's own device context gives the composed picture.

use windows::Win32::Graphics::Gdi::{GetDC, GetPixel, ReleaseDC, CLR_INVALID};

/// The mean colour of the pixels at these screen points, as `[r, g, b]`. Points that cannot be read are left out;
/// none at all gives `None`.
pub fn mean_colour(points: &[(i32, i32)]) -> Option<[u8; 3]> {
    let dc = unsafe { GetDC(None) };
    if dc.is_invalid() {
        return None;
    }
    let (mut r, mut g, mut b, mut n) = (0u32, 0u32, 0u32, 0u32);
    for &(x, y) in points {
        let c = unsafe { GetPixel(dc, x, y) };
        if c.0 == CLR_INVALID {
            continue;
        }
        r += c.0 & 0xff;
        g += (c.0 >> 8) & 0xff;
        b += (c.0 >> 16) & 0xff;
        n += 1;
    }
    unsafe {
        ReleaseDC(None, dc);
    }
    (n > 0).then(|| [(r / n) as u8, (g / n) as u8, (b / n) as u8])
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_point_off_every_screen_has_no_colour() {
        assert_eq!(mean_colour(&[(-90_000, -90_000)]), None);
        assert_eq!(mean_colour(&[]), None);
    }

    #[test]
    fn a_point_on_the_screen_has_one() {
        // whatever is at the origin, it is a colour
        assert!(mean_colour(&[(0, 0), (1, 1), (2, 2)]).is_some());
    }
}
# Measures the menu bar's glass on the REAL primary screen: the bar's brightness with the pointer away, while it glides
# onto the System load item (a tooltip opens under it) and after it leaves. A bar whose frosted glass is steady reads the
# same in all three; one whose blur depends on what else is drawn in its glass window reads paler while the tooltip is up.
# It moves the real pointer (in small steps, not a jump), so run it only when that is fine.
#
#   powershell -File scripts\native\barprobe.ps1 [-ItemX 1573] [-ItemY 22] [-Runs 2]
param([int]$ItemX = 1573, [int]$ItemY = 22, [int]$Runs = 2, [int]$BarX = -1)

Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.Drawing; using System.Drawing.Imaging; using System.Runtime.InteropServices;
public class Probe {
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
  /** Mean luminance and its spread over a screen rectangle. */
  public static double[] Look(int x, int y, int w, int h) {
    using (var b = new Bitmap(w, h, PixelFormat.Format24bppRgb)) {
      using (var g = Graphics.FromImage(b)) g.CopyFromScreen(x, y, 0, 0, new Size(w, h));
      var d = b.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
      var raw = new byte[d.Stride * h]; Marshal.Copy(d.Scan0, raw, 0, raw.Length); b.UnlockBits(d);
      double s = 0, s2 = 0, n = 0;
      for (int r = 0; r < h; r++) for (int c = 0; c < w; c++) { int i = r * d.Stride + c * 3; double l = 0.299 * raw[i + 2] + 0.587 * raw[i + 1] + 0.114 * raw[i]; s += l; s2 += l * l; n++; }
      double m = s / n; return new[] { m, Math.Sqrt(Math.Max(0, s2 / n - m * m)) };
    }
  }
  public static void Glide(int x0, int y0, int x1, int y1, int steps, int ms) {
    for (int i = 1; i <= steps; i++) { SetCursorPos(x0 + (x1 - x0) * i / steps, y0 + (y1 - y0) * i / steps); System.Threading.Thread.Sleep(ms / steps); }
  }
}
'@
[Probe]::SetProcessDPIAware() | Out-Null
# the bar to the left of the items, away from text: 130 px wide, the bar's inner height
$bx = if ($BarX -ge 0) { $BarX } else { $ItemX - 190 }; $by = 15; $bw = 130; $bh = 16
function Show($label, $v) { "{0,-14} brightness {1,6:N1}  spread {2,5:N1}" -f $label, $v[0], $v[1] }
for ($run = 1; $run -le $Runs; $run++) {
  [Probe]::SetCursorPos(1200, 500) | Out-Null
  Start-Sleep -Milliseconds 400
  [Probe]::Glide(1200, 500, 1200, 420, 5, 120)
  Start-Sleep -Milliseconds 1300
  $idle = [Probe]::Look($bx, $by, $bw, $bh)
  [Probe]::Glide(1200, 420, $ItemX, $ItemY, 24, 600)
  Start-Sleep -Milliseconds 1000
  $hover = [Probe]::Look($bx, $by, $bw, $bh)
  [Probe]::Glide($ItemX, $ItemY, 1300, 420, 24, 500)
  Start-Sleep -Milliseconds 1500
  $after = [Probe]::Look($bx, $by, $bw, $bh)
  "run $run"
  Show "  pointer away" $idle
  Show "  hovering" $hover
  Show "  after" $after
  "  hover - idle: {0:N1}" -f ($hover[0] - $idle[0])
}


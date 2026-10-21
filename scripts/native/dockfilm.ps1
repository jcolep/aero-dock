# Films the REAL dock on a real monitor as it is revealed and hidden, and reports any vertical step after it arrived.
# It moves the real pointer (to the bottom edge to reveal, up into the screen to hide), so run it only when that is fine.
#
#   powershell -File scripts\native\dockfilm.ps1 [-Cycles 3] [-Monitor 1] [-Save <folder>]
#
# For each cycle: the pointer goes up (the dock hides), then to the bottom edge at 150 ms into a ~1.8 s recording of the
# strip along the bottom (every frame the screen gives). Each frame is compared with the settled one, in windows along
# the dock, for the whole-pixel shift (-3..3 rows) that makes them match best; a step in that after the dock arrived is
# the "shift down". Prints, per window, the shifts over time (only where they change).
param([int]$Cycles = 3, [int]$Monitor = 0, [string]$Save = "", [int]$From = 0, [string]$Dump = "", [string]$Diff = "", [switch]$Errors)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Threading;

public class Film {
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);

  public class Shot { public long Ms; public byte[] Gray; }

  /** Records the strip while the pointer travels from (fromX, fromY) to (toX, toY) over moveMs, starting at atMs (a
   *  hand's move over the dock, not a jump onto it: the dock is revealed by the pointer moving over its area). */
  public static List<Shot> Record(int x, int y, int w, int h, int fromX, int fromY, int toX, int toY, int atMs, int moveMs, int forMs) {
    var shots = new List<Shot>();
    var sw = Stopwatch.StartNew();
    using (var bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb))
    using (var g = Graphics.FromImage(bmp)) {
      while (sw.ElapsedMilliseconds < forMs) {
        long t = sw.ElapsedMilliseconds;
        if (t >= atMs && t <= atMs + moveMs + 40) {
          double f = Math.Min(1.0, (double)(t - atMs) / moveMs);
          SetCursorPos((int)Math.Round(fromX + (toX - fromX) * f), (int)Math.Round(fromY + (toY - fromY) * f));
        }
        g.CopyFromScreen(x, y, 0, 0, new Size(w, h), CopyPixelOperation.SourceCopy);
        var data = bmp.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
        var raw = new byte[data.Stride * h];
        Marshal.Copy(data.Scan0, raw, 0, raw.Length);
        bmp.UnlockBits(data);
        var gray = new byte[w * h];
        for (int r = 0; r < h; r++)
          for (int c = 0; c < w; c++) {
            int i = r * data.Stride + c * 4;
            gray[r * w + c] = (byte)((raw[i] + raw[i + 1] + raw[i + 2]) / 3);
          }
        shots.Add(new Shot { Ms = t, Gray = gray });
      }
    }
    return shots;
  }

  /** The whole-row shift (-3..3) of `a` that best matches `b`, over columns x0..x1, and the match's error. */
  public static int BestShift(byte[] a, byte[] b, int w, int h, int x0, int x1, out double err) {
    int best = 0; double bestErr = double.MaxValue;
    for (int dy = -3; dy <= 3; dy++) {
      double sum = 0; int n = 0;
      for (int r = 4; r < h - 4; r++)
        for (int c = x0; c < x1; c++) {
          int d = a[(r + dy) * w + c] - b[r * w + c];
          sum += d < 0 ? -d : d; n++;
        }
      double e = sum / n;
      if (e < bestErr) { bestErr = e; best = dy; }
    }
    err = bestErr;
    return best;
  }

  public static double Spread(byte[] a, int w, int h, int x0, int x1) {
    double mean = 0; int n = 0;
    for (int r = 0; r < h; r++) for (int c = x0; c < x1; c++) { mean += a[r * w + c]; n++; }
    mean /= n; double v = 0;
    for (int r = 0; r < h; r++) for (int c = x0; c < x1; c++) { double d = a[r * w + c] - mean; v += d * d; }
    return Math.Sqrt(v / n);
  }

  /** What changed between two frames, amplified (black where nothing did). */
  public static double SaveDiff(byte[] a, byte[] b, int w, int h, string path) {
    double total = 0;
    using (var bmp = new Bitmap(w, h, PixelFormat.Format24bppRgb)) {
      for (int r = 0; r < h; r++) for (int c = 0; c < w; c++) {
        int d = Math.Abs(a[r * w + c] - b[r * w + c]); total += d;
        int v = Math.Min(255, d * 12);
        bmp.SetPixel(c, r, Color.FromArgb(v, v, v));
      }
      bmp.Save(path, ImageFormat.Png);
    }
    return total / (w * h);
  }

  public static void SavePng(byte[] gray, int w, int h, string path) {
    using (var bmp = new Bitmap(w, h, PixelFormat.Format24bppRgb)) {
      for (int r = 0; r < h; r++) for (int c = 0; c < w; c++) { int v = gray[r * w + c]; bmp.SetPixel(c, r, Color.FromArgb(v, v, v)); }
      bmp.Save(path, ImageFormat.Png);
    }
  }
}
'@

[Film]::SetProcessDPIAware() | Out-Null
$screens = [System.Windows.Forms.Screen]::AllScreens | Where-Object { -not $_.Primary }
$screen = if ($Monitor -eq 1 -and $screens) { $screens[0] } else { [System.Windows.Forms.Screen]::PrimaryScreen }
$b = $screen.Bounds
Write-Host "Monitor $($screen.DeviceName) $($b.Width)x$($b.Height) at $($b.X),$($b.Y)"
$w = 1000; $h = 150
$x = $b.X + [int]($b.Width / 2) - [int]($w / 2)
$y = $b.Bottom - $h
$cx = $b.X + [int]($b.Width / 2)
$winW = 80

$grand = 0.0
for ($cycle = 1; $cycle -le $Cycles; $cycle++) {
  # away, so the dock hides (its delay and its leaving), then in
  $upY = $b.Y + [int]($b.Height * 0.55)
  for ($i = 1; $i -le 14; $i++) {
    [Film]::SetCursorPos($cx, [int]($b.Bottom - 1 + ($upY - $b.Bottom + 1) * $i / 14)) | Out-Null
    Start-Sleep -Milliseconds 25
  }
  Start-Sleep -Milliseconds 1900
  # in again, over the dock's edge, as a hand does it
  "film t0 (epoch ms): $([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())"
  $shots = [Film]::Record($x, $y, $w, $h, $cx, $upY, $cx, $b.Bottom - 1, 150, 240, 1900)
  $final = $shots[$shots.Count - 1].Gray
  "cycle $cycle : $($shots.Count) frames in 1.9 s"
  if ($Save) { New-Item -ItemType Directory -Force $Save | Out-Null; [Film]::SavePng($final, $w, $h, (Join-Path $Save "final-$cycle.png")) }
  if ($Save -and $Dump) {
    foreach ($ms in ($Dump -split ",")) {
      $hit = $shots | Where-Object { $_.Ms -ge [int]$ms } | Select-Object -First 1
      if ($hit) { [Film]::SavePng($hit.Gray, $w, $h, (Join-Path $Save ("c$cycle-t$($hit.Ms).png"))) }
    }
  }
  if ($Save -and $Diff) {
    # what changed between pairs of moments (e.g. -Diff "820,880,940"): consecutive frames at those times
    $times = $Diff -split "," | ForEach-Object { [int]$_ }
    for ($k = 1; $k -lt $times.Count; $k++) {
      $a = $shots | Where-Object { $_.Ms -ge $times[$k - 1] } | Select-Object -First 1
      $c = $shots | Where-Object { $_.Ms -ge $times[$k] } | Select-Object -First 1
      if ($a -and $c) {
        $mean = [Film]::SaveDiff($a.Gray, $c.Gray, $w, $h, (Join-Path $Save "diff-c$cycle-$($a.Ms)-$($c.Ms).png"))
        "  diff $($a.Ms)->$($c.Ms) ms: mean change $([math]::Round($mean,3)) per pixel"
      }
    }
  }
  $cycleLate = 0.0; $worst = 0.0; $worstAt = 0
  for ($c0 = 0; $c0 + $winW -le $w; $c0 += $winW) {
    if ([Film]::Spread($final, $w, $h, $c0, $c0 + $winW) -lt 12) { continue }
    $line = @(); $prev = 99; $errs = @(); $lastErrAt = -100
    foreach ($s in $shots) {
      if ($s.Ms -ge 300 -and $s.Ms - $lastErrAt -ge 60) {
        $e2 = 0.0
        [void][Film]::BestShift($s.Gray, $final, $w, $h, $c0, $c0 + $winW, [ref]$e2)
        $errs += "$($s.Ms):$([math]::Round($e2,1))"; $lastErrAt = $s.Ms
      }
      if ($s.Ms -lt $From) { continue }
      $err = 0.0
      $dy = [Film]::BestShift($s.Gray, $final, $w, $h, $c0, $c0 + $winW, [ref]$err)
      # only frames that look like the settled dock count: before it arrives (or while it is still growing) the best
      # shift of something that does not match is noise
      if ($err -gt 9) { continue }
      if ($dy -ne $prev) { $line += "$($s.Ms)ms:$dy(err $([math]::Round($err,1)))"; $prev = $dy }
    }
    "  x=$c0..$($c0 + $winW) shift over time (rows, vs settled): $($line -join '  ')"
    if ($Errors) { "      mismatch with the settled frame, every ~60 ms: $($errs -join ' ')" }
    # the biggest sudden improvement from one sample to the next after 400 ms: the dock changing in one step after it
    # had all but arrived (a smooth settle has none)
    $pairs = $errs | ForEach-Object { $p = $_ -split ":"; ,@([int]$p[0], [double]$p[1]) } | Where-Object { $_[0] -ge 380 }
    $step = 0.0; $stepAt = 0
    for ($i = 1; $i -lt $pairs.Count; $i++) { $d = $pairs[$i - 1][1] - $pairs[$i][1]; if ($d -gt $step) { $step = $d; $stepAt = $pairs[$i][0] } }
    if ($Errors) { "      biggest sudden step after 380 ms: $([math]::Round($step,2)) at $stepAt ms" }
    # after the pop has finished (700 ms on, counted from the start of the recording, the pointer arriving at ~390 ms):
    # steps up or down in the mismatch that a smooth settle would not have
    $late = $pairs | Where-Object { $_[0] -ge 700 }
    for ($i = 1; $i -lt $late.Count; $i++) { $d = [math]::Abs($late[$i - 1][1] - $late[$i][1]); $cycleLate += $d; if ($d -gt $worst) { $worst = $d; $worstAt = $late[$i][0] } }
  }
  "  LATE steps after 700 ms, all windows: total $([math]::Round($cycleLate,1)), worst single step $([math]::Round($worst,1)) at $worstAt ms"
  $grand += $cycleLate
}
"TOTAL late-step over $Cycles cycles: $([math]::Round($grand,1))"
[Film]::SetCursorPos($cx, $b.Y + [int]($b.Height * 0.55)) | Out-Null



// How the corner pieces keep up with Windows' maximise animation on the primary monitor: a white window (no rounding
// of its own) is maximised several times, and each corner pixel is watched: when the window's square corner is first
// seen there, and when a piece is over it. With the pieces in time, the square corner is never seen at all.
//   run by scripts/native/corners-live.ps1 timing
using System; using System.Diagnostics; using System.Drawing; using System.Runtime.InteropServices; using System.Text; using System.Threading; using System.Windows.Forms;
public static class CornerTiming {
  [DllImport("user32.dll")] static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] static extern bool SetProcessDPIAware();
  [DllImport("user32.dll")] static extern IntPtr GetDC(IntPtr h);
  [DllImport("user32.dll")] static extern int ReleaseDC(IntPtr h, IntPtr dc);
  [DllImport("gdi32.dll")] static extern uint GetPixel(IntPtr dc, int x, int y);
  [DllImport("dwmapi.dll")] static extern int DwmSetWindowAttribute(IntPtr h, int a, ref int v, int size);
  static bool White(uint c) { return (c & 0xff) > 232 && ((c >> 8) & 0xff) > 232 && ((c >> 16) & 0xff) > 232; }
  public static string Run(int ox, int oy, int ow, int oh, int rounds) {
    SetProcessDPIAware();
    Form f = null; var ready = new ManualResetEvent(false); IntPtr hf = IntPtr.Zero;
    var ui = new Thread(() => { f = new Form { Text = "", BackColor = Color.White, ShowIcon = false, StartPosition = FormStartPosition.Manual, Bounds = new Rectangle(ox + 490, oy + 306, 700, 400) };
      f.HandleCreated += (s, e) => { int white = 0xFFFFFF, no = 0, sq = 1; DwmSetWindowAttribute(f.Handle, 20, ref no, 4); DwmSetWindowAttribute(f.Handle, 33, ref sq, 4); DwmSetWindowAttribute(f.Handle, 34, ref white, 4); DwmSetWindowAttribute(f.Handle, 35, ref white, 4); DwmSetWindowAttribute(f.Handle, 36, ref white, 4); };
      f.Shown += (s, e) => ready.Set(); Application.Run(f); });
    ui.SetApartmentState(ApartmentState.STA); ui.Start(); ready.WaitOne(); f.Invoke((Action)(() => hf = f.Handle)); Thread.Sleep(800);
    var sb = new StringBuilder(); int seenAtAll = 0;
    int[][] pts = { new[] { ox + 1, oy + 1 }, new[] { ox + ow - 2, oy + 1 }, new[] { ox + ow - 2, oy + oh - 2 }, new[] { ox + 1, oy + oh - 2 } };
    for (int round = 0; round < rounds; round++) {
      var sw = Stopwatch.StartNew();
      ShowWindow(hf, 3); SetForegroundWindow(hf);
      var firstWhite = new long[] { -1, -1, -1, -1 }; var covered = new long[] { -1, -1, -1, -1 };
      while (sw.ElapsedMilliseconds < 900) {
        IntPtr dc = GetDC(IntPtr.Zero);
        for (int k = 0; k < 4; k++) { bool w = White(GetPixel(dc, pts[k][0], pts[k][1])); long t = sw.ElapsedMilliseconds; if (w && firstWhite[k] < 0) firstWhite[k] = t; if (!w && firstWhite[k] >= 0 && covered[k] < 0) covered[k] = t; }
        ReleaseDC(IntPtr.Zero, dc);
      }
      for (int k = 0; k < 4; k++) if (firstWhite[k] >= 0) seenAtAll++;
      sb.AppendLine(string.Format("round {0}: square corner seen at TL {1} TR {2} BR {3} BL {4} ms (-1: never); covered again at {5} {6} {7} {8}", round + 1, firstWhite[0], firstWhite[1], firstWhite[2], firstWhite[3], covered[0], covered[1], covered[2], covered[3]));
      ShowWindow(hf, 9); Thread.Sleep(900);
    }
    try { f.Invoke((Action)(() => f.Close())); } catch { }
    sb.AppendLine(string.Format("a square corner was seen {0} times in {1} corners maximised", seenAtAll, rounds * 4));
    return sb.ToString();
  }
}
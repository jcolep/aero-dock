// The frame's corner pieces with real apps on the primary monitor. Each app is started, its new window found (the
// windows that appeared, so a store app hosted by ApplicationFrameHost is found too), moved to the primary monitor,
// maximised, then snapped to the left half; in each state the corner pieces' own windows are checked (shown exactly
// over the corners that are held, hidden over the others) and the corners are photographed. Every window it opened
// is closed at the end; nothing else is touched.

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;

public static class RealApps
{
    delegate bool EnumProc(IntPtr h, IntPtr l);
    [DllImport("user32.dll")] static extern bool EnumWindows(EnumProc f, IntPtr l);
    [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr h);
    [DllImport("user32.dll")] static extern bool GetWindowRect(IntPtr h, out RECT r);
    [DllImport("user32.dll")] static extern long GetWindowLongPtrW(IntPtr h, int i);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetClassName(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll")] static extern bool ShowWindow(IntPtr h, int c);
    [DllImport("user32.dll")] static extern bool SetWindowPos(IntPtr h, IntPtr a, int x, int y, int w, int hh, uint f);
    [DllImport("user32.dll")] static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] static extern bool PostMessage(IntPtr h, uint m, IntPtr w, IntPtr l);
    [DllImport("user32.dll")] static extern bool SetProcessDPIAware();
    [DllImport("dwmapi.dll")] static extern int DwmGetWindowAttribute(IntPtr h, int a, out RECT r, int s);
    [DllImport("dwmapi.dll")] static extern int DwmGetWindowAttribute(IntPtr h, int a, out int v, int s);
    public struct RECT { public int L, T, R, B; }

    static int OX, OY, OW, OH, R;
    static StringBuilder Log = new StringBuilder();
    static int Fails = 0;

    static List<IntPtr> TopWindows()
    {
        var list = new List<IntPtr>();
        EnumWindows((h, l) => {
            if (!IsWindowVisible(h)) return true;
            int cloaked; DwmGetWindowAttribute(h, 14, out cloaked, 4);
            long ex = GetWindowLongPtrW(h, -20);
            if (cloaked != 0 || (ex & 0x80) != 0) return true;
            RECT r; GetWindowRect(h, out r);
            if (r.R - r.L < 200 || r.B - r.T < 150) return true;
            list.Add(h); return true;
        }, IntPtr.Zero);
        return list;
    }

    static string Name(IntPtr h) { var c = new StringBuilder(80); GetClassName(h, c, 80); var t = new StringBuilder(80); GetWindowText(h, t, 80); return c + " '" + t + "'"; }

    /// The corner pieces' windows on the primary monitor: for each corner, whether one is shown exactly there.
    static bool[] PiecesShown()
    {
        var shown = new bool[4];
        int size = R + 4;
        var spots = new[] { new Point(OX, OY), new Point(OX + OW - size, OY), new Point(OX + OW - size, OY + OH - size), new Point(OX, OY + OH - size) };
        EnumWindows((h, l) => {
            var c = new StringBuilder(32); GetClassName(h, c, 32);
            if (c.ToString() != "AeroDockCorner" || !IsWindowVisible(h)) return true;
            RECT r; GetWindowRect(h, out r);
            for (int k = 0; k < 4; k++) if (r.L == spots[k].X && r.T == spots[k].Y && r.R - r.L == size) shown[k] = true;
            return true;
        }, IntPtr.Zero);
        return shown;
    }

    static void PlaceVisible(IntPtr h, int x, int y, int w, int hh)
    {
        ShowWindow(h, 9);
        Thread.Sleep(150);
        RECT outer, drawn; GetWindowRect(h, out outer); DwmGetWindowAttribute(h, 9, out drawn, 16);
        int l = drawn.L - outer.L, t = drawn.T - outer.T, r = outer.R - drawn.R, b = outer.B - drawn.B;
        SetWindowPos(h, IntPtr.Zero, x - l, y - t, w + l + r, hh + t + b, 0x0040);
    }

    static void Shot(Bitmap sheet, int row)
    {
        const int S = 20, Z = 6;
        var at = new[] { new Point(OX - 4, OY - 4), new Point(OX + OW - S + 4, OY - 4), new Point(OX + OW - S + 4, OY + OH - S + 4), new Point(OX - 4, OY + OH - S + 4) };
        using (var g = Graphics.FromImage(sheet))
        {
            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.NearestNeighbor;
            g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.Half;
            for (int k = 0; k < 4; k++)
                using (var crop = new Bitmap(S, S))
                {
                    using (var cg = Graphics.FromImage(crop)) cg.CopyFromScreen(at[k].X, at[k].Y, 0, 0, new Size(S, S));
                    g.DrawImage(crop, new Rectangle(k * (S * Z + 6), row * (S * Z + 6), S * Z, S * Z));
                }
        }
    }

    static void Check(string app, string state, bool[] want)
    {
        var sw = Stopwatch.StartNew();
        bool[] got = null; bool ok = false;
        while (sw.ElapsedMilliseconds < 2500)
        {
            got = PiecesShown();
            ok = true; for (int k = 0; k < 4; k++) if (got[k] != want[k]) ok = false;
            if (ok) break;
            Thread.Sleep(40);
        }
        // and stays so
        if (ok) { Thread.Sleep(600); var again = PiecesShown(); for (int k = 0; k < 4; k++) if (again[k] != want[k]) { ok = false; got = again; } }
        if (!ok) Fails++;
        Log.AppendLine(string.Format("{0} {1,-16} {2,-22} pieces {3}{4}", ok ? "ok  " : "FAIL", app, state, string.Join("", Array.ConvertAll(got, b => b ? "#" : ".")), ok ? " @" + sw.ElapsedMilliseconds + "ms" : " wanted " + string.Join("", Array.ConvertAll(want, b => b ? "#" : "."))));
    }

    public static string Run(int ox, int oy, int ow, int oh, int radius, string sheetPath, string[] apps)
    {
        SetProcessDPIAware();
        OX = ox; OY = oy; OW = ow; OH = oh; R = radius;
        var opened = new List<IntPtr>();
        var sheet = new Bitmap(4 * (20 * 6 + 6), apps.Length * 2 * (20 * 6 + 6));
        int row = 0;
        try
        {
            foreach (var spec in apps)
            {
                var parts = spec.Split(new[] { '|' }, 3);
                string label = parts[0], file = parts[1], args = parts.Length > 2 ? parts[2] : "";
                var before = new HashSet<IntPtr>(TopWindows());
                try { Process.Start(new ProcessStartInfo(file, args) { UseShellExecute = true }); }
                catch (Exception e) { Log.AppendLine("skip " + label + ": " + e.Message); row += 2; continue; }
                IntPtr h = IntPtr.Zero;
                var sw = Stopwatch.StartNew();
                while (sw.ElapsedMilliseconds < 12000 && h == IntPtr.Zero)
                {
                    Thread.Sleep(250);
                    foreach (var w in TopWindows()) if (!before.Contains(w)) { h = w; break; }
                }
                if (h == IntPtr.Zero) { Log.AppendLine("skip " + label + ": no new window"); row += 2; continue; }
                opened.Add(h);
                Thread.Sleep(1200);
                Log.AppendLine("--- " + label + ": " + Name(h));
                PlaceVisible(h, OX + 200, OY + 150, 900, 600);
                Thread.Sleep(300);
                ShowWindow(h, 3); SetForegroundWindow(h);
                Check(label, "maximised", new[] { true, true, true, true });
                Thread.Sleep(300); Shot(sheet, row++);
                PlaceVisible(h, OX, OY, OW / 2, OH);
                SetForegroundWindow(h);
                Check(label, "snapped left", new[] { true, false, false, true });
                Thread.Sleep(300); Shot(sheet, row++);
                PlaceVisible(h, OX + 300, OY + 200, 800, 500);
                Check(label, "small", new[] { false, false, false, false });
            }
        }
        catch (Exception e) { Log.AppendLine("ERROR " + e); }
        finally
        {
            foreach (var h in opened) PostMessage(h, 0x0010, IntPtr.Zero, IntPtr.Zero);
            sheet.Save(sheetPath);
        }
        Log.AppendLine(Fails + " failed");
        return Log.ToString();
    }
}

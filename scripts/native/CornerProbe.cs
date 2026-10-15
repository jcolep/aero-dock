// A live test of the frame's corner pieces on the primary monitor. Two plain white windows (white caption, white
// border, Windows' own rounding off) are put through a script of states: maximised, restored, snapped to a side or a
// quarter, covered at a corner by another window, minimised and back, toggled quickly. In each state the screen is
// read every 20 ms for a while at two points of each corner of the opening: the opening's own corner pixel, which a
// piece must cover whenever a window's corner is there, and a pixel well inside the curve, which a piece must never
// cover. A corner is "held" when the window there has its corner in it.
//
// Run by scripts/native/corners-live.ps1, which compiles this and passes the opening and radius. Moves windows it
// made itself, and nothing else; reads the screen.

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Windows.Forms;

/// An invisible window over the whole screen that the pointer goes through, as a GPU's or a recorder's overlay is.
public class Overlay : Form
{
    protected override CreateParams CreateParams { get { var p = base.CreateParams; p.ExStyle |= 0x20 | 0x80000 | 0x8; return p; } }
}

public static class CornerProbe
{
    [DllImport("user32.dll")] static extern bool SetProcessDPIAware();
    [DllImport("user32.dll")] static extern bool ShowWindow(IntPtr h, int cmd);
    [DllImport("user32.dll")] static extern bool SetWindowPos(IntPtr h, IntPtr after, int x, int y, int w, int cy, uint flags);
    [DllImport("user32.dll")] static extern bool GetWindowRect(IntPtr h, out RECT r);
    [DllImport("user32.dll")] static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] static extern IntPtr GetDC(IntPtr h);
    [DllImport("user32.dll")] static extern int ReleaseDC(IntPtr h, IntPtr dc);
    [DllImport("gdi32.dll")] static extern uint GetPixel(IntPtr dc, int x, int y);
    [DllImport("dwmapi.dll")] static extern int DwmGetWindowAttribute(IntPtr h, int a, out RECT r, int size);
    [DllImport("dwmapi.dll")] static extern int DwmSetWindowAttribute(IntPtr h, int a, ref int v, int size);
    public struct RECT { public int L, T, R, B; }

    const int SW_MAXIMIZE = 3, SW_RESTORE = 9, SW_MINIMIZE = 6, SW_SHOWNOACTIVATE = 4;
    static readonly IntPtr TOP = IntPtr.Zero;

    static int OX, OY, OW, OH, R;
    static Form F, G, O;
    static IntPtr HF, HG;
    static StringBuilder Log = new StringBuilder();
    static int Failures = 0, Checks = 0;

    static Form MakeWindow(string title)
    {
        var f = new Form { Text = title, BackColor = Color.White, ShowIcon = false, ShowInTaskbar = true, StartPosition = FormStartPosition.Manual, Bounds = new Rectangle(OX + 300, OY + 200, 800, 500) };
        f.HandleCreated += (s, e) =>
        {
            int white = 0x00FFFFFF, no = 0, square = 1;
            DwmSetWindowAttribute(f.Handle, 20, ref no, 4);      // no dark title bar
            DwmSetWindowAttribute(f.Handle, 33, ref square, 4);  // Windows' own rounding off
            DwmSetWindowAttribute(f.Handle, 34, ref white, 4);   // border
            DwmSetWindowAttribute(f.Handle, 35, ref white, 4);   // caption
            DwmSetWindowAttribute(f.Handle, 36, ref white, 4);   // caption text
        };
        return f;
    }

    static void On(Form f, Action a) { f.Invoke(a); }

    /// Place a window so that what is drawn of it (not its invisible borders) is exactly this rectangle.
    static void PlaceVisible(IntPtr h, int x, int y, int w, int hh)
    {
        ShowWindow(h, SW_RESTORE);
        Thread.Sleep(60);
        RECT outer, drawn;
        GetWindowRect(h, out outer);
        DwmGetWindowAttribute(h, 9, out drawn, 16);
        int l = drawn.L - outer.L, t = drawn.T - outer.T, r = outer.R - drawn.R, b = outer.B - drawn.B;
        SetWindowPos(h, TOP, x - l, y - t, w + l + r, hh + t + b, 0x0040);
    }

    // ---- reading the corners ----

    /// The opening's own corner pixel, and one well inside the curve, for each corner (top left, top right, bottom
    /// right, bottom left).
    static Point[] Outer() { return new[] { new Point(OX, OY), new Point(OX + OW - 1, OY), new Point(OX + OW - 1, OY + OH - 1), new Point(OX, OY + OH - 1) }; }
    static Point[] Inner()
    {
        int d = Math.Max(3, (int)Math.Round(R * 0.6));
        return new[] { new Point(OX + d, OY + d), new Point(OX + OW - 1 - d, OY + d), new Point(OX + OW - 1 - d, OY + OH - 1 - d), new Point(OX + d, OY + OH - 1 - d) };
    }
    static bool White(uint c) { return (c & 0xff) > 232 && ((c >> 8) & 0xff) > 232 && ((c >> 16) & 0xff) > 232; }

    /// Each corner: is its corner pixel covered (not white), and is the pixel inside the curve still the window's?
    static void Look(out bool[] covered, out bool[] insideWhite)
    {
        covered = new bool[4]; insideWhite = new bool[4];
        IntPtr dc = GetDC(IntPtr.Zero);
        var o = Outer(); var i = Inner();
        for (int k = 0; k < 4; k++) { covered[k] = !White(GetPixel(dc, o[k].X, o[k].Y)); insideWhite[k] = White(GetPixel(dc, i[k].X, i[k].Y)); }
        ReleaseDC(IntPtr.Zero, dc);
    }

    /// Watch the corners for `ms` after a change. `held` says which corners have a white window's corner in them (they
    /// must end up covered, and stay so); `whiteAt` which have a white window over them that does not hold them (they
    /// must end up not covered). Reports when each corner settled, and any flicker after it did.
    static void Expect(string what, bool[] held, bool[] whiteAt, int ms = 1600)
    {
        var sw = Stopwatch.StartNew();
        var settledAt = new long[] { -1, -1, -1, -1 };
        var flips = new int[4];
        var last = new bool[4];
        bool first = true, overCovered = false;
        while (sw.ElapsedMilliseconds < ms)
        {
            bool[] c, inside; Look(out c, out inside);
            for (int k = 0; k < 4; k++)
            {
                bool right = held[k] ? c[k] : whiteAt[k] ? !c[k] : true;
                if (held[k] && !inside[k] && sw.ElapsedMilliseconds > 500) overCovered = true;
                if (right && settledAt[k] < 0) settledAt[k] = sw.ElapsedMilliseconds;
                if (!right && settledAt[k] >= 0) { flips[k]++; settledAt[k] = -1; }
                if (!first && c[k] != last[k] && settledAt[k] >= 0 && held[k]) flips[k]++;
                last[k] = c[k];
            }
            first = false;
            Thread.Sleep(20);
        }
        var names = new[] { "TL", "TR", "BR", "BL" };
        var sb = new StringBuilder();
        bool ok = !overCovered;
        for (int k = 0; k < 4; k++)
        {
            if (!held[k] && !whiteAt[k]) continue;
            Checks++;
            bool good = settledAt[k] >= 0 && settledAt[k] < 1000;
            if (!good) ok = false;
            sb.Append(string.Format(" {0}:{1}{2}", names[k], held[k] ? "cover" : "clear", settledAt[k] >= 0 ? "@" + settledAt[k] + "ms" : " NEVER"));
            if (flips[k] > 0) sb.Append("(flickered " + flips[k] + ")");
        }
        if (overCovered) sb.Append(" COVERS-THE-APP");
        if (!ok) Failures++;
        Log.AppendLine((ok ? "ok   " : "FAIL ") + what + " ->" + sb);
    }

    static bool[] B(params int[] on) { var b = new bool[4]; foreach (var k in on) b[k] = true; return b; }
    static readonly bool[] NONE = new bool[4];
    static readonly bool[] ALL = { true, true, true, true };

    /// A picture of the four corners of the opening with a white window maximised in it, each 24 pixels square around
    /// the corner, enlarged eight times, side by side: for comparing how the pieces look.
    public static string Shot(int ox, int oy, int ow, int oh, string path)
    {
        SetProcessDPIAware();
        OX = ox; OY = oy; OW = ow; OH = oh;
        var ready = new ManualResetEvent(false);
        var ui = new Thread(() => { F = MakeWindow("Corner probe F"); F.Shown += (s, e) => ready.Set(); Application.Run(F); });
        ui.SetApartmentState(ApartmentState.STA);
        ui.Start();
        ready.WaitOne();
        On(F, () => { HF = F.Handle; });
        ShowWindow(HF, SW_MAXIMIZE); SetForegroundWindow(HF);
        Thread.Sleep(1800);
        const int S = 24, Z = 8;
        using (var sheet = new Bitmap(4 * S * Z + 30, S * Z))
        using (var g = Graphics.FromImage(sheet))
        {
            g.Clear(Color.Magenta);
            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.NearestNeighbor;
            g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.Half;
            var at = new[] { new Point(OX - 6, OY - 6), new Point(OX + OW - S + 6, OY - 6), new Point(OX + OW - S + 6, OY + OH - S + 6), new Point(OX - 6, OY + OH - S + 6) };
            for (int k = 0; k < 4; k++)
            {
                using (var crop = new Bitmap(S, S))
                {
                    using (var cg = Graphics.FromImage(crop)) cg.CopyFromScreen(at[k].X, at[k].Y, 0, 0, new Size(S, S));
                    g.DrawImage(crop, new Rectangle(k * (S * Z + 10), 0, S * Z, S * Z));
                }
            }
            sheet.Save(path);
        }
        try { On(F, () => F.Close()); } catch { }
        return path;
    }

    public static string Run(int ox, int oy, int ow, int oh, int radius, int rounds)
    {
        SetProcessDPIAware();
        OX = ox; OY = oy; OW = ow; OH = oh; R = radius;
        var ready = new ManualResetEvent(false);
        var ui = new Thread(() =>
        {
            F = MakeWindow("Corner probe F"); G = MakeWindow("Corner probe G");
            F.Shown += (s, e) => ready.Set();
            G.Show(); F.Show();
            Application.Run(F);
        });
        ui.SetApartmentState(ApartmentState.STA);
        ui.Start();
        ready.WaitOne();
        Thread.Sleep(400);
        On(F, () => { HF = F.Handle; HG = G.Handle; });
        int half = OW / 2, hh = OH / 2;
        try
        {
            ShowWindow(HG, SW_MINIMIZE);
            for (int round = 0; round < rounds; round++)
            {
                Log.AppendLine("--- round " + (round + 1));
                ShowWindow(HF, SW_MAXIMIZE); SetForegroundWindow(HF);
                Expect("maximised", ALL, NONE);
                ShowWindow(HF, SW_RESTORE);
                Expect("restored to the middle", NONE, NONE, 900);
                PlaceVisible(HF, OX, OY, half, OH);
                Expect("snapped left", B(0, 3), NONE);
                PlaceVisible(HF, OX + OW - half, OY, half, OH);
                Expect("snapped right", B(1, 2), NONE);
                PlaceVisible(HF, OX, OY, half, hh);
                Expect("quarter top left", B(0), NONE);
                PlaceVisible(HF, OX + OW - half, OY + OH - hh, half, hh);
                Expect("quarter bottom right", B(2), NONE);
                // two side by side: all four, between them
                ShowWindow(HG, SW_RESTORE);
                PlaceVisible(HF, OX, OY, half, OH);
                PlaceVisible(HG, OX + half, OY, OW - half, OH);
                Expect("two side by side", ALL, NONE);
                // a maximised window with another dragged over its top left corner, not snapped there
                ShowWindow(HF, SW_MAXIMIZE);
                PlaceVisible(HG, OX - 4, OY + 30, 500, 300);
                SetWindowPos(HG, TOP, 0, 0, 0, 0, 0x0001 | 0x0002 | 0x0040);
                SetForegroundWindow(HG);
                Expect("maximised, another over its left edge (no corner)", ALL, NONE);
                PlaceVisible(HG, OX - 30, OY - 20, 400, 300);
                SetForegroundWindow(HG);
                Expect("maximised, another over its top left corner", B(1, 2, 3), B(0));
                ShowWindow(HG, SW_MINIMIZE);
                SetForegroundWindow(HF);
                Expect("maximised again on its own", ALL, NONE);
                // an invisible overlay over the whole screen, on top: the corners are still the maximised window's
                On(F, () => { O = new Overlay { FormBorderStyle = FormBorderStyle.None, StartPosition = FormStartPosition.Manual, Bounds = new Rectangle(OX - 10, OY - 44, OW + 20, OH + 54), TopMost = true, ShowInTaskbar = false, Opacity = 0.01, BackColor = Color.Black }; O.Show(); });
                SetForegroundWindow(HF);
                Expect("maximised, under an invisible overlay", ALL, NONE);
                On(F, () => O.Close());
                // a fullscreen window (a video, a slideshow) over the maximised one: no piece over it; and back after
                Form V = null;
                On(F, () => { V = new Form { FormBorderStyle = FormBorderStyle.None, StartPosition = FormStartPosition.Manual, Bounds = new Rectangle(OX - 10, OY - 44, OW + 20, OH + 54), BackColor = Color.White, ShowInTaskbar = false }; V.Show(); V.Activate(); });
                Expect("a fullscreen window over it", NONE, ALL);
                On(F, () => V.Close());
                SetForegroundWindow(HF);
                Expect("the fullscreen window gone", ALL, NONE);
                // minimised and back
                ShowWindow(HF, SW_MINIMIZE);
                Thread.Sleep(500);
                ShowWindow(HF, SW_RESTORE); SetForegroundWindow(HF);
                Expect("back from the taskbar, maximised", ALL, NONE);
                // quick toggles, then left maximised
                for (int t = 0; t < 6; t++) { ShowWindow(HF, SW_RESTORE); Thread.Sleep(120); ShowWindow(HF, SW_MAXIMIZE); Thread.Sleep(120); }
                Expect("after quick toggles, maximised", ALL, NONE);
                for (int t = 0; t < 6; t++) { ShowWindow(HF, SW_MAXIMIZE); Thread.Sleep(90); ShowWindow(HF, SW_RESTORE); Thread.Sleep(90); }
                PlaceVisible(HF, OX + 400, OY + 300, 600, 400);
                Expect("after quick toggles, small in the middle", NONE, NONE, 900);
            }
        }
        catch (Exception e) { Log.AppendLine("ERROR " + e); }
        finally
        {
            try { On(F, () => { G.Close(); F.Close(); }); } catch { }
        }
        Log.AppendLine(string.Format("{0} checks, {1} states failed", Checks, Failures));
        return Log.ToString();
    }
}

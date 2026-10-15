# Live tests of the frame's corners on the primary monitor, with the app running and the frame on. Reads the opening
# from the work area and the radius from the owner's settings.
#   powershell -File scripts/native/corners-live.ps1 [probe|timing|apps|shot] [rounds or picture path]
param([string]$what = "probe", [string]$arg = "3")
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Add-Type @"
using System; using System.Runtime.InteropServices;
public static class WorkArea { [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
  [DllImport("user32.dll")] public static extern bool SystemParametersInfo(int a, int b, ref RECT r, int c);
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware(); }
"@
[WorkArea]::SetProcessDPIAware() | Out-Null
$r = New-Object WorkArea+RECT; [WorkArea]::SystemParametersInfo(0x30, 0, [ref]$r, 0) | Out-Null
$settings = Get-Content "$here\..\..\dist-portable\data\settings.json" -Raw | ConvertFrom-Json
$radius = [int]$settings.frame.cornerRadius
$x = $r.L; $y = $r.T; $w = $r.R - $r.L; $h = $r.B - $r.T
"opening $x,$y ${w}x$h, radius $radius"
switch ($what) {
  "timing" { Add-Type -TypeDefinition (Get-Content "$here\CornerTiming.cs" -Raw) -ReferencedAssemblies System.Windows.Forms, System.Drawing; [CornerTiming]::Run($x, $y, $w, $h, [int]$arg) }
  "apps" { Add-Type -TypeDefinition (Get-Content "$here\RealApps.cs" -Raw) -ReferencedAssemblies System.Drawing
    $apps = @("Notepad|notepad.exe", "Explorer|explorer.exe|C:\", "Calculator|calc.exe", "Settings|ms-settings:", "Paint|mspaint.exe", "Terminal|wt.exe", "Edge|msedge.exe|--new-window about:blank")
    [RealApps]::Run($x, $y, $w, $h, $radius, $arg, $apps) }
  "shot" { Add-Type -TypeDefinition (Get-Content "$here\CornerProbe.cs" -Raw) -ReferencedAssemblies System.Windows.Forms, System.Drawing; [CornerProbe]::Shot($x, $y, $w, $h, $arg) }
  default { Add-Type -TypeDefinition (Get-Content "$here\CornerProbe.cs" -Raw) -ReferencedAssemblies System.Windows.Forms, System.Drawing; [CornerProbe]::Run($x, $y, $w, $h, $radius, [int]$arg) }
}
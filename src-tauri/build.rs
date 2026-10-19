fn main() {
    // The app's icon is compiled into the exe as a resource, made by this script. tauri_build names the files it
    // watches (its config), which turns off cargo's default of running this again whenever anything in the package
    // changes; without this line new icons (scripts/brand/make-icons.mjs) never reached the exe, and the Settings
    // window, the taskbar and Explorer kept showing the old one.
    println!("cargo:rerun-if-changed=icons");
    tauri_build::build()
}

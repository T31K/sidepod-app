#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayMenu};

fn main() {
  let context = tauri::generate_context!();
  
  let show = CustomMenuItem::new("show".to_string(), "Settings").accelerator("Cmd+Shift+P");
  let quit = CustomMenuItem::new("quit".to_string(), "Quit").accelerator("Cmd+Q");
  let tray_menu = SystemTrayMenu::new().add_item(show).add_item(quit);
  let tray = SystemTray::new().with_menu(tray_menu);
  tauri::Builder::default()
    .plugin(tauri_plugin_positioner::init())
    .menu(if cfg!(target_os = "macos") {
      tauri::Menu::os_default(&context.package_info().name)
    } else {
      tauri::Menu::default()
    })
    .system_tray(tray)
    .enable_macos_default_menu(false)
    .on_system_tray_event(|handle, event| {
      let tauri::SystemTrayEvent::MenuItemClick { id, .. } = event else {
          return;
      };

      let Some(window) = handle.get_window("settings") else {
          return;
      };

      match id.as_str() {
          "show" => {
              window.show().unwrap();
          }
          "quit" => std::process::exit(0),
          _ => {}
      };
    })
    .setup(move |app| {
      // Set activation poicy to Accessory to prevent the app icon from showing on the dock
      app.set_activation_policy(tauri::ActivationPolicy::Accessory);
      Ok(())
    })
    .run(context)
    .expect("error while running tauri application");
}

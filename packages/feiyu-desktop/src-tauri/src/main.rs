// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod cors;

use cors::register_cors_protocol;

fn main() {
    register_cors_protocol(tauri::Builder::default())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod cors;

use cors::{cancel_cors_request, register_cors_protocol};

fn main() {
    register_cors_protocol(tauri::Builder::default())
        .invoke_handler(tauri::generate_handler![cancel_cors_request])
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

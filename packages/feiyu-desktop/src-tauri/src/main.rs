// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use tauri::http::header::{
    ACCESS_CONTROL_ALLOW_CREDENTIALS, ACCESS_CONTROL_ALLOW_HEADERS, ACCESS_CONTROL_ALLOW_METHODS,
    ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_SECURITY_POLICY, CONTENT_SECURITY_POLICY_REPORT_ONLY,
    HOST, ORIGIN, REFERER, STRICT_TRANSPORT_SECURITY, X_FRAME_OPTIONS,
};
use tauri::http::{HeaderValue, Method, Request, Response, StatusCode};
use tauri::Manager;
use tauri_plugin_http::reqwest;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_webview_window("main").unwrap().open_devtools();
            Ok(())
        })
        .register_asynchronous_uri_scheme_protocol("x-http", move |_app, req, responder| {
            tauri::async_runtime::spawn(async move {
                let resp = handle_request(req).await;
                responder.respond(resp);
            });
        })
        .register_asynchronous_uri_scheme_protocol("x-https", move |_app, req, responder| {
            tauri::async_runtime::spawn(async move {
                let resp = handle_request(req).await;
                responder.respond(resp);
            });
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn handle_request(request: Request<Vec<u8>>) -> Response<Vec<u8>> {
    let mut response = match cors_request(request).await {
        Ok(res) => res,
        Err(err) => Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .body(err.to_string().into_bytes())
            .unwrap(),
    };

    response
        .headers_mut()
        .insert(ACCESS_CONTROL_ALLOW_ORIGIN, HeaderValue::from_static("*"));

    println!("✅ Status: {}", response.status());
    println!("✅ Headers: {:#?}", response.headers());

    return response;
}

async fn cors_request(
    request: Request<Vec<u8>>,
) -> Result<Response<Vec<u8>>, Box<dyn std::error::Error>> {
    let url = request
        .uri()
        .to_string()
        .replace("x-https://", "https://")
        .replace("x-http://", "http://");
    let method = request.method().clone();
    let body = request.body().clone();
    let mut headers = request.headers().clone();

    if method == Method::OPTIONS {
        return Ok(Response::builder()
            .status(StatusCode::OK)
            .header(ACCESS_CONTROL_ALLOW_METHODS, HeaderValue::from_static("*"))
            .header(ACCESS_CONTROL_ALLOW_HEADERS, HeaderValue::from_static("*"))
            .header(
                ACCESS_CONTROL_ALLOW_CREDENTIALS,
                HeaderValue::from_static("*"),
            )
            .body(Vec::new())
            .unwrap());
    }

    let parsed_url = url.parse::<reqwest::Url>().unwrap();
    let host = parsed_url.host().unwrap().to_string();
    let origin = parsed_url.origin().unicode_serialization().to_string();
    headers.insert(HOST, HeaderValue::from_str(&host).unwrap());
    headers.insert(REFERER, HeaderValue::from_str(&url).unwrap());
    headers.insert(ORIGIN, HeaderValue::from_str(&origin).unwrap());

    println!("🔥 Request {:?}", url);
    println!("🔥 Headers: {:#?}", headers);

    let client = reqwest::Client::new();
    match client
        .request(method, url)
        .headers(headers)
        .body(body)
        .send()
        .await
    {
        Ok(res) => {
            let mut resp = Response::builder().status(res.status());
            for (key, value) in res.headers().iter() {
                if ![
                    X_FRAME_OPTIONS,
                    STRICT_TRANSPORT_SECURITY,
                    CONTENT_SECURITY_POLICY,
                    CONTENT_SECURITY_POLICY_REPORT_ONLY,
                ]
                .contains(key)
                {
                    resp = resp.header(key.clone(), value.clone());
                }
            }
            Ok(resp.body(res.bytes().await?.to_vec()).unwrap())
        }
        Err(err) => Ok(Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .body(err.to_string().into_bytes())
            .unwrap()),
    }
}

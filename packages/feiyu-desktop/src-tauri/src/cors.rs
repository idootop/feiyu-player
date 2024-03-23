use once_cell::sync::Lazy;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tauri::command;
use tauri::http::header::{
    ACCESS_CONTROL_ALLOW_CREDENTIALS, ACCESS_CONTROL_ALLOW_HEADERS, ACCESS_CONTROL_ALLOW_METHODS,
    ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_SECURITY_POLICY, CONTENT_SECURITY_POLICY_REPORT_ONLY,
    HOST, ORIGIN, REFERER, STRICT_TRANSPORT_SECURITY, X_FRAME_OPTIONS,
};
use tauri::http::{HeaderValue, Method, Request, Response, StatusCode};
use tauri_plugin_http::reqwest;
use tokio::sync::oneshot;

type RequestPool = Arc<Mutex<HashMap<u64, oneshot::Sender<()>>>>;

static REQUEST_ID_HEADER: &str = "x-request-id";
static REQUEST_POOL: Lazy<RequestPool> = Lazy::new(|| Arc::new(Mutex::new(HashMap::new())));
static HTTP_CLIENT: Lazy<reqwest::Client> = Lazy::new(|| {
    reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .expect("Failed to create HTTP client")
});

#[command]
fn cancel_cors_request(id: u64) {
    if let Some(tx) = REQUEST_POOL.lock().unwrap().remove(&id) {
        tx.send(()).ok();
        println!("❌ Request {}: Canceled", id);
    } else {
        println!("❌ Request {}: Not found", id);
    }
}

pub fn register_cors_protocol<R: tauri::Runtime>(builder: tauri::Builder<R>) -> tauri::Builder<R> {
    return builder
        .register_asynchronous_uri_scheme_protocol("x-http", move |_app, req, responder| {
            tauri::async_runtime::spawn(async move {
                if let Some(resp) = handle_request(req).await {
                    responder.respond(resp);
                }
            });
        })
        .register_asynchronous_uri_scheme_protocol("x-https", move |_app, req, responder| {
            tauri::async_runtime::spawn(async move {
                if let Some(resp) = handle_request(req).await {
                    responder.respond(resp);
                }
            });
        })
        .invoke_handler(tauri::generate_handler![cancel_cors_request]);
}

async fn handle_request(mut request: Request<Vec<u8>>) -> Option<Response<Vec<u8>>> {
    let mut request_id: Option<u64> = None;
    if let Some(request_id_header) = request.headers().get(REQUEST_ID_HEADER) {
        if let Ok(id) = request_id_header.to_str().unwrap().parse::<u64>() {
            request_id = Some(id);
        }
    }
    if request_id == None {
        return Some(
            Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .body(Vec::new())
                .unwrap(),
        );
    }

    // 请求开始，添加当前 request id 到请求池
    let (tx, rx) = oneshot::channel();
    REQUEST_POOL.lock().unwrap().insert(request_id?, tx);
    request.headers_mut().remove(REQUEST_ID_HEADER);

    let mut response = match cors_request(request, request_id?, rx).await {
        Ok(res) => res,
        Err(err) => Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .body(err.to_string().into_bytes())
            .unwrap(),
    };

    if !REQUEST_POOL.lock().unwrap().contains_key(&request_id?) {
        // 请求已被取消,不再处理响应
        return None;
    }
    // 请求结束，从请求池移除当前 request id
    REQUEST_POOL.lock().unwrap().remove(&request_id?);

    for key in [
        ACCESS_CONTROL_ALLOW_ORIGIN,
        ACCESS_CONTROL_ALLOW_METHODS,
        ACCESS_CONTROL_ALLOW_HEADERS,
        ACCESS_CONTROL_ALLOW_CREDENTIALS,
    ] {
        response
            .headers_mut()
            .insert(key, HeaderValue::from_static("*"));
    }

    println!("✅ Status: {}", response.status());
    println!("✅ Headers: {:#?}", response.headers());

    Some(response)
}

async fn cors_request(
    request: Request<Vec<u8>>,
    request_id: u64,
    rx: oneshot::Receiver<()>,
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
            .body(Vec::new())
            .unwrap());
    }

    let parsed_url = url.parse::<reqwest::Url>().unwrap();
    let host = parsed_url.host().unwrap().to_string();
    let origin = parsed_url.origin().unicode_serialization().to_string();
    headers.insert(HOST, HeaderValue::from_str(&host).unwrap());
    headers.insert(REFERER, HeaderValue::from_str(&url).unwrap());
    headers.insert(ORIGIN, HeaderValue::from_str(&origin).unwrap());

    println!("🔥 Request {}: {:?}", request_id, url);
    println!("🔥 Headers {}: {:#?}", request_id, headers);

    let request = HTTP_CLIENT
        .request(method, url)
        .headers(headers)
        .body(body)
        .send();

    let response_or_none = tokio::select! {
        _ = rx =>None,
        res = request => Some(res),
    };
    if let Some(response) = response_or_none {
        match response {
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
                return Ok(resp.body(res.bytes().await?.to_vec()).unwrap());
            }
            Err(err) => return Err(Box::new(err)),
        }
    }
    Err(Box::new(std::io::Error::new(
        std::io::ErrorKind::Other,
        "Request canceled",
    )))
}

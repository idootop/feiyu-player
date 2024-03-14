import { invoke } from "@tauri-apps/api/core";

class _CORSRequestInterceptor {
  _originalFetch;
  _request_id = 1;

  constructor() {
    this._originalFetch = fetch.bind(window);
    fetch = this.interceptFetch.bind(this);
  }

  _isEnableCORS = () => true;
  init(callback) {
    this._isEnableCORS = callback;
    console.log("✅ CORS Interceptor initialized");
  }

  async interceptFetch(input, init) {
    let request_id = 0;
    let url = input instanceof Request ? input.url : input.toString();
    const enableCORS =
      this._isEnableCORS() &&
      (url.startsWith("https://") || url.startsWith("http://"));
    if (enableCORS) {
      url = "x-" + url;
      request_id = this._request_id++;
      init = {
        ...init,
        headers: {
          ...init?.headers,
          "x-request-id": request_id.toString(),
        },
      };
    }

    console.log("🔥 Request", url);

    try {
      const response = await this._originalFetch(url, init);
      console.log("✅ Response", response);
      return response;
    } catch (error) {
      console.error("❌ Fetch failed", error);
      if (request_id) {
        await invoke("cancel_request", { id: request_id });
      }
      return error;
    }
  }
}

export const CORSRequestInterceptor = new _CORSRequestInterceptor();

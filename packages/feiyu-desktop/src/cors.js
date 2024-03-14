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
    let id = 0;
    let url = input instanceof Request ? input.url : input.toString();
    const enableCORS = this._isEnableCORS() && /^(?:x-)?https?:\/\//i.test(url);
    if (enableCORS) {
      if (!url.startsWith("x-")) {
        url = "x-" + url;
      }
      id = this._request_id++;
      init = {
        ...init,
        headers: {
          ...init?.headers,
          "x-request-id": id.toString(),
        },
      };
    }

    try {
      this._log(id, "🔥 Request", url);
      const response = await this._originalFetch(url, init);
      this._log(id, "✅ Response", response);
      return response;
    } catch (error) {
      this._log(id, "❌ Fetch failed", error);
      if (id) {
        await invoke("cancel_cors_request", { id });
      }
      return error;
    }
  }

  _log(id, text, data) {
    if (id) {
      console.log(text + " " + id, data);
    }
  }
}

export const CORSRequestInterceptor = new _CORSRequestInterceptor();

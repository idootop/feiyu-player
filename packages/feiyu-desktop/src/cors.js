class _CORSRequestInterceptor {
  _originalFetch;

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
    let url = input instanceof Request ? input.url : input.toString();
    if (this._isEnableCORS()) {
      if (url.startsWith("https://") || url.startsWith("http://")) {
        url = "x-" + url;
      }
    }

    console.log("🔥 Request", url);

    try {
      const response = await this._originalFetch(url, init);
      console.log("✅ Response", response);
      return response;
    } catch (error) {
      console.error("❌ Fetch failed", error);
      return error;
    }
  }
}

export const CORSRequestInterceptor = new _CORSRequestInterceptor();

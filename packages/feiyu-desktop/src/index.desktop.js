import { invoke } from "@tauri-apps/api/core";
import { getCurrent } from "@tauri-apps/api/webviewWindow";
import { type as osType } from "@tauri-apps/plugin-os";
import { CORSRequestInterceptor } from "./cors";

class _FeiyuDesktop {
  isDesktop = true;
  isMac = false;
  isWindows = false;
  isLinux = false;

  invoke = null;
  window = null;

  async init() {
    CORSRequestInterceptor.init();
    this.invoke = invoke;
    this.window = getCurrent();
    const type = await osType();
    this.isMac = type === "Darwin";
    this.isWindows = type === "Windows_NT";
    this.isLinux = type === "Linux";
  }
}

export const FeiyuDesktop = new _FeiyuDesktop();

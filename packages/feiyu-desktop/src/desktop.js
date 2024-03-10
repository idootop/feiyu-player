import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { type as osType } from "@tauri-apps/api/os";

class _FeiyuDesktop {
  isDesktop = true;
  isMac = false;
  isWindows = false;
  isLinux = false;

  invoke = null;
  window = null;

  async init() {
    this.invoke = invoke;
    this.window = appWindow;
    const type = await osType();
    this.isMac = type === "Darwin";
    this.isWindows = type === "Windows_NT";
    this.isLinux = type === "Linux";
  }
}

export const FeiyuDesktop = new _FeiyuDesktop();

import { invoke } from "@tauri-apps/api/core";
import { getCurrent } from "@tauri-apps/api/webviewWindow";
import { type as osType } from "@tauri-apps/plugin-os";
import { updater } from "./updater";

class _FeiyuDesktop {
  isDesktop = true;
  isMac = false;
  isWindows = false;
  isLinux = false;

  invoke = null;
  window = null;
  updater = updater;

  _initialized = false;
  async init() {
    if (this._initialized) {
      return;
    }
    this.invoke = invoke;
    this.window = getCurrent();
    const type = await osType();
    this.isMac = type === "macos";
    this.isWindows = type === "windows";
    this.isLinux = type === "linux";
    this._initFullScreen();
    this._initWindowsBorder();
    this._initialized = true;
  }

  _initWindowsBorder() {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const appBorderElement = document.createElement("div");
    bodyElement.appendChild(appBorderElement);
    [htmlElement, bodyElement].forEach((e) => {
      e.style.background = "transparent";
      e.style.clipPath = "inset(1px round 12px)";
    });
    appBorderElement.style.position = "fixed";
    appBorderElement.style.top = "1px";
    appBorderElement.style.left = "1px";
    appBorderElement.style.zIndex = "10000";
    appBorderElement.style.pointerEvents = "none";
    appBorderElement.style.border = "1px solid rgba(0, 0, 0, 10%)";
    appBorderElement.style.borderRadius = "12px";
    appBorderElement.style.width = "calc(100vw - 2 * 1px)";
    appBorderElement.style.height = "calc(100vh - 2 * 1px)";
  }

  _initFullScreen() {
    if (this.isWindows) {
      document.addEventListener("fullscreenchange", async () => {
        const fullscreen = document.fullscreenElement != null;
        await this.window?.setFullscreen(fullscreen);
      });
    }
  }
}

export const FeiyuDesktop = new _FeiyuDesktop();

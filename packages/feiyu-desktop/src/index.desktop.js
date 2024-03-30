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
      e.style.clipPath = "inset(0px round 12px)";
    });
    appBorderElement.style.position = "fixed";
    appBorderElement.style.top = "0";
    appBorderElement.style.left = "0";
    appBorderElement.style.zIndex = "1000";
    appBorderElement.style.pointerEvents = "none";
    appBorderElement.style.border = "1px solid rgba(0, 0, 0, 10%)";
    appBorderElement.style.borderRadius = "12px";
    appBorderElement.style.width = "100vw";
    appBorderElement.style.height = "100vh";
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

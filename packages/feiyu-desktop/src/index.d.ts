import { invoke } from "@tauri-apps/api/core";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

declare class _FeiyuDesktop {
  isDesktop: boolean;
  isMac: boolean;
  isWindows: boolean;
  isLinux: boolean;
  init: () => Promise<void>;
  setCORS: (enable: boolean) => void;
  invoke?: typeof invoke;
  window?: WebviewWindow;
}
declare const FeiyuDesktop: _FeiyuDesktop;
export { FeiyuDesktop };

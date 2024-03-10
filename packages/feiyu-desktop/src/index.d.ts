import { invoke } from "@tauri-apps/api/tauri";
import { WebviewWindow } from "@tauri-apps/api/window";

declare class _FeiyuDesktop {
  isDesktop: boolean;
  isMac: boolean;
  isWindows: boolean;
  isLinux: boolean;
  init?: () => Promise<void>;
  invoke?: typeof invoke;
  window?: WebviewWindow;
}
declare const FeiyuDesktop: _FeiyuDesktop;
export { FeiyuDesktop };

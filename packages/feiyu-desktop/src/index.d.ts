import { invoke } from "@tauri-apps/api/core";
import { Update } from "@tauri-apps/plugin-updater";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

declare class Updater {
  checking: boolean;
  updater?: Update;
  needUpdate: () => Promise<boolean>;
  update: () => Promise<void>;
  check: () => Promise<Update | undefined>;
  download: () => Promise<boolean>;
}

declare class _FeiyuDesktop {
  isDesktop: boolean;
  isMac: boolean;
  isWindows: boolean;
  isLinux: boolean;
  init: () => Promise<void>;
  invoke?: typeof invoke;
  window?: WebviewWindow;
  updater?: Updater;
}
declare const FeiyuDesktop: _FeiyuDesktop;
export { FeiyuDesktop };

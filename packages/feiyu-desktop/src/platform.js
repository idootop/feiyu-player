import { type as osType } from "@tauri-apps/plugin-os";

export async function getPlatform() {
  const type = await osType();
  return {
    isMac: type === "macos",
    isWindows: type === "windows",
    isLinux: type === "linux",
  };
}

export async function isMac() {
  return (await osType()) === "macos";
}

export async function isWindows() {
  return (await osType()) === "windows";
}

export async function isLinux() {
  return (await osType()) === "linux";
}

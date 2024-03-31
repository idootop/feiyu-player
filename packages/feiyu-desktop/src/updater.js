import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { getPlatform, isWindows } from "./platform";

class Updater {
  checking = false;
  updater = undefined;
  async needUpdate() {
    const available = await this.check();
    if (available) {
      if (await isWindows()) {
        // Windows 下载完更新后会自动重启安装更新
        return true;
      }
      // macOS, linux 自动下载更新
      return this.download();
    }
    return false;
  }
  async update() {
    if (await isWindows()) {
      await this.download();
    }
    await relaunch();
  }
  async check() {
    if (this.updater) {
      return this.updater?.available;
    }
    if (!this.checking) {
      this.checking = new Promise(async (resolve) => {
        this.updater = await check().catch(() => undefined);
        resolve(this.updater?.available);
      });
    }
    return this.checking;
  }
  async download() {
    if (this.updater?.available) {
      let finished = false;
      await this.updater
        ?.downloadAndInstall((progress) => {
          if (progress.event === "Finished") {
            finished = true;
          }
        })
        .catch(() => undefined);
      return finished;
    }
    return false;
  }
}

export const updater = new Updater();

import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

class Updater {
  checking = false;
  update = undefined;
  async needUpdate() {
    const update = await this.check();
    if (update) {
      return this.download();
    }
    return false;
  }
  async relaunch() {
    await relaunch();
  }
  async check() {
    if (update) {
      return update;
    }
    if (!this.checking) {
      this.checking = new Promise(async (resolve) => {
        this.update = await check().catch(() => undefined);
        resolve(this.update);
      });
    }
    return this.checking;
  }
  async download() {
    if (this.update) {
      let finished = false;
      await update
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

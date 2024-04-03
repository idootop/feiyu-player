#!/usr/bin/env node

import path from "path";
import {
  copyFile,
  deleteFile,
  getFiles,
  moveFile,
  readString,
  writeJSON,
} from "./io.js";

async function main() {
  const args = process.argv.slice(2);
  const [root, version, notes] = args;
  const targets = {
    "darwin-x86_64": "macos_x86_64.app.tar.gz",
    "darwin-aarch64": "macos_aarch64.app.tar.gz",
    "darwin-universal": "macos_universal.app.tar.gz",
    "windows-x86_64": "windows_x86_64.nsis.zip",
    "windows-aarch64": "windows_aarch64.nsis.zip",
    "windows-i686": "windows_i686.nsis.zip",
    "linux-x86_64": "linux_x86_64.AppImage.tar.gz",
    "linux-i686": "linux_i686.AppImage.tar.gz",
  };
  const files = await getFiles(path.join(root, "dist"));
  const platforms = {};
  for (const target in targets) {
    const suffix = targets[target];
    const updater = files.find((e) => e.endsWith(suffix));
    if (updater) {
      const sig = path.join(root, "dist", updater + ".sig");
      const signature = await readString(sig);
      if (signature) {
        platforms[target] = {
          signature,
          url: `https://github.com/idootop/feiyu-player/releases/download/updater/${updater}`,
        };
        await deleteFile(sig);
        await moveFile(
          path.join(root, "dist", updater),
          path.join(root, "updater", updater)
        );
        console.log(`✅ ${target}`);
      }
    }
  }
  await writeJSON(path.join(root, "updater", "latest.json"), {
    version,
    notes,
    platforms,
    pub_date: new Date().toISOString(),
  });
  const installers = [
    "macos_universal.dmg",
    "windows_x86_64.exe",
    "linux_x86_64.deb",
  ];
  for (const file of files) {
    const match = installers.find((e) => file.endsWith(e));
    if (match) {
      await copyFile(
        path.join(root, "dist", file),
        path.join(root, "installer", file)
      );
    }
    // 移除版本号
    await moveFile(
      path.join(root, "dist", file),
      path.join(root, "dist", file.replace("_" + version, ""))
    );
  }
}

main();

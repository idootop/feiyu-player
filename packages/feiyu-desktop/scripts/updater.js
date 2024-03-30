#!/usr/bin/env node

import path from "path";
import { getFiles, readString, writeJSON } from "./io.js";

async function main() {
  const args = process.argv.slice(2);
  const [root, version, notes] = args;
  const targets = {
    "darwin-x86_64": "macos_x86_64.app.tar.gz",
    "darwin-aarch64": "macos_aarch64.app.tar.gz",
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
      const signature = await readString(
        path.join(root, "dist", updater + ".sig")
      );
      if (signature) {
        platforms[target] = {
          signature,
          url: `https://github.com/idootop/feiyu-player/releases/download/v${version}/${updater}`,
        };
        console.log(`✅ ${target}`);
      }
    }
  }
  await writeJSON(path.join(root, "dist", "latest.json"), {
    version,
    notes,
    platforms,
    pub_date: new Date().toISOString(),
  });
}

main();

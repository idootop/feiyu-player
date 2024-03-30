#!/usr/bin/env node

import path from "path";
import { copyFile, getFiles } from "./io.js";

async function main() {
  const args = process.argv.slice(2);
  const [target, appName] = args;
  const bundleDir = path.resolve(`src-tauri/target/${target}/release/bundle`);
  let outputs = {};
  switch (process.platform) {
    case "darwin":
      outputs = {
        dmg: [".dmg"],
        macos: [".app", ".app.tar.gz", ".app.tar.gz.sig"],
      };
      break;
    case "win32":
      outputs = {
        msi: [".msi", ".msi.zip", ".msi.zip.sig"],
        nsis: [".exe", ".nsis.zip", ".nsis.zip.sig"],
      };
      break;
    case "linux":
      outputs = {
        deb: [".deb"],
        rpm: [".rpm"],
        appimage: [".AppImage", ".AppImage.tar.gz", ".AppImage.tar.gz.sig"],
      };
      break;
    default:
      console.log("未知操作系统");
  }
  for (const dir in outputs) {
    const files = await getFiles(path.join(bundleDir, dir));
    for (const filename of files) {
      const suffix = outputs[dir].find((e) => filename.endsWith(e));
      if (suffix) {
        await copyFile(
          path.join(bundleDir, dir, filename),
          path.join("dist", appName + suffix)
        );
        console.log(`✅ ${appName + suffix}`);
      }
    }
  }
}

main();

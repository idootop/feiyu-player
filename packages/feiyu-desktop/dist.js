#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";

const getFiles = (dir) => {
  return new Promise((resolve) => {
    fs.readdir(dir, (err, files) => {
      resolve(err ? [] : files);
    });
  });
};

const copyFile = (from, to) => {
  if (!fs.existsSync(from)) {
    return false;
  }
  const dirname = path.dirname(to);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  return new Promise((resolve) => {
    fs.copy(from, to, (err) => {
      resolve(err ? false : true);
    });
  });
};

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

#!/usr/bin/env node

import path from "path";
import { env } from "node:process";
import { spawn } from "child_process";

async function main() {
  const bgPath = path.resolve("background.jpg");
  env.BACKGROUND_FILE = bgPath;
  env.BACKGROUND_FILE_NAME = path.basename(env.BACKGROUND_FILE);
  env.BACKGROUND_CLAUSE = `set background picture of opts to file ".background:${env.BACKGROUND_FILE_NAME}"`;
  runShell("pnpm tauri build");
}

main();

function runShell(script) {
  const [command, ...args] = script.split(" ").filter((e) => e.trim() !== "");
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env, shell: true, stdio: "inherit" });
    process.on("SIGTERM", () => child.kill("SIGTERM"));
    process.on("SIGINT", () => child.kill("SIGINT"));
    process.on("SIGBREAK", () => child.kill("SIGBREAK"));
    process.on("SIGHUP", () => child.kill("SIGHUP"));
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === null) code = signal === "SIGINT" ? 0 : 1;
      if (code === 0) {
        resolve();
      } else {
        reject(code);
      }
    });
  });
}

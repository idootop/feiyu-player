import { defineConfig } from "tsup";

export default defineConfig(() => ({
  entry: ["src/proxy.ts"],
  outDir: "api",
  target: "node16",
  platform: "node",
  format: ["esm"],
  sourcemap: false,
  treeshake: true,
  minify: true,
  clean: true,
  shims: true,
  dts: false,
}));

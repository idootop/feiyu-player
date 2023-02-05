import { moveFile, readString, writeString } from './utils/io';

const output = 'dist';
const index = 'index.html';
const manifest = 'manifest.webmanifest';
const registerSW = 'registerSW.js';
const sw = 'sw.js';

export const main = async () => {
  // 替换 index.html 中的 registerSW 路径
  const indexPath = `${output}/${index}`;
  let indexText = readString(indexPath);
  indexText = indexText.replace(/\/pwa/g, '');
  indexText = indexText.replace(/"\/logo-/g, '"/pwa/logo-');
  indexText = indexText.replace('"/' + manifest, '"/pwa/' + manifest);
  indexText = indexText.replace('"/' + registerSW, '"/pwa/' + registerSW);
  writeString(indexPath, indexText);
  // 替换 manifest 中的图片路径
  const manifestPath = `${output}/${manifest}`;
  let manifestText = readString(manifestPath);
  manifestText = manifestText.replace(/pwa/g, '');
  manifestText = manifestText.replace(/\/logo-/g, '/pwa/logo-');
  writeString(manifestPath, manifestText);
  // 移动 manifest 和 registerSW 文件到 pwa 目录下
  await moveFile(`${output}/${registerSW}`, `${output}/pwa/${registerSW}`);
  await moveFile(`${output}/${manifest}`, `${output}/pwa/${manifest}`);
  // 更新 sw 中的缓存文件路径
  const swPath = `${output}/pwa/${sw}`;
  let swText = readString(swPath);
  swText = swText.replace('workbox', 'pwa/workbox');
  swText = swText.replace(/\.\.\//g, '');
  swText = swText.replace(/"logo-/g, '"pwa/logo-');
  swText = swText.replace(manifest, 'pwa/' + manifest);
  swText = swText.replace(registerSW, 'pwa/' + registerSW);
  writeString(swPath, swText);
  await moveFile(swPath, `${output}/${sw}`);
};

main().catch(() => undefined);

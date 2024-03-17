import { copyFile } from './utils/io';

export const main = async () => {
  const dir = 'node_modules/feiyu-desktop/src';
  await copyFile(`${dir}/index.web.js`, `${dir}/index.js`);
};

main();

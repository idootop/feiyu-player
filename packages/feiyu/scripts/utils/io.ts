import * as fs from 'fs';

export const readString = (filePath: string): string => {
  return fs.readFileSync(filePath, 'utf8');
};

export const writeString = (filePath: string, content: string): void => {
  fs.writeFileSync(filePath, content, 'utf8');
};

export const existDir = (dir: string): boolean => {
  try {
    const stats = fs.statSync(dir);
    return stats.isDirectory();
  } catch (_) {
    return false;
  }
};

export const newDir = (dir: string): boolean => {
  fs.mkdir(
    dir,
    {
      recursive: true,
    },
    () => undefined,
  );
  return existDir(dir);
};

export const moveFile = (from: string, to: string): Promise<boolean> => {
  const [_file, ...dirs] = to.split('/').reverse();
  const dir = dirs.reverse().join('/');
  if (!existDir(dir)) {
    // 目标路径不存在，先创建路径
    newDir(dir);
  }
  return new Promise((resolve) => {
    fs.rename(from, to, (err) => {
      resolve(err ? false : true);
    });
  });
};

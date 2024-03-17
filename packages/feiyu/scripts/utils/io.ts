import fs from 'fs';
import path from 'path';

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

export const newDir = (dirname: string): boolean => {
  fs.mkdirSync(dirname, { recursive: true });
  return existDir(dirname);
};

export const moveFile = async (from: string, to: string) => {
  if (!fs.existsSync(from)) {
    return false;
  }
  const dirname = path.dirname(to);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  return new Promise<boolean>((resolve) => {
    fs.rename(from, to, (err) => {
      resolve(err ? false : true);
    });
  });
};

export const copyFile = async (from: string, to: string) => {
  if (!fs.existsSync(from)) {
    return false;
  }
  const dirname = path.dirname(to);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  return new Promise<boolean>((resolve) => {
    fs.copyFile(from, to, (err: any) => {
      resolve(err ? false : true);
    });
  });
};

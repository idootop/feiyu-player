import fs from "fs-extra";
import path from "path";

export const getFiles = (dir) => {
  return new Promise((resolve) => {
    fs.readdir(dir, (err, files) => {
      resolve(err ? [] : files);
    });
  });
};

export const copyFile = (from, to) => {
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

export const readString = (filePath) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    return undefined;
  }
  return new Promise((resolve) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      resolve(err ? undefined : data);
    });
  });
};

export const writeJSON = (filePath, json) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  const data = JSON.stringify(json);
  return new Promise((resolve) => {
    fs.writeFile(filePath, data, "utf8", (err) => {
      resolve(err ? false : true);
    });
  });
};

export const deepClone = <T = any>(obj: any): T => {
  return JSON.parse(JSON.stringify(obj));
};

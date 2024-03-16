export const timestamp = () => new Date().getTime();

export const delay = async (time: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, time));

export const printf = (...v: any[]) => console.log(...v);

export const printJson = (obj: any) =>
  console.log(JSON.stringify(obj, undefined, 4));

export const firstOf = <T = any>(datas?: T[]) =>
  datas ? (datas.length < 1 ? undefined : datas[0]) : undefined;

export const lastOf = <T = any>(datas?: T[]) =>
  datas ? (datas.length < 1 ? undefined : datas[datas.length - 1]) : undefined;

export const randomInt = (min: number, max?: number) => {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const pickOne = <T = any>(datas: T[]) =>
  datas.length < 1 ? undefined : datas[randomInt(datas.length - 1)];

export const range = (start: number, end?: number) => {
  if (!end) {
    end = start;
    start = 0;
  }
  return Array.from({ length: end - start }, (_, index) => start + index);
};

/**
 * clamp(-1,0,1)=0
 */
export function clamp(num: number, min: number, max: number): number {
  return num < max ? (num > min ? num : min) : max;
}

export const toSet = <T = any>(datas: T[], byKey?: (e: T) => any) => {
  if (byKey) {
    const keys = {};
    const newDatas: T[] = [];
    datas.forEach((e) => {
      const key = jsonEncode({ key: byKey(e) }) as any;
      if (!keys[key]) {
        newDatas.push(e);
        keys[key] = true;
      }
    });
    return newDatas;
  }
  return Array.from(new Set(datas));
};

export function jsonEncode(obj: any, prettier = false) {
  try {
    return prettier ? JSON.stringify(obj, undefined, 4) : JSON.stringify(obj);
  } catch (error) {
    return undefined;
  }
}

export function jsonDecode(json: string | undefined) {
  if (json == undefined) return undefined;
  try {
    return JSON.parse(json!);
  } catch (error) {
    return undefined;
  }
}

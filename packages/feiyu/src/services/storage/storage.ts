import { jsonDecode, jsonEncode } from '@/utils/base';
import { isObject } from '@/utils/is';

export const storage = {
  set(key: string, data: any) {
    const _data = isObject(data) ? jsonEncode(data) : data.toString();
    localStorage.setItem(key, _data);
  },
  get(key: string) {
    const data = localStorage.getItem(key);
    return jsonDecode(data ?? '') ?? data;
  },
};

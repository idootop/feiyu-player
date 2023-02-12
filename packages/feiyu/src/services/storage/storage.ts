import { jsonDecode, jsonEncode } from '@/utils/base';

export const storage = {
  set(key: string, data: any) {
    try {
      localStorage.setItem(key, jsonEncode({ data }) ?? '');
      return true;
    } catch {
      return false;
    }
  },
  get(key: string) {
    const data = localStorage.getItem(key);
    return jsonDecode(data ?? '{}')?.data;
  },
};

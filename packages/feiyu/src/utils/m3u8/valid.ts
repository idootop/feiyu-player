import { http } from '@/services/http';

export const isValidM3U8 = async (m3u8: string) => {
  const result = await http.get(m3u8, undefined, {
    cache: true,
    cacheEmpty: true,
  });
  return result?.includes('#EXTM3U');
};

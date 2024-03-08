import { appConfig } from '@/data/config';
import { jsonEncode } from '@/utils/base';

import { cache } from '../cache';
import { http } from '../http';

const ipfsUpload = async (text: string): Promise<string | undefined> => {
  const token = (await appConfig.get()).ipfs?.token
  if (!token) {
    return undefined
  }
  const data = new Blob([text], { type: 'text/json' });
  const res = await http.post('https://api.nft.storage/upload/', data, {
    timeout: 30 * 1000, // 30s
    blob: true,
    cacheKey: text,
    headers: { Authorization: `Bearer ${token}`, 'X-Client': 'nft.storage/js' },
  });
  return res?.value?.cid;
};

export const ipfsURL = async (cid: string) => {
  const gateway = (await appConfig.get()).ipfs?.gateway ?? 'https://nftstorage.link/ipfs/{{cid}}';
  return gateway.replace('{{cid}}', cid);
};

export const ipfs = {
  async writeJson(data: any, raw = false) {
    return cache.readOrWrite(jsonEncode(data) ?? '404', async () => {
      return await ipfsUpload(jsonEncode(raw ? data : { data }) ?? '');
    });
  },
  async readJson(cid: string) {
    return cache.readOrWrite(cid, async () => {
      const result = await http.get(await ipfsURL(cid));
      return result?.data;
    });
  },
};

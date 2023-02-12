import { configs } from '@/data/config/manager';
import { jsonEncode } from '@/utils/base';
import { envs } from '@/utils/env';

import { cache } from '../cache';
import { http } from '../http';

const ipfsUpload = async (text: string): Promise<string | undefined> => {
  const data = new Blob([text], { type: 'text/json' });
  const res = await http.post('https://api.nft.storage/upload/', data, {
    blob: true,
    cacheKey: text,
    headers: {
      Authorization: `Bearer ${envs.kNftStorageToken}`,
      'X-Client': 'nft.storage/js',
    },
  });
  return res?.value?.cid;
};
export const ipfsGateway = () =>
  configs.current.ipfs?.gateway ?? 'https://gateway.pinata.cloud/ipfs/';
export const ipfs = {
  async writeJson(data: any) {
    return cache.readOrWrite(jsonEncode(data) ?? '404', async () => {
      return await ipfsUpload(jsonEncode({ data }) ?? '');
    });
  },
  async readJson(cid: string) {
    return cache.readOrWrite(cid, async () => {
      const result = await http.get(ipfsGateway() + cid);
      return result?.data;
    });
  },
};

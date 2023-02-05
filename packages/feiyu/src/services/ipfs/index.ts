import { NFTStorage } from 'nft.storage';

import { jsonEncode } from '@/utils/base';
import { envs } from '@/utils/env';

import { cache } from '../cache';
import { http } from '../http';

const gateway = 'https://snapshot.mypinata.cloud/ipfs/';
const client = new NFTStorage({ token: envs.kNftStorageToken });

export const ipfs = {
  async writeJson(data: any) {
    return cache.readOrWrite(jsonEncode(data) ?? '404', async () => {
      const blob = new Blob([jsonEncode({ data })!]);
      const cid = await client.storeBlob(blob).catch((_e) => {
        // console.log('IPFS ERROR', _e);
        return undefined;
      });
      return cid;
    });
  },
  async readJson(cid: string) {
    return cache.readOrWrite(cid, async () => {
      const result = await http.get(gateway + cid);
      return result?.data;
    });
  },
};

import { Message } from '@arco-design/web-react';

import { showCopyModal } from '@/pages/settings/modals';

import { jsonEncode } from './base';

export const clipboard = {
  async read() {
    try {
      return await navigator.clipboard?.readText();
    } catch {
      return null;
    }
  },
  async write(text?: string) {
    if (!text) {
      return false;
    }
    try {
      await navigator.clipboard?.writeText(text);
      Message.success('已复制到粘贴板');
    } catch {
      showCopyModal(text);
    }
    return true;
  },
  async writeJSON(data?: any) {
    return clipboard.write(jsonEncode(data));
  },
};

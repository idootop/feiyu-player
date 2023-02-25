import { kProxyHeader, kProxyHeaders, main } from '../src';
import { jsonEncode, printJson } from '../src/utils/base';
import { generateAPIEvent } from '../src/utils/scf/events';
import { SCFEvents } from '../src/utils/scf/types';

async function test() {
  const events: SCFEvents[] = [
    generateAPIEvent({
      method: 'GET',
      path: '/proxy',
      headers: {
        'User-Agent': 'test',
        [kProxyHeader]: 'https://v1.hitokoto.cn/',
        [kProxyHeaders]: jsonEncode({
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/109.0',
        }),
      },
      query: {
        c: 'j',
      },
    }),
  ];
  for (const event of events) {
    const response = await main(event);
    printJson(response);
  }
}

test();

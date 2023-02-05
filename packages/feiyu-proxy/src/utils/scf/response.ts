import { jsonEncode } from '../base';

const _contentTypes: any = {
  json: 'application/json; charset=utf-8',
  html: 'text/html; charset=utf-8',
  text: 'text/plain; charset=utf-8',
  xml: 'text/xml; charset=utf-8',
};

export const scfResponse = (
  body: any,
  config?: {
    code?: number;
    type?: 'json' | 'html' | 'text' | 'xml' | string;
    headers?: Record<string, string>;
  },
) => {
  const { code = 200, type = 'json', headers } = config ?? {};
  return {
    isBase64Encoded: false,
    statusCode: code,
    headers: {
      'content-type': _contentTypes[type] ?? type,
      ...headers,
      'access-control-allow-origin': '*', // 允许跨域请求
      'access-control-allow-headers': '*',
    },
    body: type.toLowerCase().includes('json') ? jsonEncode(body) : body,
  };
};

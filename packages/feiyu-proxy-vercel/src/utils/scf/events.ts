import { jsonEncode } from '../base';
import { isObject } from '../is';
import { APIContext, APIEvent, TimerContext, TimerEvent } from './types';

export const generateTimerEvent = (e: Partial<TimerContext>): TimerEvent => {
  return {
    Type: 'Timer',
    TriggerName: e.name ?? 'EveryDay',
    Time: e.time ?? '2019-02-21T11:49:00Z',
    Message: e.message ?? 'user define msg body',
  };
};

export const generateAPIEvent = (e: Partial<APIContext>): APIEvent => {
  return {
    httpMethod: e.method ?? 'POST',
    isBase64Encoded: false,
    path: e.path ?? '/svg-avatar',
    body: isObject(e.data) ? jsonEncode(e.data) : e.data,
    queryString: (e.query ?? {}) as any,
    headers: {
      'user-agent':
        e.userAgent ??
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0',
      'x-api-requestid': e.traceid ?? '22293325848152463c398df3e21c7389',
      'x-b3-traceid': e.traceid ?? '22293325848152463c398df3e21c7389',
      'x-api-scheme': 'https',
      ...e.headers,
    },
    requestContext: {
      path: e.path ?? '/svg-avatar',
      serviceId: 'service-886k0uiy',
      sourceIp: e.sourceIp ?? '50.7.158.186',
      stage: e.stage ?? 'release',
    },
  };
};

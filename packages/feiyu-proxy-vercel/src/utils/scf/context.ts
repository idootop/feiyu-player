import { jsonDecode } from '../base';
import { isNotEmpty } from '../is';
import {
  APIEvent,
  HttpQuery,
  SCFContext,
  SCFEvents,
  TimerEvent,
} from './types';

const _isTimerEvent = (e: SCFEvents) => (e as any).Type === 'Timer';
const _isAPIEvent = (e: SCFEvents) => (e as any).requestContext != null;
const _parseQuery = (datas: Record<string, string>) => {
  const newDatas: HttpQuery = {};
  for (const [key, value] of Object.entries(datas)) {
    if (value === '') {
      newDatas[key] = undefined;
    }
    if (value === 'true') newDatas[key] = true;
    if (value === 'false') newDatas[key] = false;
    if (/^(0|-?[1-9]\d*)$/.test(value)) {
      newDatas[key] = parseInt(value, 10);
    }
    newDatas[key] = value;
  }
  return newDatas;
};

const _clearKeys = [
  'x-api-requestid',
  'x-b3-traceid',
  'x-api-scheme',
  'requestsource',
  'referer',
  'host',
  'endpoint-timeout',
  'x-qualifier',
  'accept-encoding',
];

export const clearHeaders = (headers: any, clearKeys = _clearKeys) => {
  const _headers: any = {};
  for (const [key, value] of Object.entries(headers ?? {})) {
    if (!clearKeys.includes(key.toLowerCase())) {
      _headers[key] = value;
    }
  }
  return _headers;
};

export const scfContext = (e: SCFEvents): SCFContext | undefined => {
  if (_isTimerEvent(e)) {
    e = e as TimerEvent;
    return {
      isTimer: true,
      name: e.TriggerName,
      time: e.Time,
      message: e.Message,
    };
  }
  if (_isAPIEvent(e)) {
    e = e as APIEvent;
    const userAgent = e.headers['user-agent'];
    const traceid = e.headers['x-b3-traceid'];
    return {
      isAPI: true,
      stage: e.requestContext.stage,
      method: e.httpMethod,
      path: e.path,
      headers: e.headers,
      query: _parseQuery(e.queryString),
      data: jsonDecode(e.body) ?? (isNotEmpty(e.body) ? e.body : undefined),
      userAgent,
      traceid,
      sourceIp: e.requestContext.sourceIp,
    };
  }
};

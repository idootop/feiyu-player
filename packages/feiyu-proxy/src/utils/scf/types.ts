// {
//   Type: 'Timer',
//   TriggerName: 'EveryDay',
//   Time: '2019-02-21T11:49:00Z',
//   Message: 'user define msg body',
// }
export interface TimerEvent {
  Type: "Timer";
  TriggerName: string;
  Time: string;
  Message: string;
}

// {
//   httpMethod: 'POST',
//   isBase64Encoded: false,
//   path: '/svg-avatar',
//   body: '{"a":123}',
//   queryString: {
//     aaa: '1234',
//   },
//   headers: {
//     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0',
//     'x-api-requestid': '22293325848152463c398df3e21c7389',
//     'x-b3-traceid': '22293325848152463c398df3e21c7389',
//     'x-api-scheme': 'https',
//   },
//   requestContext: {
//     httpMethod: 'ANY',
//     identity: {},
//     path: '/svg-avatar',
//     serviceId: 'service-886k0uiy',
//     sourceIp: '50.7.158.186',
//     stage: 'release',
//   },
//   headerParameters: {},
//   pathParameters: {},
//   queryStringParameters: {},
// }
export interface APIEvent {
  httpMethod: "POST" | "GET";
  isBase64Encoded: boolean;
  // Full relative path
  path: string;
  // POST row json string
  body: string;
  // GET query map
  queryString: Record<string, string>;
  headers: Record<string, any>;
  requestContext: {
    // Path category
    path: string;
    serviceId: string;
    sourceIp: string;
    stage: string;
  };
}

export type SCFEvents = APIEvent | TimerEvent;

export type HttpQuery = Record<string, string | number | boolean | undefined>;

interface ContextTypes {
  isTimer?: boolean;
  isAPI?: boolean;
}

export interface TimerContext extends ContextTypes {
  isTimer: true;
  name: string;
  time: string;
  message: string;
}

export interface APIContext extends ContextTypes {
  isAPI: true;
  stage: string;
  method: "POST" | "GET";
  path: string;
  query: HttpQuery;
  data: any;
  headers: Record<string, any>;
  userAgent: string;
  sourceIp: string;
  traceid: string;
}

export type SCFContext = TimerContext | APIContext;

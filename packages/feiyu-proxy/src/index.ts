import axios from "axios";

import { jsonDecode } from "./utils/base";
import { isEmpty } from "./utils/is";
import { clearHeaders, scfContext } from "./utils/scf/context";
import { scfResponse } from "./utils/scf/response";
import { APIContext, SCFEvents } from "./utils/scf/types";

// Proxy 地址请求头
export const kProxyHeader = "x-proxy-target";
export const kProxyHeaders = "x-proxy-headers";

// 默认响应
const defaultResponse = scfResponse("404", { type: "text" });

// header: x-proxy-target
export const main = async (event: SCFEvents) => {
  const ctx = scfContext(event) as APIContext;
  const { path, method, headers, query, data } = ctx;

  // 无效的请求
  if (path !== "/proxy" || isEmpty(headers[kProxyHeader])) {
    return defaultResponse;
  }

  const target = headers[kProxyHeader];
  const targetHeaders = jsonDecode(headers[kProxyHeaders]) ?? {};
  const cleanHeaders = clearHeaders(headers, [
    "host",
    "origin",
    "referer",
    "x-api-scheme",
    "x-api-requestid",
    "x-forwarded-host",
    "x-forwarded-proto",
    "x-forwarded-port",
    "x-forwarded-for",
    "x-real-ip",
    "x-b3-traceid",
    "x-api-scheme",
    "x-qualifier",
    "requestsource",
    "endpoint-timeout",
    "accept-encoding",
    kProxyHeader,
    kProxyHeaders,
    ...Object.keys(targetHeaders),
  ]);

  const response: any = await axios({
    method: method,
    url: target,
    params: query,
    data: data,
    headers: {
      ...cleanHeaders,
      ...targetHeaders,
      referer: target,
      origin: new URL(target).origin,
    },
  }).catch((e) => {
    console.error(e.toString());
    return e.response;
  });

  return scfResponse(response?.data, {
    code: response?.status,
    headers: clearHeaders(response?.headers, [
      "content-length",
      "access-control-allow-origin",
      "access-control-allow-headers",
    ]),
  });
};

export const kIsMac =
  navigator.userAgentData?.platform === "macOS" ||
  /^Mac/.test(navigator.platform ?? "") ||
  /Mac/.test(navigator.userAgent);

export const kIsWindows =
  navigator.userAgentData?.platform === "Windows" ||
  /^Win/.test(navigator.platform ?? "") ||
  /Win/.test(navigator.userAgent);

export const kIsLinux =
  navigator.userAgentData?.platform === "Linux" ||
  /^Linux/.test(navigator.platform ?? "") ||
  /Linux/.test(navigator.userAgent);

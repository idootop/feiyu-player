let { platform, userAgent, maxTouchPoints } = navigator;
userAgent = userAgent.toLowerCase();
platform = platform?.toLowerCase() || userAgent;
maxTouchPoints = maxTouchPoints || 1;

export const kIsIOS =
  /ipad|iphone|ipod/i.test(platform) ||
  (/mac/i.test(platform) && maxTouchPoints > 1);

export const kIsAndroid =
  /android/i.test(platform) || /android/i.test(userAgent);

export const kIsMac =
  !kIsIOS && (/mac/i.test(platform) || /mac/i.test(userAgent));

export const kIsWindows = /win/i.test(platform) || /windows/i.test(userAgent);

export const kIsLinux =
  !kIsAndroid && (/linux/i.test(platform) || /linux/i.test(userAgent));

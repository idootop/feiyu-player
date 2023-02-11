export const clipboard = {
  async read() {
    return navigator.clipboard
      ? await navigator.clipboard.readText().catch(() => undefined)
      : undefined;
  },
  async write(text: string) {
    try {
      // 只在 https 环境可用
      const failed = navigator.clipboard
        ? await navigator.clipboard.writeText(text).catch(() => true)
        : true;
      return !failed;
      // todo 可以再次读取对比是否已复制（但是有可能需要授权弹窗）
    } catch (_) {
      // polyfill
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((resolve) => {
        resolve(document.execCommand?.('copy') ?? false);
        textArea.remove();
      });
    }
  },
};

export const clipboard = {
  async write(text: string) {
    if (navigator.clipboard && window.isSecureContext) {
      // 只在 https 环境可用
      return navigator.clipboard.writeText(text);
    } else {
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
        resolve(document.execCommand('copy'));
        textArea.remove();
      });
    }
  },
};

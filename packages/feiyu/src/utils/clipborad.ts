// 主要代码由 ChatGPT 生成
export const clipboard = {
  async read() {
    let result: string | undefined = undefined;

    // Check if there is a modern clipboard API available
    if (navigator.clipboard) {
      try {
        result = await navigator.clipboard.readText();
      } catch (error) {
        console.error('Failed to read from clipboard using modern API', error);
      }
    } else {
      // Use document.execCommand as a fallback
      const textarea = document.createElement('textarea');
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.focus();

      try {
        document.execCommand('paste');
        result = textarea.value;
      } catch (error) {
        console.error('Failed to read from clipboard using execCommand', error);
      } finally {
        document.body.removeChild(textarea);
      }
    }

    return result;
  },
  async write(text: string) {
    let result = false;

    // Check if there is a modern clipboard API available
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        result = true;
      } catch (error) {
        console.error('Failed to write to clipboard using modern API', error);
      }
    } else {
      // Use document.execCommand as a fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        result = document.execCommand('copy');
      } catch (error) {
        console.error('Failed to write to clipboard using execCommand', error);
      } finally {
        document.body.removeChild(textarea);
      }
    }

    return result;
  },
};

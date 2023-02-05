export interface AbortConfig {
  signal?: AbortSignal;
}

export const withAbort = <T = any>(
  p: Promise<T>,
  signal?: AbortSignal,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject('abort');
    }
    const _listener = () => reject('abort');
    signal?.addEventListener('abort', _listener);
    p.then((result) => {
      signal?.removeEventListener('abort', _listener);
      resolve(result);
    }).catch((err) => {
      signal?.removeEventListener('abort', _listener);
      reject(err);
    });
  });
};

export const getAbort = () => {
  let controller = new AbortController();
  const signal = controller.signal;
  return {
    signal,
    abort: () => {
      controller?.abort();
      controller = null as any;
    },
  };
};

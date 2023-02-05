// https://github.com/sindresorhus/p-timeout/blob/main/index.js

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export interface ClearablePromise<T> extends Promise<T> {
  clear: () => void;
}

/**
Timeout a promise after a specified amount of time.
@example
```
await pTimeout(delayedPromise(), 300);
```
*/
export default function pTimeout<ValueType, ReturnType = ValueType>(
  promise: PromiseLike<ValueType>,
  milliseconds = 3000,
): ClearablePromise<ValueType | ReturnType> {
  const customTimers = { setTimeout, clearTimeout };

  let timer: any;

  const cancelablePromise: any = new Promise((resolve, reject) => {
    timer = customTimers.setTimeout.call(
      undefined,
      () => {
        const errorMessage = `Promise timed out after ${milliseconds} milliseconds`;
        const timeoutError = new TimeoutError(errorMessage);

        if (typeof (promise as any).cancel === 'function') {
          (promise as any).cancel();
        }

        reject(timeoutError);
      },
      milliseconds,
    );

    (async () => {
      try {
        resolve(await promise);
      } catch (error) {
        reject(error);
      } finally {
        customTimers.clearTimeout.call(undefined, timer);
      }
    })();
  });

  cancelablePromise.clear = () => {
    customTimers.clearTimeout.call(undefined, timer);
    timer = undefined;
  };

  return cancelablePromise;
}

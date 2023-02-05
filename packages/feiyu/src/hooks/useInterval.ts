import { useEffect } from 'react';

export const useInterval = (callback: () => void, duration = 100) => {
  useEffect(() => {
    const timer = setInterval(() => {
      callback?.();
    }, duration);
    return () => {
      clearInterval(timer);
    };
  }, [callback, duration]);
};

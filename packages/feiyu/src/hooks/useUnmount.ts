import { useEffect, useRef } from 'react';

/**
 * const isUnmountRef = useUnmount()
 *
 * const isUnmount = isUnmountRef.current
 */
export const useUnmount = () => {
  const ref = useRef(false);
  useEffect(() => {
    return () => {
      ref.current = true;
    };
  }, []);
  return ref;
};

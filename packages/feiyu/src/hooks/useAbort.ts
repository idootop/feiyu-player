import { useRef } from 'react';

import { getAbort } from '@/utils/abort';

export const useAbort = () => {
  const ref = useRef(getAbort());
  const preRef = useRef<any>();
  const finalRef = useRef<{
    signal: AbortSignal;
    abortPre: () => void;
  }>();
  finalRef.current = {
    signal: ref.current.signal,
    abortPre: () => {
      preRef.current?.abort();
      preRef.current = ref.current;
      ref.current = getAbort();
    },
  };

  return finalRef;
};

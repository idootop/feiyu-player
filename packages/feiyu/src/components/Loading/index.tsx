import { Spin } from '@arco-design/web-react';
import { useEffect, useState } from 'react';

import { useUnmount } from '@/hooks/useUnmount';

export const Loading = (props?: { size?: number; delay?: number }) => {
  const { size = 40, delay = 500 } = props ?? {};
  const [inited, setInited] = useState(false);
  const isUnmountRef = useUnmount();
  useEffect(() => {
    setTimeout(() => {
      if (!isUnmountRef.current) {
        setInited(true);
      }
    }, delay);
  }, []);
  return inited ? <Spin size={size} /> : <div></div>;
};

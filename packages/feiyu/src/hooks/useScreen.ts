import { useEffect, useRef, useState } from 'react';

export const useScreen = () => {
  const ref = useRef<any>();
  const [screen, setScreen] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  ref.current = setScreen;

  const _handleResize = () => {
    ref.current({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', _handleResize);
    return () => window.removeEventListener('resize', _handleResize);
  }, []);

  return screen;
};

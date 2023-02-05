import { useEffect, useRef, useState } from 'react';

export const useScreen = () => {
  const ref = useRef<any>();
  const [screen, setScreen] = useState({
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  });
  ref.current = setScreen;

  const _handleResize = () => {
    ref.current({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', _handleResize);
    return () => window.removeEventListener('resize', _handleResize);
  }, []);

  return screen;
};

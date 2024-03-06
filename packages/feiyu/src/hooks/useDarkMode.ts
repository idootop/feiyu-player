import { useEffect } from 'react';
import { useXState } from 'xsta';

import { storage } from '@/services/storage/storage';


const _darkModeKey = 'isDarkMode';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useXState<boolean>(_darkModeKey);
  const switchDarkMode: any = () => {
    if (isDarkMode) {
      document.body.setAttribute('arco-theme', 'light');
    } else {
      document.body.setAttribute('arco-theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
    storage.set(_darkModeKey, !isDarkMode);
  };
  useEffect(() => {
    if (isDarkMode === undefined) {
      const _isDark = storage.get(_darkModeKey) === true;
      setIsDarkMode(_isDark);
      if (!_isDark) {
        document.body.setAttribute('arco-theme', 'light');
      } else {
        document.body.setAttribute('arco-theme', 'dark');
      }
    }
  }, []);
  return { isDarkMode, switchDarkMode };
};

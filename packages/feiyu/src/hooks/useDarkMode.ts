import { useEffect } from 'react';

import { storage } from '@/services/storage/storage';

import { useStore } from '../services/store/useStore';

const _darkModeKey = 'isDarkMode';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useStore<boolean>(_darkModeKey);
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

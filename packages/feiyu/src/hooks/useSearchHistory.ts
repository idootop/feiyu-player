import { useXState } from 'xsta';

import { storage } from '@/services/storage/storage';
import { toSet } from '@/utils/base';

const _key = 'kSearchHistory';
export const useSearchHistory = () => {
  const [history, setValue] = useXState<string[]>(
    _key,
    storage.get(_key) || [],
  );

  const updateValue = (data: string[]) => {
    storage.set(_key, data);
    setValue(data);
  };

  const addHistory = (keyword: string) => {
    const data = toSet([keyword, ...history]);
    updateValue(data);
  };

  const clearHistory = () => {
    updateValue([]);
  };

  return {
    history,
    addHistory,
    clearHistory,
  };
};

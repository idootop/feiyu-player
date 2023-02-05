import { useCallback, useEffect, useRef, useState } from 'react';

import { isNotEqual } from '@/utils/diff';

let _id = 0;
export const newId = () => (_id++).toString();
export const useId = () => useInit(() => newId());

const _stores: Record<
  string,
  { data: any; rebuilds: Record<string, () => void> }
> = {};

export const store = {
  get<T = any>(key: string): T | undefined {
    return _stores[key]?.data;
  },
  set(key: string, data: any) {
    if (_stores[key]) {
      if (isNotEqual(_stores[key].data, data)) {
        _stores[key].data = data;
        Object.values(_stores[key].rebuilds).forEach((rebuild) => rebuild());
      }
    } else {
      _stores[key] = {
        data: data,
        rebuilds: {},
      };
    }
  },
  _addRebuildCallback(key: string, id: string, rebuild: () => void) {
    if (_stores[key]) {
      _stores[key].rebuilds[id] = rebuild;
    } else {
      _stores[key] = {
        data: undefined,
        rebuilds: {
          [id]: rebuild,
        },
      };
    }
  },
  _removeRebuildCallback(key: string, id: string) {
    if (_stores[key]) {
      delete _stores[key].rebuilds[id];
    }
  },
};

/**
 * 初始化hook
 *
 * 此hook中的初始化函数会立即初始化，且只执行一次
 */
export const useInit = <T>(fn: () => T, deps?: any[]): T => {
  const ref = useRef<any>({
    result: 404,
    deps: undefined,
  });
  if (ref.current.result === 404 || isNotEqual(ref.current.deps, deps)) {
    ref.current.result = fn();
    ref.current.deps = deps;
  }
  return ref.current.result;
};

export const useDispose = (fn: () => void) => {
  useEffect(() => {
    return fn;
  }, []);
};

export const useRebuild = () => {
  const [flag, setFlag] = useState(false);
  return useCallback(() => {
    setFlag(!flag);
  }, [flag]);
};

export const useRebuildRef = () => {
  const ref = useRef({
    rebuild: () => undefined as any,
  });
  const [flag, setFlag] = useState(false);
  ref.current.rebuild = () => {
    setFlag(!flag);
  };
  return ref;
};

export const useRefCallback = <T = any>(fn: any) => {
  const ref = useRef<T>();
  ref.current = fn;
  return ref;
};

export const useStore = <T = any>(
  key: string,
  data?: any,
  filter?: (state: T | undefined) => any,
): [T, (newData: T | undefined) => void, () => T | undefined] => {
  const ref = useRef({
    id: newId(),
    rebuild: undefined as any,
  });
  const currentData = () => [
    store.get(key),
    (newData) => {
      store.set(key, newData);
    },
    () => store.get(key),
  ];

  // 更新刷新回调
  const _rebuild = useRebuild();
  ref.current.rebuild = _rebuild;
  const memoFilterRef = useMemoFilter({
    filter,
    currentData,
    currentFilterData: () => store.get(key),
    immediately: false,
    onChange: () => {
      ref.current.rebuild();
    },
  });
  const rebuild = useCallback(() => {
    memoFilterRef.current.onChange();
  }, []);

  // 初始化数据
  useInit(() => {
    if (data) {
      store.set(key, data);
    }
  });

  // 注册刷新回调
  useInit(() => {
    store._addRebuildCallback(key, ref.current.id, rebuild);
  }, []);

  useEffect(() => {
    return () => {
      // 当组件卸载后，回收刷新回调
      store._removeRebuildCallback(key, ref.current.id);
    };
  }, []);

  return memoFilterRef.current.data ?? currentData();
};

export const useMemoFilter = <Q = any, F = Q>(props: {
  currentData?: () => Q | undefined;
  onChange?: (oldData: Q | undefined, newData: Q | undefined) => void;
  currentFilterData: () => F | undefined;
  filter?: (state: F | undefined) => any;
  immediately?: boolean;
}) => {
  const {
    currentData,
    currentFilterData,
    filter,
    onChange,
    immediately = true,
  } = props;
  const ref = useRef({
    inited: false,
    data: undefined as any,
    filterOld: undefined as any,
    onChange: undefined as any,
  });
  if (!ref.current.inited) {
    ref.current.data = currentData?.();
    ref.current.inited = true;
  }
  ref.current.onChange = () => {
    const _currentFilterData = currentFilterData();
    const oldData = ref.current.filterOld;
    const newData = filter?.(_currentFilterData as any);
    ref.current.filterOld = newData;
    if (!filter || isNotEqual(oldData, newData)) {
      const _currentData = currentData?.();
      onChange?.(ref.current.data, _currentData);
      ref.current.data = _currentData;
    }
  };
  if (immediately) {
    ref.current.onChange();
  }
  return ref;
};

export const useConsumer = <T = any>(
  key: string,
  filter?: (state: T | undefined) => any,
) => useStore(key, undefined, filter);

export const useProvider = <T>(key: string, data: T | undefined) => {
  useInit(() => {
    store.set(key, data);
  }, []);
};

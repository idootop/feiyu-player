import { useCallback, useEffect, useRef, useState } from 'react';

import { isNotEqual } from '@/utils/diff';

type GlobalStates = Record<
  string,
  { data: any; rebuilds: Record<string, () => void> }
>;

class GlobalStore {
  _id = 0;
  newId = () => (this._id++).toString();
  useId = () => useInit(() => this.newId());

  __stores: GlobalStates = {};

  get _stores(): GlobalStates {
    if (typeof window === 'undefined') {
      return this.__stores;
    }
    if (!window['__global_states__']) {
      window['__global_states__'] = this.__stores;
    }
    return window['__global_states__'];
  }

  get<T = any>(key: string): T | undefined {
    return this._stores[key]?.data;
  }
  set(key: string, data: any) {
    if (this._stores[key]) {
      if (isNotEqual(this._stores[key].data, data)) {
        this._stores[key].data = data;
        Object.values(this._stores[key].rebuilds).forEach((rebuild) =>
          rebuild(),
        );
      }
    } else {
      this._stores[key] = {
        data: data,
        rebuilds: {},
      };
    }
  }
  _addRebuildCallback(key: string, id: string, rebuild: () => void) {
    if (this._stores[key]) {
      this._stores[key].rebuilds[id] = rebuild;
    } else {
      this._stores[key] = {
        data: undefined,
        rebuilds: {
          [id]: rebuild,
        },
      };
    }
  }
  _removeRebuildCallback(key: string, id: string) {
    if (this._stores[key]) {
      delete this._stores[key].rebuilds[id];
    }
  }
}

export const store = new GlobalStore();

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
): [T | undefined, (newData: T | undefined) => void, () => T | undefined] => {
  useProvider(key, data);
  const ref = useRef({
    id: store.newId(),
    rebuild: undefined as any,
  });
  const currentData = () => [
    store.get(key),
    (newData) => {
      store.set(key, newData);
    },
    () => store.get(key),
  ];
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
  useEffect(() => {
    store._addRebuildCallback(key, ref.current.id, rebuild);
    return () => {
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
    if (!store._stores[key]) {
      store.set(key, data);
    }
  }, []);
};

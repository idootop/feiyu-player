import { useCallback, useRef } from 'react';

import { useAbort } from '@/hooks/useAbort';

import { useRebuildRef } from './useRebuild';

const _isEqual = (a: any, b: any) => a === b;

export const useSearchDatas = <Q = any, R = any>(config: {
  onSearch: (props: {
    query: Q;
    signal: AbortSignal;
    callback: (data: R) => void;
  }) => Promise<R[] | undefined>;
  initialDatas?: R[];
  isEqual?: (a: Q | undefined, b: Q) => boolean;
  onlyCallback?: boolean;
}): {
  search: (query: Q) => void;
  initial: boolean;
  searching: boolean;
  reset: () => void;
  datas: R[];
  query: Q | undefined;
  noData: boolean;
  sort: (compareFn: (a: R, b: R) => number) => void;
} => {
  const {
    onSearch,
    initialDatas,
    isEqual = _isEqual,
    onlyCallback = false,
  } = config;

  // Search status
  const abortRef = useAbort();
  const ref = useRef({
    query: undefined as any,
    searching: false,
    datas: [] as any[],
    initial: true,
  });
  const abortSearch = () => {
    abortRef.current!.abortPre();
  };

  // Datas
  let datas = ref.current.datas;
  const initial = ref.current.initial;
  datas = initial ? initialDatas ?? [] : datas;

  // Add new data
  const rebuildRef = useRebuildRef();
  const addData = useCallback((data: R) => {
    ref.current.datas.push(data);
    rebuildRef.current.rebuild();
  }, []);

  const search = useCallback(async (newQuery: Q) => {
    if (isEqual(ref.current.query, newQuery)) return;
    abortSearch(); // 终止之前的搜索 promise 和 callback
    ref.current.initial = false;
    ref.current.query = newQuery;
    ref.current.datas = []; // 清除之前的搜索结果
    ref.current.searching = true; // 开始搜索
    rebuildRef.current.rebuild();
    // 搜索
    const currentSignal = abortRef.current!.signal;
    const datas = await onSearch({
      query: newQuery,
      signal: currentSignal,
      callback: (data) => {
        if (!currentSignal?.aborted) {
          addData(data);
        }
      },
    }).catch(() => undefined);
    if (!currentSignal?.aborted) {
      ref.current.searching = false; // 搜索结束
      if (!onlyCallback && datas) {
        ref.current.datas = datas;
      }
    }
    rebuildRef.current.rebuild();
  }, []);

  const reset = useCallback(() => {
    abortSearch(); // 终止之前的搜索 promise 和 callback
    ref.current.initial = true;
    ref.current.query = undefined;
    ref.current.datas = []; // 清除之前的搜索结果
    ref.current.searching = false; // 搜索结束
    rebuildRef.current.rebuild();
  }, []);

  return {
    initial,
    searching: ref.current.searching,
    search,
    reset,
    datas,
    query: ref.current.query,
    noData: datas.length < 1,
    sort: (compareFn) => {
      ref.current.datas = ref.current.datas.sort(compareFn);
      rebuildRef.current.rebuild();
    },
  };
};

import { useEffect, useRef } from "react";

import { isNotEqual } from "@/utils/diff";

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
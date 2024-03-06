import { useRef } from "react";

export const useRefCallback = <T = any>(fn: any) => {
  const ref = useRef<T>();
  ref.current = fn;
  return ref;
};
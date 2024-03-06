import { useCallback, useRef, useState } from "react";

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
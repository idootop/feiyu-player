import { useRef } from "react";

let id = 0;
export const newID = () => (id++).toString()

export const useID = () => {
  const ref = useRef(newID());
  return ref.current
}
import { useMousePosition } from "./useMousePosition";

export function useShadow() {
  const { offset, ref: shadowRef } = useMousePosition();
  const shadowX = Math.round(offset.x * 0.1);
  const shadowY = Math.round(offset.y * 0.1);
  const shadowBlur = Math.round(Math.sqrt(offset.x ** 2 + offset.y ** 2) * 0.1);
  const shadowColor = "rgba(0, 0, 0, 0.3)";
  const shadow = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor}`;
  return { shadowRef, shadow };
}

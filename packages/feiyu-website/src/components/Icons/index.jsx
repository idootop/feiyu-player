export function getIconProps({ size = "1.5rem" }) {
  return {
    fill: "currentColor",
    width: "256",
    height: "256",
    viewBox: "0 0 256 256",
    style: { width: size, height: size },
  };
}

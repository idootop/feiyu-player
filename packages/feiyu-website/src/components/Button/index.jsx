import "./style.css";

export function Button({ primary = true, url, download, style, children }) {
  return (
    <a
      className={"button " + (primary ? "button-primary" : "button-secondary")}
      href={url}
      style={style}
      download={download}
    >
      {children}
    </a>
  );
}

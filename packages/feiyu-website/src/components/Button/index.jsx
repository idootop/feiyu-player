import "./style.css";

export function Button({ secondary, url, download, style, children }) {
  return (
    <a
      className={
        "button " + (secondary ? "button-secondary" : "button-primary")
      }
      href={url}
      style={style}
      download={download}
      target="_blank"
    >
      {children}
    </a>
  );
}

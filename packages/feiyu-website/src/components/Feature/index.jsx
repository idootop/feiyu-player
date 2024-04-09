import "./style.css";

export function Feature({ title, description, image, url }) {
  return (
    <div className="feature">
      <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{title}</p>
      <p
        style={{
          fontSize: "1.5rem",
          fontWeight: "normal",
          color: "rgba(0,0,0,50%)",
        }}
      >
        {description}
      </p>
      <a href={url} target="_blank">
        <img
          src={image}
          style={{
            width: "100%",
            marginTop: "2rem",
          }}
        />
      </a>
    </div>
  );
}

export function Feature({ title, description, image }) {
  return (
    <div style={{ margin: "8rem 0" }}>
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
      <img
        src={image}
        style={{
          width: "100%",
          marginTop: "2rem",
        }}
      />
    </div>
  );
}

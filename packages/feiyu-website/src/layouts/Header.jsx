import { IconGithub } from "../components/Icons/IconGithub";

export function Header() {
  return (
    <div className="row" style={{ justifyContent: "space-between" }}>
      <a className="row" href="/">
        <img
          src="/logo.svg"
          style={{
            height: "28px",
            marginRight: "10px",
          }}
        />
        <p
          style={{
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          飞鱼
        </p>
      </a>
      <a
        className="row"
        href="https://github.com/idootop/feiyu-player"
        target="_blank"
      >
        <IconGithub />
      </a>
    </div>
  );
}

import { IconGithub } from "../components/Icons/IconGithub";

export function Header() {
  return (
    <div className="row" style={{ justifyContent: "space-between" }}>
      <a className="row" href="/">
        <img
          src="/logo.svg"
          style={{
            height: "2rem",
            marginRight: "1rem",
          }}
        />
        <p
          style={{
            fontSize: "1.8rem",
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
        <IconGithub size="2rem" />
      </a>
    </div>
  );
}

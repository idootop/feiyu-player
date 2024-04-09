import { Download } from "../components/Button/Download";
import { Button } from "../components/Button";

export function Intro() {
  return (
    <>
      <div style={{ margin: "4rem 0" }}>
        <Slogan />
        <DownloadArea />
      </div>
      <div className="relative">
        <img
          src="/screenshots/home.webp"
          style={{
            width: "100%",
          }}
        />
        <p
          style={{
            background: "#fff",
            filter: "blur(1rem)",
            width: "calc(100vw - 2rem)",
            height: "30%",
            position: "absolute",
            bottom: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </div>
    </>
  );
}

function Slogan() {
  return (
    <>
      <p style={{ fontSize: "3rem", fontWeight: "bold" }}>追光影，看世界</p>
      <p
        style={{
          margin: "0 0 2rem",
          fontSize: "1.5rem",
          fontWeight: "normal",
          color: "rgba(0,0,0,50%)",
        }}
      >
        The Light and Shadow, A Brighter World to See
      </p>
    </>
  );
}

function DownloadArea() {
  return (
    <div className="row" style={{ gap: "2rem", justifyContent: "center" }}>
      <Download />
      <Button url="https://demo.feiyu-player.xbox.work/#/home/hot" secondary>
        网页版
      </Button>
    </div>
  );
}

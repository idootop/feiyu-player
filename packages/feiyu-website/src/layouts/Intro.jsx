import { Download } from "../components/Button/Download";
import { Button } from "../components/Button";
import { useMousePosition } from "../hooks/useMousePosition";

export function Intro() {
  return (
    <>
      <div style={{ margin: "6rem 0 4rem 0" }}>
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
  const { offset, elementRef } = useMousePosition();

  const shadowX = Math.round(offset.x * 0.1);
  const shadowY = Math.round(offset.y * 0.1);
  const shadowBlur = Math.round(Math.sqrt(offset.x ** 2 + offset.y ** 2) * 0.1);
  const shadowColor = "rgba(0, 0, 0, 0.3)";
  const shadow = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor}`;

  return (
    <>
      <p style={{ fontSize: "3rem", fontWeight: "bold" }}>
        追
        <span
          ref={elementRef}
          style={{
            textShadow: shadow,
          }}
        >
          光影
        </span>
        ，看世界
      </p>
      <p
        style={{
          margin: "0.5rem 0 2rem 0",
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

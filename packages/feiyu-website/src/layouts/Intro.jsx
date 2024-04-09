import { Download } from "../components/Button/Download";
import { Button } from "../components/Button";
import { useHover } from "../hooks/useHover";
import { useShadow } from "../hooks/useShadow";

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
  const { hoverRef, isHovered } = useHover();
  const { shadow, shadowRef } = useShadow();

  return (
    <>
      <p style={{ fontSize: "3rem", fontWeight: "bold", userSelect: "none" }}>
        追
        <span
          ref={shadowRef}
          style={{
            textShadow: shadow,
          }}
        >
          光影
        </span>
        ，
        <span
          ref={hoverRef}
          style={{
            display: "inline-block",
            width: "9rem",
            textAlign: "center",
          }}
        >
          {!isHovered ? "看世界" : "👀 🌍"}
        </span>
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

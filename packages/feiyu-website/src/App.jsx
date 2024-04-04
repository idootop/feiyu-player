import "./App.css";
import { Download } from "./components/Download";
import { Feature } from "./components/Feature";
import { Button } from "./components/Button";
import { IconGithub } from "./components/Icons/IconGithub";

function Header() {
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
      <Button
        url="https://demo.feiyu-player.xbox.work/#/home/hot"
        secondary
        style={{
          width: "128px",
          height: "56px",
        }}
      >
        网页版
      </Button>
    </div>
  );
}

function Banner() {
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
            filter: "blur(16px)",
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

function App() {
  return (
    <>
      <Header />
      <Banner />
      <Feature
        title="海量资源，随心搜索"
        description="支持多种视频源，聚合搜索，看你想看。"
        image="/screenshots/search.webp"
      />
      <Feature
        title="自由订阅，随心分享"
        description="一键订阅视频源，从此找资源不求人"
        image="/screenshots/subscribe.webp"
      />
      <Feature
        title="颜值即正义"
        description="极简高颜值，给你极致观影体验"
        image="/screenshots/play.webp"
      />
      <Feature
        title="体积小巧，快如闪电"
        description="极至精简，安装包不足 10 MB"
        image="/screenshots/play.webp"
      />
      <Feature
        title="随时随地，想看就看"
        description="网页、Windows、macOS、Linux 全平台支持"
        image="/screenshots/play.webp"
      />
    </>
  );
}

export default App;

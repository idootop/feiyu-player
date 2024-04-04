import { Feature } from "./components/Feature";
import { Footer } from "./layouts/Footer";
import { Header } from "./layouts/Header";
import { Intro } from "./layouts/Intro";

function App() {
  return (
    <>
      <Header />
      <Intro />
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
      <Footer />
    </>
  );
}

export default App;

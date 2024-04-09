import { Feature } from "../components/Feature";

export function Features() {
  return (
    <div
      style={{
        marginTop: "4rem",
      }}
    >
      <Feature
        title="🐳 海量资源，随心搜索"
        description="支持多种视频源，聚合搜索，看你想看"
        image="/screenshots/search.webp"
      />
      <Feature
        title="🦀 一键订阅，自由分享"
        description="一键订阅视频源，从此找资源不求人"
        image="/screenshots/subscribe.webp"
      />
      <Feature
        title="🦋 界面极简，超高颜值"
        description="颜值即正义，给你极致观影体验"
        image="/screenshots/play.webp"
      />
      <Feature
        title="🦄 体积小巧，快如闪电"
        description="极至精简，安装包不足 10 MB"
        image="/screenshots/size.webp"
        url="https://github.com/idootop/feiyu-player/releases/tag/latest"
      />
      <Feature
        title="🐟 随时随地，想看就看"
        description="网页、Windows、macOS、Linux 全平台支持"
        image="/screenshots/platform.webp"
        url="https://github.com/idootop/feiyu-player/releases/tag/latest"
      />
    </div>
  );
}

import './style.css';
import 'xgplayer/dist/index.min.css';

import { forwardRef, useEffect, useRef } from 'react';
import XgPlayer, { Events } from 'xgplayer/es/player';
import HlsPlugin from 'xgplayer-hls';

import { Box } from '@/components/Box';
import { store } from '@/services/store/useStore';
import { lastOf } from '@/utils/base';
import { addClass, removeClass } from '@/utils/dom';

import { isPlayPage } from '.';
import { XgPreset } from './xg-preset';

const kPlayerKey = 'kPlayerKey';

interface PlayerConfig {
  current: string;
  playList: string[];
  onPlayNext: (next: string, idx: number) => void;
  pause?: boolean;
}

// todo 记忆并恢复上次播放历史进度
export const Player = forwardRef(
  (props: PlayerConfig & { current?: string }, ref: any) => {
    const player = useRef<XgPlayer>();

    // 离开当前页面时，暂停播放。重新激活时，恢复播放。
    useEffect(() => {
      if (props.pause && player.current?.play) {
        player.current?.pause();
      }
      if (!props.pause && player.current?.pause) {
        player.current?.play();
      }
    }, [props.pause]);

    // 播放地址变更
    useEffect(() => {
      if (!isPlayPage()) return;
      if (!props.current && player.current) {
        // 没有选中的视频
        player.current.src = '';
        return;
      }
      store.set(kPlayerKey, props);
      setTimeout(() => {
        const { current, playList } = store.get<PlayerConfig>(kPlayerKey) ?? {};
        if (!player.current) {
          // 初始化视频播放器
          player.current = new XgPlayer({
            id: 'player',
            url: current,
            pip: true,
            autoplay: true,
            crossOrigin: true,
            videoInit: true,
            fluid: true,
            lang: 'zh-cn',
            plugins: [HlsPlugin],
            presets: [XgPreset],
            playNext: { urlList: playList },
          });
          player.current.on(Events.PLAYNEXT, () => {
            const { current, playList, onPlayNext } =
              store.get<PlayerConfig>(kPlayerKey)!;
            const hasNext = lastOf(playList) !== current;
            if (hasNext) {
              // 选中并播放下一集
              const currentIdx = playList.indexOf(current);
              const nextVideo = playList[currentIdx + 1];
              playerSwitchURL(player.current, nextVideo);
              onPlayNext?.(nextVideo, currentIdx + 1);
            }
          });
        }
        // 播放当前视频
        playerSwitchURL(player.current, current);
        // 是否有下一集
        const hasNext = lastOf(playList) !== current;
        // 控制下一集按钮是否显示
        const playNextDoms = [
          document.getElementsByClassName(
            'xgplayer-playnext',
          )[0] as HTMLElement,
          document.getElementsByClassName('playnext-button')[0] as HTMLElement,
        ];
        playNextDoms.forEach((playNextDom) => {
          if (hasNext) {
            removeClass(playNextDom, 'no-next');
          } else {
            addClass(playNextDom, 'no-next');
          }
        });
      }, 100);
    }, [props.current]);

    return <Box ref={ref} id="player" width="100%" />;
  },
);

const playerSwitchURL = (player, url) => {
  if (!player || !url) {
    return;
  }
  player.pause();
  player.currentTime = 0;
  if (player.switchURL) {
    player.switchURL(url);
  } else {
    player.src = url;
  }
  player.config.url = url;
  player.play();
};

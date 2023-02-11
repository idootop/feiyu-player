import './style.css';

import { forwardRef, useEffect, useRef } from 'react';
import HlsJsPlayer from 'xgplayer-hls.js';

import { Box } from '@/components/Box';
import { store } from '@/services/store/useStore';
import { lastOf } from '@/utils/base';
import { addClass, createDom, hasClass, removeClass } from '@/utils/dom';

import { isPlayPage } from '.';

const kPlayerKey = 'kPlayerKey';

interface PlayerConfig {
  current: string;
  playList: string[];
  onPlayNext: (next: string, idx: number) => void;
  pause?: boolean;
}

/**
 * 安装自定义插件
 */
let _playerInited = false;
const initPlayer = () => {
  if (!_playerInited) {
    for (const [key, func] of Object.entries(_playerPlugins)) {
      HlsJsPlayer.plugins[key] = undefined;
      HlsJsPlayer.install(key, func);
    }
    _playerInited = true;
  }
};

// todo 记忆并恢复上次播放历史进度
export const Player = forwardRef(
  (props: PlayerConfig & { current?: string }, ref: any) => {
    const player = useRef<HlsJsPlayer>();

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
      // 注入依赖
      store.set(kPlayerKey, props);
      setTimeout(() => {
        const { current, playList } = store.get<PlayerConfig>(kPlayerKey) ?? {};
        if (!player.current) {
          // 初始化视频播放器
          initPlayer();
          player.current = new HlsJsPlayer({
            id: 'player',
            url: current,
            fitVideoSize: 'auto',
            crossOrigin: true,
            videoInit: true,
            fluid: true,
            lang: 'zh-cn',
            autoplay: true,
            errorTips: '播放失败 >_<',
            playNext: {
              urlList: ['', ''],
            },
          });
          player.current.on('playNext', () => {
            const { current, playList, onPlayNext } =
              store.get<PlayerConfig>(kPlayerKey)!;
            const hasNext = lastOf(playList) !== current;
            if (hasNext) {
              // 选中并播放下一集
              const currentIdx = playList.indexOf(current);
              player.current.video.autoplay = true;
              player.current.src = playList[currentIdx + 1];
              onPlayNext?.(playList[currentIdx + 1], currentIdx + 1);
            }
          });
        }
        // 播放当前视频
        player.current.video.autoplay = true;
        player.current.src = current;
        // 是否有下一集
        const hasNext = lastOf(playList) !== current;
        // 控制下一集按钮是否显示
        const playNextDoms = [
          document.getElementsByClassName(
            'xgplayer-playnext',
          )[0] as HTMLElement,
          document.getElementsByClassName('playnext')[0] as HTMLElement,
          document.getElementsByClassName('playnext')[1] as HTMLElement,
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

const _playNextIcon = `
<svg class="xgplayer-playnext-svg" width="48px" height="48px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="none" stroke-width="4" stroke-linejoin="round"></path>
  <path d="M21 33L30 24L21 15" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
`;
const _replayIcon = `
<svg class="xgplayer-replay-svg" width="48px" height="48px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 24V18L26 21L31 24L26 27L21 30V24Z" fill="none" stroke-width="4" stroke-linejoin="round"></path>
  <path d="M11.2721 36.7279C14.5294 39.9853 19.0294 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C19.0294 6 14.5294 8.01472 11.2721 11.2721C9.6141 12.9301 6 17 6 17" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
  <path d="M6 9V17H14" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
`;
const _playerPlugins = {
  // 播放暂停
  mobile(player: any) {
    const root = player.root;
    let _clk = 0;
    let _click_;
    const _clickedTime = {
      first: 0,
      second: 0,
    };
    player.onElementTouchend = (e: any) => {
      if (!player.config.closeVideoPreventDefault) {
        e.preventDefault();
      }
      if (!player.config.closeVideoStopPropagation) {
        e.stopPropagation();
      }
      if (hasClass(root, 'xgplayer-inactive')) {
        player.emit('focus');
        return;
      } else {
        player.emit('blur');
      }
      if (!player.config.closeVideoTouch && !player.isTouchMove) {
        const onTouch = () => {
          _click_ = setTimeout(function () {
            if (hasClass(player.root, 'xgplayer-nostart')) {
              return false;
            } else if (!player.ended) {
              if (player.paused) {
                const playPromise = player.play();
                if (playPromise !== undefined && playPromise) {
                  playPromise.catch(() => undefined);
                }
              } else {
                player.pause();
              }
            }
            _clk = 0;
          }, 200);
        };
        if (!player.config.closeVideoClick) {
          _clk++;
          if (_click_) {
            clearTimeout(_click_);
          }
          if (_clk === 1) {
            if (player.config.enableVideoDbltouch) {
              _clickedTime.first = Date.now();
            } else {
              onTouch();
            }
          } else if (_clk === 2) {
            if (player.config.enableVideoDbltouch) {
              _clickedTime.second = Date.now();
              if (Math.abs(_clickedTime.first - _clickedTime.second) < 400) {
                // 双击
                onTouch();
              } else {
                _clickedTime.first = Date.now();
                _clk = 1;
              }
            } else {
              _clk = 0;
            }
          } else {
            _clk = 0;
          }
        }
      }
    };

    function onReady() {
      player.video.addEventListener('touchend', (e: any) => {
        player.onElementTouchend(e, player.video);
      });
      player.video.addEventListener('touchstart', () => {
        player.isTouchMove = false;
      });
      player.video.addEventListener('touchmove', () => {
        player.isTouchMove = true;
      });
      if (player.config.autoplay) {
        player.start();
      }
    }
    player.once('ready', onReady);

    function onDestroy() {
      player.off('ready', onReady);
      player.off('destroy', onDestroy);
    }
    player.once('destroy', onDestroy);
  },
  // 加载中
  s_enter: (player: any) => {
    const root = player.root;
    const enter = createDom({
      className: 'center-spinner',
      innerHTML: `<div class="arco-spin"><span class="arco-spin-icon"><svg fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" aria-hidden="true" focusable="false" style="font-size: 40px;" class="arco-icon arco-icon-loading"><path d="M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6"></path></svg></span></div>`,
    });
    root.appendChild(enter);
  },
  // 播放下一集
  playNext: (player: any) => {
    function onPlayNextBtnClick() {
      player.emit('playNext');
    }

    function onDestroy() {
      player.off('playNextBtnClick', onPlayNextBtnClick);
      player.off('destroy', onDestroy);
    }
    player.on('playNextBtnClick', onPlayNextBtnClick);
    player.once('destroy', onDestroy);
  },
  s_reply(player: any) {
    const root = player.root;
    const btn = createDom({
      tagName: 'xg-replay',
      innerHTML: `
      <div style="display:flex;flex-direction:row;align-items:center;">
        <div class="play-button">${_replayIcon}<xg-replay-txt class="xgplayer-replay-txt">重播</xg-replay-txt></div>
        <div class="playnext" style="width:20px"></div>
        <div class="playnext play-button">${_playNextIcon}<xg-replay-txt class="xgplayer-replay-txt">下一集</xg-replay-txt></div>
      </div>`,
      className: 'xgplayer-replay',
    });
    player.once('ready', () => {
      const oldEl = document.getElementsByClassName(
        'xgplayer-replay',
      )[0] as HTMLElement;
      if (oldEl) {
        oldEl.remove();
      }
      root.appendChild(btn);
    });

    function onEnded() {
      const path = btn.querySelector('path');
      if (path) {
        const transform = window
          .getComputedStyle(path)
          .getPropertyValue('transform');
        if (typeof transform === 'string' && transform.indexOf('none') > -1) {
          return;
        } else {
          path.setAttribute('transform', transform);
        }
      }
    }
    player.on('ended', onEnded);

    function onBtnClick(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    btn.addEventListener('click', onBtnClick);

    const replay = btn.querySelector('.xgplayer-replay-svg');
    const playNext = btn.querySelector('.xgplayer-playnext-svg');

    ['click', 'touchend'].forEach((item) => {
      replay?.addEventListener(item, function (e) {
        e.preventDefault();
        e.stopPropagation();
        player.userGestureTrigEvent('replayBtnClick');
      });
      playNext?.addEventListener(item, function (e) {
        e.preventDefault();
        e.stopPropagation();
        player.userGestureTrigEvent('playNextBtnClick');
      });
    });

    function destroyFunc() {
      player.off('ended', onEnded);
      player.off('destroy', destroyFunc);
    }
    player.once('destroy', destroyFunc);
  },
};

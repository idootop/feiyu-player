import { FeiyuDesktop } from 'feiyu-desktop';
import { Events, Plugin, Util } from 'xgplayer';
import XgFullScreen from 'xgplayer/es/plugins/fullscreen';
import XgPlayNext from 'xgplayer/es/plugins/playNext';
import XgReplay from 'xgplayer/es/plugins/replay';

export class Loading extends Plugin {
  static get pluginName() {
    return 'loading';
  }

  render() {
    const root = Util.createDom('xg-loading', '', {}, 'xgplayer-loading');
    root.innerHTML = `
    <div class="arco-spin" style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;">
        <span class="arco-spin-icon" style="width:48px;height:48px;color:#2d5cf6">
            <svg fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" aria-hidden="true" focusable="false" style="font-size: 40px;" class="arco-icon arco-icon-loading"><path d="M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6"></path></svg>
        </span>
    </div>`;
    return root;
  }
}

export class Replay extends XgReplay {
  __handlePlayNext: any;
  static get pluginName() {
    return 'replay';
  }

  afterCreate() {
    this.__handleReplay = this.hook(
      'replayClick',
      () => {
        this.player.replay();
      },
      {
        pre: (e: any) => {
          e.preventDefault();
          e.stopPropagation();
        },
        next: () => undefined,
      },
    );
    this.bind('.replay-button', ['click', 'touchend'], this.__handleReplay);

    this.__handlePlayNext = this.hook(
      'playNextClick',
      () => {
        this.player.emit(Events.PLAYNEXT);
      },
      {
        pre: (e: any) => {
          e.preventDefault();
          e.stopPropagation();
        },
        next: () => undefined,
      },
    );
    this.bind('.playnext-button', ['click', 'touchend'], this.__handlePlayNext);

    this.on(Events.ENDED, () => {
      if (!this.playerConfig.loop) {
        Util.addClass(this.player.root as any, 'replay');
      }
      if (this.config.disable) {
        return;
      }
      this.show();
      const path = this.root.querySelector('path');
      if (path) {
        const transform = window
          .getComputedStyle(path)
          .getPropertyValue('transform');
        if (typeof transform === 'string' && transform.indexOf('none') > -1) {
          return null;
        } else {
          path.setAttribute('transform', transform);
        }
      }
    });

    this.on(Events.PLAY, () => {
      this.hide();
    });
  }

  destroy() {
    this.unbind('.replay-button', ['click', 'touchend'], this.__handleReplay);
    this.unbind(
      '.playnext-button',
      ['click', 'touchend'],
      this.__handlePlayNext,
    );
  }

  render() {
    const _playNextIcon = `
<svg class="xgplayer-playnext-svg" width="48px" height="48px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"></path>
  <path d="M21 33L30 24L21 15" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
`;
    const _replayIcon = `
<svg class="xgplayer-replay-svg" width="48px" height="48px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 24V18L26 21L31 24L26 27L21 30V24Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"></path>
  <path d="M11.2721 36.7279C14.5294 39.9853 19.0294 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C19.0294 6 14.5294 8.01472 11.2721 11.2721C9.6141 12.9301 6 17 6 17" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
  <path d="M6 9V17H14" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
`;
    return `
    <xg-replay class="xgplayer-replay">
      <div style="display:flex;flex-direction:row;align-items:center;">
        <div class="replay-button play-button xgplayer-icon">${_replayIcon}<xg-replay-txt class="xgplayer-replay-txt">重播</xg-replay-txt></div>
        <div style="width:20px"></div>
        <div class="playnext-button play-button xgplayer-icon">${_playNextIcon}<xg-replay-txt class="xgplayer-replay-txt">下一集</xg-replay-txt></div>
      </div>    
    </xg-replay>
    `;
  }
}

export class PlayNext extends XgPlayNext {
  static get pluginName() {
    return 'playNext';
  }

  playNext = (e) => {
    const { player } = this;
    e.preventDefault();
    e.stopPropagation();
    player.emit(Events.PLAYNEXT);
  };
}

export class FullScreen extends XgFullScreen {
  static get pluginName() {
    return 'fullscreen';
  }

  afterCreate() {
    super.afterCreate();
    this.on(Events.USER_ACTION, ({ action }) => {
      if (action === 'switch_fullscreen') {
        this.toggleDesktopFullScreen();
      }
    });
    this.on(Events.SHORTCUT, ({ key }) => {
      if (key === 'esc') {
        this.toggleDesktopFullScreen(false);
      }
    });
  }

  toggleFullScreen = (e) => {
    if (FeiyuDesktop.isDesktop) {
      setTimeout(async () => {
        const oldFullScreen = await FeiyuDesktop.window?.isFullscreen();
        try {
          super.toggleFullScreen(e);
        } catch {
          //
        }
        const newFullScreen = await FeiyuDesktop.window?.isFullscreen();
        if (newFullScreen === oldFullScreen) {
          await this.toggleDesktopFullScreen(!oldFullScreen);
        }
      });
    } else {
      super.toggleFullScreen(e);
    }
  };

  async toggleDesktopFullScreen(fullscreen?: boolean) {
    if (!FeiyuDesktop.isDesktop) {
      return;
    }
    if (fullscreen == null) {
      fullscreen = !(await FeiyuDesktop.window?.isFullscreen());
    }
    const player = document.getElementById('player');
    const header = document.getElementsByClassName('app-header')[0];
    const drawer = document.getElementsByClassName('arco-layout-sider')[0];

    await FeiyuDesktop.window?.setFullscreen(fullscreen!);

    if (fullscreen) {
      player?.classList.add('player-fullscreen');
      header?.classList.add('hide-fullscreen');
      drawer?.classList.add('hide-fullscreen');
    } else {
      player?.classList.remove('player-fullscreen');
      header?.classList.remove('hide-fullscreen');
      drawer?.classList.remove('hide-fullscreen');
    }
  }
}

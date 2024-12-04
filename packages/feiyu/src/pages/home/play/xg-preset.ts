import { I18N } from 'xgplayer';
import ZH from 'xgplayer/es/lang/zh-cn';
import Thumbnail from 'xgplayer/es/plugins/common/thumbnail';
import Enter from 'xgplayer/es/plugins/enter';
import Error from 'xgplayer/es/plugins/error';
import Fullscreen from 'xgplayer/es/plugins/fullscreen';
import GapJump from 'xgplayer/es/plugins/gapJump';
import Keyboard from 'xgplayer/es/plugins/keyboard';
import Mobile from 'xgplayer/es/plugins/mobile';
import PC from 'xgplayer/es/plugins/pc';
import PIPIcon from 'xgplayer/es/plugins/pip';
import PlayIcon from 'xgplayer/es/plugins/play';
import PlaybackRate from 'xgplayer/es/plugins/playbackRate';
import Poster from 'xgplayer/es/plugins/poster';
import Progress from 'xgplayer/es/plugins/progress';
import MiniProgress from 'xgplayer/es/plugins/progress/miniProgress';
import ProgressPreview from 'xgplayer/es/plugins/progressPreview';
import Prompt from 'xgplayer/es/plugins/prompt';
import Start from 'xgplayer/es/plugins/start';
import TimeIcon from 'xgplayer/es/plugins/time';
import TimeSegments from 'xgplayer/es/plugins/time/timesegments';
import Volume from 'xgplayer/es/plugins/volume';
import WaitingTimeoutJump from 'xgplayer/es/plugins/waitingTimeoutJump';
import sniffer from 'xgplayer/es/utils/sniffer';

import { Loading, PlayNext, Replay } from './xg-plugins';

// @ts-ignore
ZH.TEXT.FULLSCREEN_TIPS = '全屏';

I18N.use(ZH);

export class XgPreset {
  plugins: any[];
  ignores: any[];
  i18n: any[];

  constructor(options, playerConfig) {
    const simulateMode =
      playerConfig && playerConfig.isMobileSimulateMode === 'mobile';

    const vodPlugins = [
      TimeSegments,
      Progress,
      MiniProgress,
      ProgressPreview,
      TimeIcon,
    ];

    const contolsIcons = [
      ...vodPlugins,
      PlayIcon,
      Fullscreen,
      PlayNext,
      Volume,
      PIPIcon,
      PlaybackRate,
    ];

    const layers = [
      Replay,
      Poster,
      Start,
      Loading,
      Enter,
      Error,
      Prompt,
      Thumbnail,
    ];

    this.plugins = [...contolsIcons, ...layers, GapJump, WaitingTimeoutJump];
    const mode = simulateMode ? 'mobile' : sniffer.device;
    switch (mode) {
      case 'pc':
        this.plugins.push(...[Keyboard, PC]);
        break;
      case 'mobile':
        this.plugins.push(...[Mobile]);
        break;
      default:
        this.plugins.push(...[Keyboard, PC]);
    }
    if (sniffer.os.isIpad) {
      this.plugins.push(PC);
    }
    this.ignores = [];
    this.i18n = [];
  }
}

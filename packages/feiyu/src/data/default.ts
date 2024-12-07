import { FeiyuConfig } from './config/types';

export default {
  proxy: 'https://example.vercel.app/api/proxy',
  videoSources: [
    {
      key: '视频源',
      api: 'https://api1.example.com/api.php/provide/vod/at/xml',
    },
  ],
  hotMovies: [
    {
      id: '35588177',
      isNew: false,
      title: '漫长的季节',
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2890906384.jpg',
      rate: '9.4',
    },
    {
      id: '26302614',
      isNew: false,
      title: '请回答1988',
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2272563445.jpg',
      rate: '9.7',
    },
    {
      id: '25848328',
      isNew: false,
      title: '最后生还者 第一季',
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2884221114.jpg',
      rate: '9.1',
    },
    {
      id: '36722428',
      isNew: false,
      title: '思想验证区域：The Community',
      cover:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2903848858.jpg',
      rate: '9.5',
    },
  ],
} as FeiyuConfig;

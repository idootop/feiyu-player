import { Button, Notification } from '@arco-design/web-react';
import { useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';

import { configs } from '@/data/config/manager';
import { usePWA } from '@/hooks/usePWA';
import { cache } from '@/services/cache';
import { useFallbackToIndex } from '@/services/routes/page';
import { useInit } from '@/services/store/useStore';

import { kRoutePages } from '..';

const _initAPP = async () => {
  // 初始化APP配置信息
  configs.init();
  // 注册 service worker（自动更新）
  registerSW({ immediate: true });
  // 清除已过期的本地缓存
  cache.clearExpired();
};

export const useInitAPP = () => {
  // 当没有在其他子页面时，默认转到首页
  useFallbackToIndex(kRoutePages, { parent: '/' });

  // APP 初始化
  useInit(() => {
    _initAPP().catch(() => undefined);
  }, []);

  // APP 升级弹窗
  const { needUpdate, update } = usePWA();
  useEffect(() => {
    if (needUpdate) {
      const id = 'needUpdate';
      Notification.info({
        id,
        showIcon: false,
        title: '✨ 发现新版本',
        content: "是否立即升级？喵呜 ฅ'ω'ฅ",
        position: 'bottomRight',
        duration: 0,
        btn: (
          <span>
            <Button
              type="secondary"
              size="small"
              onClick={() => Notification.remove(id)}
              style={{ margin: '0 12px' }}
            >
              取消
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                update();
                Notification.remove(id);
              }}
            >
              确定
            </Button>
          </span>
        ),
      });
    }
  }, [needUpdate]);
};

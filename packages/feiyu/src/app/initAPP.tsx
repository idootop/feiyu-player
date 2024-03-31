import { Button, Message, Notification } from '@arco-design/web-react';
import { FeiyuDesktop } from 'feiyu-desktop';
import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

import { Box } from '@/components/Box';
import { Dialog } from '@/components/Dialog';
import { Text } from '@/components/Text';
import { appConfig } from '@/data/config';
import { useDesktopUpdater } from '@/hooks/useDesktopUpdater';
import { useInit } from '@/hooks/useInit';
import { usePWA } from '@/hooks/usePWA';
import { useRebuildRef } from '@/hooks/useRebuild';
import { cache } from '@/services/cache';
import { useFallbackToIndex } from '@/services/routes/page';
import { storage } from '@/services/storage/storage';

import { kRoutePages } from '../pages';

const _initAPP = async (rebuildRef: any) => {
  // 初始化桌面环境
  await FeiyuDesktop.init();
  // 初始化APP配置信息
  await appConfig.init();
  // 注册 service worker（自动更新）
  registerSW({ immediate: true });
  // 清除已过期的本地缓存
  cache.clearExpired();
  // 刷新 APP 页面
  rebuildRef.current.rebuild();
};

export const useInitAPP = () => {
  // 当没有在其他子页面时，默认转到首页
  useFallbackToIndex(kRoutePages, { parent: '/' });

  // APP 初始化
  const rebuildRef = useRebuildRef();
  useInit(() => {
    _initAPP(rebuildRef).catch((e) => {
      console.trace('❌ initAPP error', e);
    });
  }, []);

  // APP 升级弹窗
  useUpdateAPP();
};

const useUpdateAPP = () => {
  let { needUpdate, update } = usePWA();
  const { needUpdate: needUpdateDesktop, update: updateDesktop } =
    useDesktopUpdater();
  if (needUpdateDesktop) {
    needUpdate = needUpdateDesktop;
    update = updateDesktop;
  }
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
                if (needUpdateDesktop && FeiyuDesktop.isWindows) {
                  Message.info('开始下载更新，请稍等...');
                }
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

export const useDisclaimer = () => {
  const kDisclaimerAgreed = 'kDisclaimerAgreed';
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(async () => {
      const agreed = storage.get(kDisclaimerAgreed);
      if (!agreed) {
        setShow(true);
      }
    }, 0);
  }, []);
  return (
    <Dialog
      visible={show}
      title="🚨 免责声明"
      ok="同意"
      onOk={() => {
        setShow(false);
        storage.set(kDisclaimerAgreed, true);
      }}
      cancel="退出"
      onCancel={() => {
        if (FeiyuDesktop.isDesktop) {
          FeiyuDesktop.window?.close();
        } else {
          window.location.href = 'about:blank';
        }
      }}
    >
      <Box marginBottom="16px">
        <Text
          maxHeight="400px"
          overflowY="scroll"
          fontSize="14px"
          lineHeight="24px"
          className="hide-scrollbar"
        >
          最新版本: V1.0 生效日期: 2024年3月7日
          <br />
          1.
          本项目(飞鱼)是一个开源的视频播放器软件，仅供个人合法地点播、学习和研究使用，严禁将其用于任何商业、违法或不当用途，否则由此产生的一切后果由用户自行承担。
          <br />
          2.
          本软件仅作为一个通用播放器使用，不针对任何特定内容提供源，用户应自行判断所播放内容的合法性并承担相应责任，开发者对用户播放的任何内容不承担任何责任。
          <br />
          3.
          用户在使用本软件时，必须完全遵守所在地区的法律法规，严禁将本软件用于任何非法用途，如传播违禁信息、侵犯他人知识版权、破坏网络安全等，否则由此产生的一切后果由用户自行承担。
          <br />
          4.
          用户使用本软件所产生的任何风险或损失(包括但不限于:系统故障、隐私泄露等)，开发者概不负责。用户应明确认知上述风险并自行防范。
          <br />
          5.
          未尽事宜，均依照用户所在地区相关法律法规的规定执行。如本声明与当地法律法规存在冲突，应以法律法规为准。
          <br />
          6.
          用户使用本软件即视为已阅读并同意本声明全部内容。开发者保留随时修订本声明的权利。本声明的最终解释权归本项目开发者所有。
        </Text>
      </Box>
    </Dialog>
  );
};

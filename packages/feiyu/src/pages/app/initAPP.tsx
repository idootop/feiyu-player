import { Button, Notification } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

import { Box } from '@/components/Box';
import { Dialog } from '@/components/Dialog';
import { Text } from '@/components/Text';
import { configs } from '@/data/config/manager';
import { usePWA } from '@/hooks/usePWA';
import { cache } from '@/services/cache';
import { useFallbackToIndex } from '@/services/routes/page';
import { storage } from '@/services/storage/storage';
import { useInit } from '@/services/store/useStore';

import { kRoutePages } from '..';

const _initAPP = async () => {
  // 初始化APP配置信息
  await configs.init();
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
    _initAPP();
  }, []);

  // APP 升级弹窗
  useUpdateAPP();
};

const useUpdateAPP = () => {
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
      title="免责声明"
      ok="同意"
      onOk={() => {
        setShow(false);
        storage.set(kDisclaimerAgreed, true);
      }}
      cancel="离开"
      onCancel={() => {
        window.location.replace('https://feiyu-player.xbox.work');
      }}
    >
      <Box marginBottom="16px">
        <Text
          maxHeight="400px"
          overflowY="scroll"
          fontSize="14px"
          lineHeight="24px"
          className="hide-scollbar"
        >
          本网站仅用于学习交流目的，演示网站上的所有功能仅供用户参考。本网站不承担任何形式的保证和责任，包括但不限于：
          <h4 style={{ margin: '4px 0' }}>服务内容</h4>
          本网站的演示内容仅供用户参考。本网站不编辑、监控、修改和审核视频内容，对于视频内容的准确性、完整性和合法性不做任何保证。因此，对于用户使用本网站所产生的任何损失或后果，本网站概不承担任何责任。
          <h4 style={{ margin: '4px 0' }}>用户行为</h4>
          用户使用本网站的服务和内容是在自己的意愿和责任下进行的，本网站对用户的行为不承担任何法律责任。用户不得将本网站用于任何非法活动。
          <h4 style={{ margin: '4px 0' }}>链接免责声明</h4>
          本网站可能包含指向其他网站的链接，这些链接仅供用户参考。本网站不对链接指向的网站的准确性、完整性和合法性做出保证，也不对链接引发的任何法律纠纷和后果承担责任。
          <h4 style={{ margin: '4px 0' }}>免责声明的更新</h4>
          本网站有权随时更新本免责声明，并且用户应该定期查看本免责声明，以获取最新的信息。
          <h4 style={{ margin: '4px 0' }}>其他</h4>
          本免责声明的解释权归本网站所有。如果您对本免责声明或本网站有任何疑问，请联系我们。
          <br />
          邮箱地址：help@xbox.work
        </Text>
      </Box>
    </Dialog>
  );
};

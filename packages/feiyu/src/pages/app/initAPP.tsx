import { Button, Notification } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

import { Box } from '@/components/Box';
import { Dialog } from '@/components/Dialog';
import { Text } from '@/components/Text';
import { appConfig } from '@/data/config';
import { useInit } from '@/hooks/useInit';
import { usePWA } from '@/hooks/usePWA';
import { cache } from '@/services/cache';
import { useFallbackToIndex } from '@/services/routes/page';
import { storage } from '@/services/storage/storage';

import { kRoutePages } from '..';

const _initAPP = async () => {
  // 初始化APP配置信息
  await appConfig.init();
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
      title="🚨 免责声明"
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
          className="hide-scrollbar"
        >
          最新版本: V1.0 生效日期: 2024年3月7日
          <h4 style={{ margin: '4px 0' }}>一、网站性质与目的</h4>
          1.1
          本网站旨在演示影视播放器的技术功能，不存储、传播或提供任何视频内容。
          <br />
          1.2 本网站坚决支持版权保护，反对任何形式的非法分享或传播视频内容。
          <h4 style={{ margin: '4px 0' }}>二、内容免责</h4>
          2.1 本网站所示内容仅供技术演示参考，不构成对任何版权作品的侵犯。
          <br />
          2.2 网站不对内容的准确性、完整性和合法性作任何形式的陈述或保证。
          <h4 style={{ margin: '4px 0' }}>三、用户规范</h4>
          3.1 用户使用本网站即视为已阅读并同意本声明全部内容。
          <br />
          3.2
          用户不得将本网站用于任何违法或侵犯他人权利的目的，产生的一切后果均由用户自行承担。
          <h4 style={{ margin: '4px 0' }}>四、外部链接</h4>
          4.1
          本网站提供的任何外部链接仅为方便用户访问之目的，不构成对其内容的认可或推荐。
          <br />
          4.2 本网站对外部链接的内容及由此产生的任何法律纠纷不承担任何责任。
          <h4 style={{ margin: '4px 0' }}>五、其他规定</h4>
          5.1 本网站有权随时修改本声明，解释权归本网站所有。
          <br />
          5.2 如有任何疑问，请通过 help@xbox.work 与我们联系。
          <br />
          5.3 以上内容如有修改,将不另行通知。请用户定期查阅最新版本。
        </Text>
      </Box>
    </Dialog>
  );
};

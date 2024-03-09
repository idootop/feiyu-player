import { useXConsumer, useXProvider, XSta } from 'xsta';

import { Box } from '@/components/Box';
import { Dialog } from '@/components/Dialog';
import { Text } from '@/components/Text';
import { usePages } from '@/services/routes/page';

const kAPPModals = 'kAPPModals';
interface APPModals {
  showAPPConfig: boolean;
}

export const setAPPModals = (option: Partial<APPModals>) => {
  XSta.set(kAPPModals, {
    ...(XSta.get(kAPPModals) ?? {}),
    ...option,
  });
};

const _initAPPModalStates = {
  showAPPConfig: false,
};
export const useInitAPPModals = () => {
  useXProvider<APPModals>(kAPPModals, _initAPPModalStates);
};

export const showAPPConfigModal = (flag = true) => {
  setAPPModals({
    ..._initAPPModalStates,
    showAPPConfig: flag,
  });
};

export const APPConfigModal = () => {
  const [data] = useXConsumer<APPModals>(kAPPModals);
  const { showAPPConfig } = data ?? {};
  const { jumpToPage } = usePages();
  const closeModal = () => {
    showAPPConfigModal(false);
  };
  return (
    <Dialog
      visible={showAPPConfig}
      title="💡 提示"
      ok="设置"
      onOk={() => {
        closeModal();
        jumpToPage('settings'); // 点击打开设置页面
      }}
      cancel="取消"
      onCancel={closeModal}
    >
      <Box marginBottom="16px">
        <Text
          maxHeight="400px"
          overflowY="scroll"
          fontSize="14px"
          lineHeight="24px"
          className="hide-scrollbar"
        >
          搜索失败，请检查以下事项:
          <br />
          1. 网络连接是否正常
          <br />
          2. 搜索源配置是否正确
          <br />
          3. 是否设置了有效的飞鱼 Proxy
        </Text>
      </Box>
    </Dialog>
  );
};

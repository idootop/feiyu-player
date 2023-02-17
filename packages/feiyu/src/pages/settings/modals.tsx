import { Input, Message, Modal } from '@arco-design/web-react';
import { useEffect, useState } from 'react';

import { Box } from '@/components/Box';
import { Dialog } from '@/components/Dialog';
import { Expand, Row } from '@/components/Flex';
import { Text } from '@/components/Text';
import { configs } from '@/data/config/manager';
import { Subscribe } from '@/data/config/types';
import { store, useConsumer, useProvider } from '@/services/store/useStore';
import { colors } from '@/styles/colors';
import { clipboard } from '@/utils/clipborad';
import { isNotEmpty } from '@/utils/is';

const kSettingModals = 'kSettingModals';
interface SettingModals {
  showAdd: boolean;
  showImport: boolean;
  showExport: boolean;
  showDelete: boolean;
  showDetail: boolean;
  subscribe?: Subscribe;
  url?: string;
}

export const setSettingModals = (option: Partial<SettingModals>) => {
  store.set(kSettingModals, {
    ...(store.get(kSettingModals) ?? {}),
    ...option,
  });
};

const _initSettingModalStates = {
  showAdd: false,
  showImport: false,
  showExport: false,
  showDetail: false,
  showDelete: false,
  subscribe: undefined,
  url: undefined,
};
export const useInitSettingModals = () => {
  useProvider<SettingModals>(kSettingModals, _initSettingModalStates);
};

export const showAddSubscribeModal = (flag = true) => {
  setSettingModals({
    ..._initSettingModalStates,
    showAdd: flag,
  });
};
export const AddSubscribeModal = () => {
  const [data] = useConsumer<SettingModals>(kSettingModals);
  const { showAdd } = data ?? {};
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [waiting, setWaiting] = useState(false);
  const closeModal = () => {
    setName('');
    setLink('');
    setWaiting(false);
    showAddSubscribeModal(false);
  };
  return (
    <Dialog
      visible={showAdd}
      title="添加订阅"
      ok="保存"
      okWaiting={waiting}
      onOk={async () => {
        if (isNotEmpty(name) && isNotEmpty(link)) {
          setWaiting(true);
          const result = await configs.addSubscribe(name, link);
          if (result.includes('成功')) {
            Message.success('添加成功');
            closeModal();
          } else {
            Message.info(result);
          }
          setWaiting(false);
        } else {
          closeModal();
        }
      }}
      onCancel={() => {
        closeModal();
      }}
    >
      <Row width="100%" paddingBottom="16px">
        <Text
          style={{
            fontSize: '14px',
            fontWeight: '400',
            color: colors.text2,
            paddingRight: '10px',
          }}
        >
          添加订阅
        </Text>
        <Expand>
          <Input
            placeholder="请输入..."
            value={name}
            onChange={(s) => {
              setName(s);
            }}
          />
        </Expand>
      </Row>
      <Row width="100%" paddingBottom="16px">
        <Text
          style={{
            fontSize: '14px',
            fontWeight: '400',
            color: colors.text2,
            paddingRight: '10px',
          }}
        >
          订阅地址
        </Text>
        <Expand>
          <Input
            placeholder="请输入..."
            value={link}
            onChange={(s) => {
              setLink(s);
            }}
          />
        </Expand>
      </Row>
    </Dialog>
  );
};

export const showImportSubscribeModal = (flag = true) => {
  setSettingModals({
    ..._initSettingModalStates,
    showImport: flag,
  });
};
export const ImportSubscribeModal = () => {
  const [data] = useConsumer<SettingModals>(kSettingModals);
  const { showImport } = data ?? {};
  const [link, setLink] = useState('');
  const [waiting, setWaiting] = useState(false);
  const closeModal = () => {
    setLink('');
    showImportSubscribeModal(false);
  };
  return (
    <Dialog
      visible={showImport}
      title="导入订阅"
      ok="保存"
      okWaiting={waiting}
      onOk={async () => {
        if (isNotEmpty(link)) {
          setWaiting(true);
          const result = await configs.importSubscribes(link);
          if (result > 0) {
            Message.success(`新增${result}个订阅`);
            closeModal();
          } else {
            Message.info('导入失败');
          }
          setWaiting(false);
        } else {
          closeModal();
        }
      }}
      onCancel={() => {
        closeModal();
      }}
    >
      <Row width="100%" paddingBottom="16px">
        <Text
          style={{
            fontSize: '14px',
            fontWeight: '400',
            color: colors.text2,
            paddingRight: '10px',
          }}
        >
          订阅地址
        </Text>
        <Expand>
          <Input
            placeholder="请输入..."
            value={link}
            onChange={(s) => {
              setLink(s);
            }}
          />
        </Expand>
      </Row>
    </Dialog>
  );
};

export const showExportSubscribeModal = (flag = true) => {
  setSettingModals({ ..._initSettingModalStates, showExport: flag });
};
export const ExportSubscribeModal = () => {
  const [data] = useConsumer<SettingModals>(kSettingModals);
  const { showExport } = data ?? {};
  const [waiting, setWaiting] = useState(false);
  useEffect(() => {
    if (showExport) {
      if (waiting) {
        Message.info('正在导出');
      }
      setTimeout(async () => {
        setWaiting(true);
        Message.info('导出中');
        const result = await configs.exportSubscribes();
        Message.clear();
        if (result) {
          const success = await clipboard.write(result);
          if (success) {
            Message.success('分享链接已复制');
          } else {
            Message.success('导出成功');
            showCopyModal(result);
          }
        } else {
          Message.error('导出失败，请先配置 NFT.Storage');
        }
        setWaiting(false);
        showExportSubscribeModal(false);
      });
    }
  }, [showExport]);
  return <Box />;
};

export const showSubscribeDetailModal = (
  subscribe?: Subscribe,
  flag = true,
) => {
  setSettingModals({ ..._initSettingModalStates, showDetail: flag, subscribe });
};
export const SubscribeDetailModal = () => {
  const [data] = useConsumer<SettingModals>(kSettingModals);
  const { showDetail } = data ?? {};
  useEffect(() => {
    if (showDetail) {
      // todo 清空上一次的输入
    }
  }, [showDetail]);
  return (
    <Modal
      title="请手动复制"
      visible={showDetail}
      onCancel={() => {
        // todo close
      }}
      footer={null}
      style={{
        width: 'auto',
        maxWidth: '400px',
        margin: '20px',
      }}
    >
      <Text style={{ padding: '20px', color: '#3d7ff6' }}>测试</Text>
    </Modal>
  );
};

export const showDeleteSubscribeModal = (
  subscribe?: Subscribe,
  flag = true,
) => {
  setSettingModals({ showDelete: flag, subscribe });
};
export const DeleteSubscribeModal = () => {
  const [data] = useConsumer<SettingModals>(kSettingModals);
  const { showDelete, subscribe } = data ?? {};
  return (
    <Dialog
      title="删除订阅"
      visible={showDelete}
      ok="删除"
      onCancel={() => {
        showDeleteSubscribeModal(undefined, false);
      }}
      onOk={async () => {
        const success = await configs.remove(subscribe!.key);
        if (success) {
          Message.success('删除成功');
          showDeleteSubscribeModal(undefined, false);
        } else {
          Message.error('删除失败');
        }
      }}
    >
      <Text
        style={{
          fontSize: '14px',
          fontWeight: '400',
          color: colors.text2,
          paddingBottom: '16px',
        }}
      >
        确认删除「{subscribe?.key}」？
      </Text>
    </Dialog>
  );
};

export const showCopyModal = (url: string) => {
  setSettingModals({ url });
};
export const CopyModal = () => {
  const [data] = useConsumer<SettingModals>(kSettingModals);
  const { url } = data ?? {};
  return (
    <Modal
      title="请手动复制链接"
      visible={isNotEmpty(url)}
      onCancel={() => {
        showCopyModal('');
      }}
      footer={null}
      style={{
        width: 'auto',
        maxWidth: '400px',
        margin: '20px',
      }}
    >
      <Text style={{ padding: '20px', color: '#3d7ff6' }}>{url}</Text>
    </Modal>
  );
};

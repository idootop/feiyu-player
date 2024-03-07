import { Input, Link, Message, Modal } from '@arco-design/web-react';
import TextArea from '@arco-design/web-react/es/Input/textarea';
import { useEffect, useState } from 'react';
import { useXConsumer, useXProvider, XSta } from 'xsta';

import { Box } from '@/components/Box';
import { Dialog } from '@/components/Dialog';
import { Expand, Row } from '@/components/Flex';
import { Text } from '@/components/Text';
import { APPConfig, appConfig, isValidSubscribe } from '@/data/config';
import { Subscribe } from '@/data/config/types';
import { colors } from '@/styles/colors';
import { jsonDecode, jsonEncode } from '@/utils/base';
import { isEmpty, isNotEmpty } from '@/utils/is';

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
  XSta.set(kSettingModals, {
    ...(XSta.get(kSettingModals) ?? {}),
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
  useXProvider<SettingModals>(kSettingModals, _initSettingModalStates);
};

export const showAddSubscribeModal = (flag = true) => {
  setSettingModals({
    ..._initSettingModalStates,
    showAdd: flag,
  });
};
export const AddSubscribeModal = () => {
  const [data] = useXConsumer<SettingModals>(kSettingModals);
  const { showAdd } = data ?? {};
  const [config, setConfig] = useState('');
  const [waiting, setWaiting] = useState(false);
  const closeModal = () => {
    setConfig('');
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
        if (isNotEmpty(config)) {
          setWaiting(true);
          const successCount = await appConfig.importSubscribes(config);
          if (successCount > 0) {
            Message.success('添加成功');
            closeModal();
          } else {
            Message.info('添加失败');
          }
          setWaiting(false);
        } else {
          Message.info('请输入订阅链接或配置参数');
        }
      }}
      onCancel={() => {
        closeModal();
      }}
    >
      <TextArea
        placeholder="请输入订阅链接或配置参数..."
        autoSize={{ minRows: 6, maxRows: 6 }}
        style={{ width: '100%', marginBottom: '16px' }}
        value={config}
        onChange={(s) => {
          setConfig(s);
        }}
      />
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
  const [data] = useXConsumer<SettingModals>(kSettingModals);
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
          const result = await appConfig.importSubscribes(link);
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
          订阅链接
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
  const [data] = useXConsumer<SettingModals>(kSettingModals);
  const { showExport } = data ?? {};
  const [waiting, setWaiting] = useState(false);
  useEffect(() => {
    setTimeout(async () => {
      if (showExport) {
        if (waiting) {
          Message.info('正在导出');
        }
        setWaiting(true);
        Message.info('导出中');
        const result = await appConfig.exportSubscribes();
        Message.clear();
        if (result) {
          Message.success('导出成功');
          showCopyModal(result);
        } else {
          Message.error('导出失败，请先配置 NFT.Storage');
          showExportSubscribeModal(false);
        }
        setWaiting(false);
      }
    });
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
  const [data] = useXConsumer<SettingModals>(kSettingModals);
  const { showDetail, subscribe } = data ?? {};
  const isEdit = isEmpty(subscribe?.upstream);
  const isDelete = subscribe?.key === APPConfig.defaultKey;
  const [input, setInput] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [leadWaiting, setLeadWaiting] = useState(false);
  const [deleteWaiting, setDeleteWaiting] = useState(false);
  const closeModal = () => {
    showSubscribeDetailModal(undefined, false);
  };
  useEffect(() => {
    const config = jsonEncode(subscribe, true) ?? '';
    if (input !== config) {
      // 设置当前的配置文本
      setInput(config);
      setWaiting(false);
      setLeadWaiting(false);
      setDeleteWaiting(false);
    }
  }, [subscribe]);
  return !subscribe ? (
    <Box />
  ) : (
    <Dialog
      visible={showDetail}
      title={subscribe!.key}
      lead="导出"
      ok={isEdit ? '保存' : '更新'}
      cancel={isDelete ? '' : '删除'}
      okWaiting={waiting}
      cancelWaiting={deleteWaiting}
      leadWaiting={leadWaiting}
      onLead={async () => {
        setLeadWaiting(true);
        Message.info('导出中');
        const result = await appConfig.exportSubscribe(subscribe.key);
        Message.clear();
        if (result) {
          Message.success('导出成功');
          showCopyModal(result);
        } else {
          Message.error('导出失败，请先配置 NFT.Storage');
        }
        setLeadWaiting(false);
      }}
      onOk={async () => {
        setWaiting(true);
        if (isEdit) {
          // 保存
          const newSubscribe = jsonDecode(input);
          if (!isValidSubscribe(newSubscribe)) {
            Message.error('无效的配置');
            setWaiting(false);
            return;
          }
          // 默认订阅不能重命名
          if (
            subscribe.key === APPConfig.defaultKey &&
            newSubscribe.key !== APPConfig.defaultKey
          ) {
            Message.info('默认订阅不支持重命名');
            setWaiting(false);
            return;
          }
          // 不能重名
          if (
            newSubscribe.key !== subscribe.key &&
            appConfig.subscribes[newSubscribe.key]
          ) {
            Message.info('名称已存在，请重命名');
            setWaiting(false);
            return;
          }
          const success = await appConfig.editSubscribe(
            subscribe,
            newSubscribe,
          );
          if (success) {
            Message.success('保存成功');
            closeModal();
          } else {
            Message.error('保存失败');
          }
        } else {
          // 更新
          const success = await appConfig.refreshSubscribe(subscribe!.key);
          if (success) {
            Message.success('更新成功');
          } else {
            Message.error('更新失败');
          }
        }
        setWaiting(false);
      }}
      onCancel={async () => {
        setDeleteWaiting(true);
        const success = await appConfig.remove(subscribe!.key);
        if (success) {
          Message.success('删除成功');
          closeModal();
        } else {
          Message.error('删除失败');
        }
        setDeleteWaiting(false);
      }}
      onClose={() => {
        closeModal();
      }}
    >
      {isEdit ? (
        <Box />
      ) : (
        <Row width="100%" paddingBottom="16px">
          <Text
            style={{
              fontSize: '14px',
              fontWeight: '400',
              color: colors.text2,
              paddingRight: '10px',
            }}
          >
            订阅链接
          </Text>
          <Expand>
            <Input
              placeholder="请输入..."
              value={subscribe?.upstream}
              onChange={() => {
                Message.info('当前订阅不可编辑');
              }}
            />
          </Expand>
        </Row>
      )}
      {isEdit ? (
        <Box />
      ) : (
        <Row width="100%" paddingBottom="16px">
          <Text
            style={{
              fontSize: '14px',
              fontWeight: '400',
              color: colors.text2,
              paddingRight: '10px',
            }}
          >
            最后更新
          </Text>
          <Expand>
            <Input
              placeholder="请输入..."
              value={new Date(subscribe!.lastUpdate)
                .toISOString()
                .substring(0, 16)
                .replace('T', ' ')}
              onChange={() => {
                Message.info('当前订阅不可编辑');
              }}
            />
          </Expand>
        </Row>
      )}
      <TextArea
        placeholder="请输入..."
        autoSize={{ minRows: 6, maxRows: 6 }}
        style={{ width: '100%', marginBottom: '16px' }}
        value={input}
        onChange={(s) => {
          if (isEdit) {
            setInput(s);
          } else {
            Message.info('当前订阅不可编辑');
          }
        }}
      />
    </Dialog>
  );
};

export const showDeleteSubscribeModal = (
  subscribe?: Subscribe,
  flag = true,
) => {
  setSettingModals({ showDelete: flag, subscribe });
};
export const DeleteSubscribeModal = () => {
  const [data] = useXConsumer<SettingModals>(kSettingModals);
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
        const success = await appConfig.remove(subscribe!.key);
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
  const [data] = useXConsumer<SettingModals>(kSettingModals);
  const { url } = data ?? {};
  return (
    <Modal
      title="分享链接"
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
      <Link
        style={{ padding: '20px', color: '#3d7ff6', wordBreak: 'break-all' }}
        href={url}
        target="_blank"
      >
        {url}
      </Link>
    </Modal>
  );
};

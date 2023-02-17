import './style.css';

import {
  Button,
  Dropdown,
  Menu,
  Message,
  Radio,
  Switch,
} from '@arco-design/web-react';
import {
  IconCode,
  IconDelete,
  IconDown,
  IconExport,
  IconImport,
  IconLoop,
  IconMore,
} from '@arco-design/web-react/icon';

import { Box } from '@/components/Box';
import { Center, Column, Expand, Row } from '@/components/Flex';
import { Text } from '@/components/Text';
import {
  ConfigManager,
  configs,
  kSubscribesKey,
  SubscribesStore,
} from '@/data/config/manager';
import { Subscribe } from '@/data/config/types';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useConsumer, useProvider } from '@/services/store/useStore';
import { colors } from '@/styles/colors';
import { isEmpty, isNotEmpty } from '@/utils/is';

import { PageBuilder } from '../app';
import {
  AddSubscribeModal,
  CopyModal,
  DeleteSubscribeModal,
  ExportSubscribeModal,
  ImportSubscribeModal,
  showAddSubscribeModal,
  showDeleteSubscribeModal,
  showExportSubscribeModal,
  showImportSubscribeModal,
  showSubscribeDetailModal,
  SubscribeDetailModal,
  useInitSettingModals,
} from './modals';

const SubscribeHeader = (props: { isMobile: boolean }) => {
  const { isMobile } = props;
  const dropList = (
    <Menu
      style={{
        zIndex: 2,
      }}
    >
      <Menu.Item
        key="更新订阅"
        onClick={async () => {
          await configs.refreshAll();
          Message.success('已刷新');
        }}
      >
        <IconLoop style={{ marginRight: '4px' }} />
        更新订阅
      </Menu.Item>
      <Menu.Item
        key="导入订阅"
        onClick={() => {
          showImportSubscribeModal();
        }}
      >
        <IconImport
          style={{ marginRight: '4px', transform: 'rotate(-90deg)' }}
        />
        导入订阅
      </Menu.Item>
      <Menu.Item
        key="批量导出"
        onClick={() => {
          showExportSubscribeModal();
        }}
      >
        <IconExport
          style={{ marginRight: '4px', transform: 'rotate(-90deg)' }}
        />
        批量导出
      </Menu.Item>
    </Menu>
  );
  return (
    <Row width="100%" className="subscribe-title">
      <Text fontSize="16px" fontWeight="500">
        订阅管理
      </Text>
      <Expand />
      <Dropdown.Button
        trigger={isMobile ? 'click' : 'hover'}
        type="primary"
        position="br"
        droplist={dropList}
        icon={<IconDown />}
        onClick={() => {
          showAddSubscribeModal();
        }}
      >
        新建
      </Dropdown.Button>
    </Row>
  );
};

const SubscribeTable = (props: { isMobile: boolean }) => {
  const { isMobile } = props;
  const [data] = useConsumer<SubscribesStore>(kSubscribesKey);
  const { currentSubscribe, subscribes = [] } = data ?? {};

  const setCurrent = (key: string) => {
    configs.setCurrent(key);
  };
  const datas = Object.values(subscribes);
  return (
    <Box padding="20px 0" width="100%">
      <Column border={`1px solid ${colors.border}`} borderBottom="none">
        <TableHeader isMobile={isMobile} />
        {datas.length < 1 ? (
          <Center
            className={'table-row'}
            width="100%"
            height="48px"
            fontSize="14px"
            fontWeight="400"
            borderBottom={`1px solid ${colors.border}`}
          >
            <Text>暂无数据</Text>
          </Center>
        ) : (
          datas.map((subscribe) => {
            const selected = currentSubscribe === subscribe.key;
            return (
              <TableRow
                key={subscribe.key}
                isMobile={isMobile}
                selected={selected}
                subscribe={subscribe}
                setCurrent={setCurrent}
              />
            );
          })
        )}
      </Column>
    </Box>
  );
};

const TableHeader = (props: { isMobile: boolean }) => {
  const { isMobile } = props;
  return (
    <Row
      borderBottom={`1px solid ${colors.border}`}
      width="100%"
      background={colors.card}
      fontSize="14px"
      fontWeight="500"
    >
      <Radio
        checked
        style={{
          visibility: 'hidden',
          marginLeft: '8px',
        }}
      />
      {isMobile ? (
        <Box />
      ) : (
        <Text width="200px" padding="10px 16px">
          订阅名称
        </Text>
      )}
      <Expand>
        {isMobile ? (
          <Text maxLines={1} width="100%" padding="10px 16px" cursor="pointer">
            订阅名称
          </Text>
        ) : (
          <Text maxLines={1}>订阅链接</Text>
        )}
      </Expand>
      <Text width={isMobile ? '80px' : '200px'}>最后更新</Text>
      <Text width="64px" textAlign="center">
        更多
      </Text>
    </Row>
  );
};

const TableRow = (props: {
  isMobile: boolean;
  subscribe: Subscribe;
  selected: boolean;
  setCurrent: (key: string) => void;
}) => {
  const { isMobile, selected, setCurrent, subscribe } = props;
  const hasRefresh = isNotEmpty(subscribe.link);
  const hasEdit = isEmpty(subscribe.link);
  const hasDelete = subscribe.key !== ConfigManager.defaultKey;
  const dropList = (
    <Menu style={{ width: '90px' }}>
      {hasEdit ? (
        <Menu.Item
          key="编辑"
          onClick={() => {
            showSubscribeDetailModal(subscribe);
          }}
        >
          <IconCode style={{ marginRight: '10px' }} />
          编辑
        </Menu.Item>
      ) : (
        <Box />
      )}
      {hasRefresh ? (
        <Menu.Item
          key="更新"
          onClick={async () => {
            const success = await configs.refreshSubscribe(subscribe.key);
            if (success) {
              Message.success('已刷新');
            } else {
              Message.error('刷新失败');
            }
          }}
        >
          <IconLoop style={{ marginRight: '10px' }} />
          更新
        </Menu.Item>
      ) : (
        <Box />
      )}
      {hasDelete ? (
        <Menu.Item
          key="删除"
          style={{ color: colors.red }}
          onClick={() => {
            showDeleteSubscribeModal(subscribe);
          }}
        >
          <IconDelete style={{ marginRight: '10px' }} />
          删除
        </Menu.Item>
      ) : (
        <Box />
      )}
    </Menu>
  );
  return (
    <Row
      className={'table-row'}
      width="100%"
      height="48px"
      fontSize="14px"
      fontWeight="400"
      borderBottom={`1px solid ${colors.border}`}
    >
      <Radio
        checked={selected}
        style={{
          marginLeft: '8px',
        }}
        onChange={(checked) => {
          if (checked) {
            setCurrent(subscribe.key);
          }
        }}
      />
      {isMobile ? (
        <Box />
      ) : (
        <Text
          maxLines={1}
          width="200px"
          padding="10px 16px"
          color={colors.primary}
          cursor="pointer"
        >
          {subscribe.key}
        </Text>
      )}
      <Expand>
        {isMobile ? (
          <Text
            width="100%"
            maxLines={1}
            padding="10px 16px"
            color={colors.primary}
            cursor="pointer"
          >
            {subscribe.key}
          </Text>
        ) : (
          <Text maxLines={1}>{subscribe.link ?? '-'}</Text>
        )}
      </Expand>
      <Text width={isMobile ? '80px' : '200px'}>
        {new Date(subscribe.lastUpdate).toISOString().substring(0, 10)}
      </Text>
      <Center width="64px">
        <Dropdown droplist={dropList} position="br">
          <Button type="text">
            <IconMore />
          </Button>
        </Dropdown>
      </Center>
    </Row>
  );
};

const CurrentHeader = (props: { isMobile: boolean }) => {
  const { isMobile: _ } = props;
  const [data] = useConsumer<SubscribesStore>(kSubscribesKey);
  const { allowSexy, allowMovieCommentary } = data ?? {};
  return (
    <Column width="100%" className="subscribe-title" alignItems="start">
      <Text fontSize="16px" fontWeight="500">
        搜索过滤开关
      </Text>
      <Row>
        <Row
          margin="20px 0"
          padding="16px"
          border={`1px solid ${colors.border}`}
          borderRadius="4px"
          marginRight="20px"
        >
          <Text fontSize="14px" fontWeight="500" marginRight="20px">
            电影解说
          </Text>
          <Switch
            checked={!allowMovieCommentary}
            onChange={(value) => {
              if (!allowMovieCommentary === !value) {
                configs.toggleAllowMovieCommentary();
              }
            }}
          />
        </Row>
        <Row
          margin="20px 0"
          padding="16px"
          border={`1px solid ${colors.border}`}
          borderRadius="4px"
        >
          <Text fontSize="14px" fontWeight="500" marginRight="20px">
            伦理片
          </Text>
          <Switch
            checked={!allowSexy}
            onChange={(value) => {
              if (!allowSexy === !value) {
                configs.toggleAllowSexy();
              }
            }}
          />
        </Row>
      </Row>
    </Column>
  );
};

const SettingsBody = (props: { isMobile: boolean }) => {
  const { isMobile } = props;
  useInitSettingModals();
  useProvider(kSubscribesKey, {});
  return (
    <Column width="100%">
      <SubscribeHeader isMobile={isMobile} />
      <SubscribeTable isMobile={isMobile} />
      <CurrentHeader isMobile={isMobile} />
      <AddSubscribeModal />
      <ImportSubscribeModal />
      <ExportSubscribeModal />
      <SubscribeDetailModal />
      <DeleteSubscribeModal />
      <CopyModal />
    </Column>
  );
};

const Settings = () => {
  const { isMobile } = useBreakpoint();
  const { isDarkMode } = useDarkMode();
  return (
    <PageBuilder
      background={isMobile ? colors.bg : isDarkMode ? colors.bg3 : colors.gray}
    >
      <Column
        background={colors.bg}
        padding={isMobile ? '0' : '20px'}
        maxWidth="1024px"
      >
        <SettingsBody isMobile={isMobile} />
      </Column>
    </PageBuilder>
  );
};

export default <Settings />;

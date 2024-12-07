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
  IconEye,
  IconImport,
  IconLoop,
  IconMore,
} from '@arco-design/web-react/icon';
import { useXConsumer } from 'xsta';

import { Box } from '@/components/Box';
import { Center, Column, Expand, Row } from '@/components/Flex';
import { Text } from '@/components/Text';
import {
  appConfig,
  kDefaultSubscribeName,
  kSubscribesKey,
  SubscribesStore,
} from '@/data/config';
import { Subscribe } from '@/data/config/types';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useDarkMode } from '@/hooks/useDarkMode';
import { cache } from '@/services/cache';
import { colors } from '@/styles/colors';
import { isEmpty, isNotEmpty } from '@/utils/is';
import { formateDate } from '@/utils/string';

import { PageBuilder } from '../../app';
import {
  AddSubscribeModal,
  CopyModal,
  DeleteSubscribeModal,
  ImportSubscribeModal,
  showAddSubscribeModal,
  showDeleteSubscribeModal,
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
          await appConfig.refreshAll();
          Message.success('已更新');
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
          appConfig.exportSubscribes();
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
      <Text fontSize="16px" fontWeight="bold">
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
  const [data] = useXConsumer<SubscribesStore>(kSubscribesKey);
  const { current: currentSubscribe, subscribes = {} } = data ?? {};

  const setCurrent = (name: string) => {
    appConfig.setCurrent(name);
  };
  const items = Object.values(subscribes).sort((a, b) => {
    const c = a.name;
    const d = b.name;
    return c.localeCompare(d, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });
  return (
    <Box padding="20px 0" width="100%">
      <Column border={`1px solid ${colors.border}`} borderBottom="none">
        <TableHeader isMobile={isMobile} />
        {items.length < 1 ? (
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
          items.map((subscribe) => {
            const selected = currentSubscribe === subscribe.name;
            return (
              <TableRow
                key={subscribe.name}
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
      fontWeight="bold"
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
          <Text maxLines={1} width="100%" padding="0 16px">
            订阅链接
          </Text>
        )}
      </Expand>
      <Text width={isMobile ? '85px' : '200px'}>最后更新</Text>
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
  setCurrent: (name: string) => void;
}) => {
  const { isMobile, selected, setCurrent, subscribe } = props;
  const hasRefresh = isNotEmpty(subscribe.server);
  const hasEdit = isEmpty(subscribe.server);
  const hasDelete = subscribe.name !== kDefaultSubscribeName;
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
        <Menu.Item
          key="查看"
          onClick={() => {
            showSubscribeDetailModal(subscribe);
          }}
        >
          <IconEye style={{ marginRight: '10px' }} />
          查看
        </Menu.Item>
      )}
      {hasRefresh ? (
        <Menu.Item
          key="更新"
          onClick={async () => {
            const success = await appConfig.refreshSubscribe(subscribe.name);
            if (success) {
              Message.success('已更新');
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
      <Menu.Item
        key="导出"
        onClick={() => {
          appConfig.exportSubscribe(subscribe);
        }}
      >
        <IconExport
          style={{ marginRight: '10px', transform: 'rotate(-90deg)' }}
        />
        导出
      </Menu.Item>
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
            setCurrent(subscribe.name);
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
          onClick={() => {
            showSubscribeDetailModal(subscribe);
          }}
        >
          {subscribe.name}
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
            onClick={() => {
              showSubscribeDetailModal(subscribe);
            }}
          >
            {subscribe.name}
          </Text>
        ) : (
          <Text
            maxLines={1}
            width="100%"
            padding="0 16px"
            wordBreak="break-all"
          >
            {subscribe.server ?? '-'}
          </Text>
        )}
      </Expand>
      <Text width={isMobile ? '85px' : '200px'}>
        {formateDate(subscribe.lastUpdate)}
      </Text>
      <Center width="64px">
        <Dropdown
          droplist={dropList}
          position="br"
          trigger={isMobile ? 'click' : 'hover'}
        >
          <Button type="text">
            <IconMore />
          </Button>
        </Dropdown>
      </Center>
    </Row>
  );
};

const ContentFilter = (props: { isMobile: boolean }) => {
  const { isMobile: _ } = props;
  const [data] = useXConsumer<SubscribesStore>(kSubscribesKey);
  const { adultContent, movieCommentaries } = data ?? {};
  return (
    <Column width="100%" className="subscribe-title" alignItems="start">
      <Text fontSize="16px" fontWeight="bold">
        搜索结果屏蔽以下内容
      </Text>
      <Row>
        <Row
          margin="20px 0"
          padding="12px"
          border={`1px solid ${colors.border}`}
          borderRadius="4px"
          marginRight="20px"
        >
          <Text fontSize="14px" fontWeight="bold" marginRight="20px">
            电影解说
          </Text>
          <Switch
            checked={!movieCommentaries}
            onChange={(value) => {
              if (!movieCommentaries === !value) {
                appConfig.toggleAllowMovieCommentaries();
              }
            }}
          />
        </Row>
        <Row
          margin="20px 0"
          padding="12px"
          border={`1px solid ${colors.border}`}
          borderRadius="4px"
        >
          <Text fontSize="14px" fontWeight="bold" marginRight="20px">
            伦理片
          </Text>
          <Switch
            checked={!adultContent}
            onChange={(value) => {
              if (!adultContent === !value) {
                appConfig.toggleAllowAdultContent();
              }
            }}
          />
        </Row>
      </Row>
    </Column>
  );
};

const ClearCache = (props: { isMobile: boolean }) => {
  const { isMobile: _ } = props;
  return (
    <Column width="100%" className="subscribe-title" alignItems="start">
      <Text fontSize="16px" fontWeight="bold">
        清除缓存
      </Text>

      <Row>
        <Text fontSize="13px" fontWeight="400" padding="8px 0 16px 0">
          如果搜索结果异常或程序运行不正常，你可以尝试清除缓存以解决问题。该操作不会影响你的个人设置和数据。
        </Text>
      </Row>
      <Button
        type="primary"
        onClick={async () => {
          await cache.reset();
          Message.success('已清除');
        }}
      >
        一键清除
      </Button>
    </Column>
  );
};

const SettingsBody = (props: { isMobile: boolean }) => {
  const { isMobile } = props;
  useInitSettingModals();
  return (
    <Column width="100%">
      <SubscribeHeader isMobile={isMobile} />
      <SubscribeTable isMobile={isMobile} />
      <ContentFilter isMobile={isMobile} />
      <ClearCache isMobile={isMobile} />
      <AddSubscribeModal />
      <ImportSubscribeModal />
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

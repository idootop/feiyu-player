import './style.css';

import { Button, Dropdown, Menu, Radio } from '@arco-design/web-react';
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
import { useConsumer } from '@/services/store/useStore';
import { colors } from '@/styles/colors';
import { isEmpty, isNotEmpty } from '@/utils/is';

import { PageBuilder } from '../app';

const SubscribeHeader = () => {
  const { isMobile } = useBreakpoint();
  const dropList = (
    <Menu
      style={{
        zIndex: 2,
      }}
    >
      <Menu.Item
        key="更新订阅"
        onClick={() => {
          alert('更新订阅');
        }}
      >
        <IconLoop style={{ marginRight: '4px' }} />
        更新订阅
      </Menu.Item>
      <Menu.Item
        key="导入订阅"
        onClick={() => {
          alert('导入订阅');
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
          alert('批量导出');
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

  return (
    <Box padding="20px 0" width="100%">
      <Column border={`1px solid ${colors.border}`} borderBottom="none">
        <TableHeader isMobile={isMobile} />
        {Object.values(subscribes).map((subscribe) => {
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
        })}
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
            alert('编辑');
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
          onClick={() => {
            alert('更新');
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
            alert('删除');
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

const SettingsBody = (props: { isMobile: boolean }) => {
  const { isMobile } = props;
  return (
    <Column width="100%">
      <SubscribeHeader />
      <SubscribeTable isMobile={isMobile} />
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

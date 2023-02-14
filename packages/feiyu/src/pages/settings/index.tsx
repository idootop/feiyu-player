import './style.css';

import { Dropdown, Menu, Radio } from '@arco-design/web-react';
import {
  IconDown,
  IconExport,
  IconImport,
  IconLoop,
} from '@arco-design/web-react/icon';

import { Box } from '@/components/Box';
import { Column, Expand, Row } from '@/components/Flex';
import { Text } from '@/components/Text';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useDarkMode } from '@/hooks/useDarkMode';
import { colors } from '@/styles/colors';
import { range } from '@/utils/base';

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
      <Text fontSize="14px" fontWeight="500">
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
  const $TableHeader = (
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
      <Text width="200px" padding="10px 16px">
        订阅名称
      </Text>
      <Expand>
        <Text>订阅链接</Text>
      </Expand>
      <Text width="200px">最后更新</Text>
      <Text width="64px">更多</Text>
    </Row>
  );
  return (
    <Box padding="20px 0" width="100%">
      <Column border={`1px solid ${colors.border}`} borderBottom="none">
        {$TableHeader}
        {range(10).map((_, idx) => {
          return <TableRow key={idx} isMobile={isMobile} />;
        })}
      </Column>
    </Box>
  );
};

const TableRow = (props: { isMobile: boolean }) => {
  const { isMobile: _ } = props;
  return (
    <Row
      className="table-row"
      width="100%"
      fontSize="14px"
      fontWeight="400"
      borderBottom={`1px solid ${colors.border}`}
    >
      <Radio
        style={{
          marginLeft: '8px',
        }}
      />
      <Text
        width="200px"
        padding="10px 16px"
        color={colors.primary}
        cursor="pointer"
      >
        订阅名称
      </Text>
      <Expand>
        <Text>订阅链接</Text>
      </Expand>
      <Text width="200px">2022-03-12</Text>
      <Text width="64px">更多</Text>
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

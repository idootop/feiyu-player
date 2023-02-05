import { Popover } from '@arco-design/web-react';

import { Expand, Row } from '@/components/Flex';
import { SwitchDark } from '@/components/SwitchDark';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useDarkMode } from '@/hooks/useDarkMode';
import { colors } from '@/styles/colors';

import { useHomePages } from '../home';
import { SearchButton } from './SearchButton';
import { useSideMenu } from './SideMenu';

export const kHeaderHeight = '60px';

export const MyHeader = () => {
  const { isDarkMode } = useDarkMode();
  const { jumpToIndex } = useHomePages();
  const { isMobile } = useBreakpoint();
  const { openSideMenu } = useSideMenu();

  return (
    <Row
      className="glass-header"
      style={{
        position: 'fixed',
        top: '0px',
        zIndex: 10,
        width: '100vw',
        height: kHeaderHeight,
        padding: '0px 20px',
        background: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
        boxShadow: '0 2px 6px rgba(0,0,0,.05)',
      }}
    >
      <Row
        cursor="pointer"
        onClick={() => {
          if (isMobile) {
            // 移动端点击打开菜单栏
            openSideMenu();
          } else {
            // 跳转首页
            jumpToIndex({ keepHistory: false });
          }
        }}
      >
        <img width="24px" height="24px" src="/logo.svg" />
        <Popover position="right" content="喵呜 ฅ'ω'ฅ">
          <span
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              padding: '0px 10px',
              color: colors.text,
            }}
          >
            飞鱼
          </span>
        </Popover>
      </Row>

      <Expand />
      <SearchButton />
      <SwitchDark />
    </Row>
  );
};

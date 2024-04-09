import { Message } from '@arco-design/web-react';
import { FeiyuDesktop } from 'feiyu-desktop';

import { Expand, Row } from '@/components/Flex';
import { SwitchDark } from '@/components/SwitchDark';
import { colors } from '@/styles/colors';

import { useHomePages } from '../pages/home/useHomePages';
import { SearchButton } from './SearchButton';
import { useSideMenu } from './SideMenu';
import { TitleBar } from './TitleBar';

export const kHeaderHeight = '60px';

export const MyHeader = () => {
  const { jumpToIndex, isIndexPage } = useHomePages();
  const { hideSideMenu, openSideDrawer } = useSideMenu();

  return (
    <div
      className="glass-effect app-header"
      style={{
        position: 'fixed',
        top: '0px',
        zIndex: 10,
      }}
    >
      {FeiyuDesktop.isDesktop && <TitleBar />}
      <div
        data-tauri-drag-region
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100vw',
          height: kHeaderHeight,
          padding: '0px 20px',
          boxShadow: '0 2px 6px rgba(0,0,0,.05)',
        }}
      >
        <Row
          marginTop={FeiyuDesktop.isDesktop ? '14px' : undefined}
          cursor="pointer"
          onClick={() => {
            if (hideSideMenu) {
              // 移动端点击打开菜单栏
              openSideDrawer();
            } else {
              if (!isIndexPage) {
                jumpToIndex(); // 回到首页
              } else {
                Message.info("喵呜 ฅ'ω'ฅ");
              }
            }
          }}
        >
          <img width="24px" height="24px" src="/logo.svg" />
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
        </Row>
        <Expand />
        <SearchButton />
        <SwitchDark />
      </div>
    </div>
  );
};

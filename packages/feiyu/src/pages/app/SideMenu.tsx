import { Drawer, Menu, Message } from '@arco-design/web-react';
import { useXState } from 'xsta';

import { Box } from '@/components/Box';
import { Row } from '@/components/Flex';
import { kRoutePages } from '@/pages';
import { usePages } from '@/services/routes/page';
import { colors } from '@/styles/colors';

import { kHeaderHeight } from './MyHeader';

const MenuItem = Menu.Item;

export const kSideWidth = 220;
const kSideMenu = 'showSideMenu';

export const useSideMenu = () => {
  const [showSideMenu, setShowSideMenu] = useXState(kSideMenu);
  return {
    isShowSideMenu: showSideMenu,
    openSideMenu() {
      setShowSideMenu(true);
    },
    closeSideMenu() {
      setShowSideMenu(false);
    },
  };
};

export const SideMenu = () => <MyMenu key="SideMenu" />;

export const SideDrawer = () => {
  const [showSideMenu, setShowSideMenu] = useXState(kSideMenu);
  return (
    <Drawer
      width={kSideWidth}
      title={null}
      footer={null}
      closable={false}
      visible={showSideMenu}
      placement="left"
      onCancel={() => {
        setShowSideMenu(false);
      }}
      mountOnEnter
      unmountOnExit
    >
      <MyMenu key="SideDrawer" showLogo />
    </Drawer>
  );
};

const MyMenu = (props?: { showLogo?: boolean }) => {
  const { showLogo } = props ?? {};
  const { currentPage, jumpToPage, isIndexPage } = usePages();
  const { jumpToIndex } = usePages({ parent: '/home', index: 'hot' });
  const { closeSideMenu } = useSideMenu();
  return (
    <Menu
      mode="vertical"
      selectedKeys={[currentPage!]}
      style={{ height: '100%' }}
    >
      <Row
        style={{
          height: kHeaderHeight,
          marginBottom: '4px',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {showLogo ? (
          <Row
            cursor="pointer"
            onClick={() => {
              // 收起侧边栏
              closeSideMenu();
              if (!isIndexPage) {
                jumpToIndex(); // 回到首页
              } else {
                Message.info("喵呜 ฅ'ω'ฅ");
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
        ) : (
          <Box />
        )}
      </Row>
      {kRoutePages.map((page) => {
        return (
          <MenuItem
            key={page.key}
            onClick={() => {
              // 收起侧边栏
              closeSideMenu();
              // 跳转页面
              const available = ['home', 'settings'].includes(page.key);
              if (available) {
                if (page.key === 'home') {
                  jumpToIndex();
                } else {
                  jumpToPage(page.key);
                }
              } else {
                Message.info('Coming soon');
              }
            }}
          >
            {page.icon}
            {page.title}
          </MenuItem>
        );
      })}
    </Menu>
  );
};

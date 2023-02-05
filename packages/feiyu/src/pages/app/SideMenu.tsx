import { Drawer, Menu, Message } from '@arco-design/web-react';

import { Box } from '@/components/Box';
import { Row } from '@/components/Flex';
import { kRoutePages } from '@/pages';
import { usePages } from '@/services/routes/page';
import { useStore } from '@/services/store/useStore';
import { colors } from '@/styles/colors';

import { kHeaderHeight } from './MyHeader';

const MenuItem = Menu.Item;

export const kSideWidth = 220;
const kSideMenu = 'showSideMenu';

export const useSideMenu = () => {
  const [showSideMenu, setShowSideMenu] = useStore(kSideMenu);
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
  const [showSideMenu, setShowSideMenu] = useStore(kSideMenu);
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
  const { currentPage } = usePages();
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
              // 菜单点击后，收起侧边栏
              closeSideMenu();
              Message.info("喵呜 ฅ'ω'ฅ");
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
              if (page.key === kRoutePages[0].key) {
                jumpToIndex();
              } else {
                Message.info('Coming soon');
                // jumpToPage(page.key);
              }
              // 菜单点击后，收起侧边栏
              closeSideMenu();
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

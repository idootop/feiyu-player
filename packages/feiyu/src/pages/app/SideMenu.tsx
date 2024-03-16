import { Drawer, Menu, Message } from '@arco-design/web-react';
import { useXState, XSta } from 'xsta';

import { Box } from '@/components/Box';
import { Row } from '@/components/Flex';
import { useScreen } from '@/hooks/useScreen';
import { kRoutePages } from '@/pages';
import { usePages } from '@/services/routes/page';
import { colors } from '@/styles/colors';

import { kHeaderHeight } from './MyHeader';

const MenuItem = Menu.Item;

export const kSideWidth = 200;
const kShowSideDrawer = 'showSideDrawer';
const closeSideDrawer = () => XSta.set(kShowSideDrawer, false);
export const useSideMenu = () => {
  const [showSideDrawer, setShowSideDrawer] = useXState(kShowSideDrawer);
  const { width } = useScreen();
  const { location } = usePages();
  const hideSideMenu =
    width < 650 || // 移动端
    (location === '/home/play' && width < 1250); // 播放页
  return {
    collapsed: width < 910,
    hideSideMenu,
    showSideDrawer,
    openSideDrawer() {
      setShowSideDrawer(true);
    },
    closeSideDrawer() {
      setShowSideDrawer(false);
    },
  };
};

const MyMenu = (props?: { isDrawer?: boolean }) => {
  const { isDrawer = false } = props ?? {};
  const showLogo = isDrawer;
  const { currentPage, jumpToPage, isIndexPage } = usePages();
  const { jumpToIndex } = usePages({ parent: '/home', index: 'hot' });
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
              closeSideDrawer();
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
              closeSideDrawer();
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

export const SideMenu = () => <MyMenu key="SideMenu" />;

export const SideDrawer = () => {
  const [showSideDrawer, setShowSideDrawer] = useXState(kShowSideDrawer);
  return (
    <Drawer
      width={kSideWidth}
      height="100vh"
      title={null}
      footer={null}
      closable={false}
      visible={showSideDrawer}
      placement="left"
      onCancel={() => {
        setShowSideDrawer(false);
      }}
      mountOnEnter
      unmountOnExit
    >
      <MyMenu key="SideDrawer" isDrawer />
    </Drawer>
  );
};

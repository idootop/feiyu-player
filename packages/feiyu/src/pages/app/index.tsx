import './style.css';

import { Layout } from '@arco-design/web-react';

import { Box, BoxProps } from '@/components/Box';
import { APPConfigModal, useInitAPPModals } from '@/overlays/APPConfigModal';
import { colors } from '@/styles/colors';

import { useDisclaimer, useInitAPP } from './initAPP';
import { kHeaderHeight, MyHeader } from './MyHeader';
import { RootPages } from './RootPages';
import { kSideWidth, SideDrawer, SideMenu, useSideMenu } from './SideMenu';

const Sider = Layout.Sider;
const Content = Layout.Content;

export const App = () => {
  // 初始化APP
  useInitAPP();

  // APP 全局弹窗
  useInitAPPModals();

  // 免责声明弹窗
  const $Disclaimer = useDisclaimer();

  const { hideSideMenu, collapsed } = useSideMenu();

  return (
    <>
      <MyHeader />
      <SideDrawer />
      {$Disclaimer}
      <APPConfigModal />
      <Layout>
        <Sider
          collapsed={collapsed}
          width={kSideWidth}
          style={{
            height: '100vh',
            display: hideSideMenu ? 'none' : 'block',
          }}
        >
          <SideMenu />
        </Sider>
        <Content style={{ background: colors.bg }}>
          <Box width="100%" height="100vh">
            <RootPages />
          </Box>
        </Content>
      </Layout>
    </>
  );
};

export const PageBuilder = (props: BoxProps) => {
  return (
    <Box
      className="hide-scrollbar"
      width="100%"
      height="100vh"
      padding={`calc(${kHeaderHeight} + 20px) 20px 20px 20px`}
      overflowY="scroll"
      background={colors.bg}
      {...props}
    >
      {props.children}
    </Box>
  );
};

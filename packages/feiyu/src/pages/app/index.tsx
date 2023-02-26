import './style.css';

import { Layout } from '@arco-design/web-react';

import { Box, BoxProps } from '@/components/Box';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { colors } from '@/styles/colors';

import { useDisclaimer, useInitAPP } from './initAPP';
import { kHeaderHeight, MyHeader } from './MyHeader';
import { RootPages } from './RootPages';
import { kSideWidth, SideDrawer, SideMenu } from './SideMenu';

const Sider = Layout.Sider;
const Content = Layout.Content;

export const App = () => {
  const { isMobile } = useBreakpoint();

  // 初始化APP
  useInitAPP();

  // 免责声明弹窗
  const $Disclaimer = useDisclaimer();

  return (
    <>
      <MyHeader />
      <SideDrawer />
      {$Disclaimer}
      <Layout style={{ height: '100vh' }}>
        <Sider
          width={kSideWidth}
          style={{ display: isMobile ? 'none' : 'block' }}
        >
          <SideMenu />
        </Sider>
        <Content
          style={{
            background: colors.bg,
          }}
        >
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
      className="hide-scollbar"
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

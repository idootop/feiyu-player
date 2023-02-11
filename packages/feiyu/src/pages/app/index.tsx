import './style.css';

import { Layout } from '@arco-design/web-react';

import { Box, BoxProps } from '@/components/Box';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { colors } from '@/styles/colors';

import { useInitAPP } from './initAPP';
import { kHeaderHeight, MyHeader } from './MyHeader';
import { RootPages } from './RootPages';
import { kSideWidth, SideDrawer, SideMenu } from './SideMenu';

const Sider = Layout.Sider;
const Content = Layout.Content;

export const App = () => {
  const { isMobile } = useBreakpoint();

  useInitAPP();

  return (
    <>
      <MyHeader />
      <SideDrawer />
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
      padding="20px"
      overflowY="scroll"
      background={colors.bg}
      {...props}
    >
      <Box height={kHeaderHeight} />
      {props.children}
    </Box>
  );
};

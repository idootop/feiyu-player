import './styles.css';

import { Tooltip } from '@arco-design/web-react';
import { FeiyuDesktop } from 'feiyu-desktop';

const TitleButton = (props: {
  color: string;
  onClick: VoidFunction;
  tip: string;
}) => {
  const { color, onClick, tip } = props;
  return (
    <Tooltip
      content={tip}
      position="bottom"
      prefixCls="feiyu"
      style={{ zIndex: 11 }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: color,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={onClick}
      />
    </Tooltip>
  );
};

export const TitleBar = () => {
  return (
    <div data-tauri-drag-region className={'titlebar app-header'}>
      <TitleButton
        color="#fe5f57"
        tip="关闭"
        onClick={() => {
          FeiyuDesktop.window?.close();
        }}
      />
      <TitleButton
        color="#febb2e"
        tip={'最小化'}
        onClick={() => {
          FeiyuDesktop.window?.minimize();
        }}
      />
      <TitleButton
        color="#2bc840"
        tip="全屏"
        onClick={async () => {
          const isFullscreen = await FeiyuDesktop.window?.isFullscreen();
          FeiyuDesktop.window?.setFullscreen(!isFullscreen);
        }}
      />
    </div>
  );
};

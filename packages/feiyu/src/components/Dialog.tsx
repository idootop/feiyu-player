import { Button, Modal } from '@arco-design/web-react';
import { ReactNode } from 'react';

import { Column, Expand, Row } from './Flex';
import { Text } from './Text';

interface DialogProps {
  ok?: string;
  cancel?: string;
  onOk: () => void;
  onCancel: () => void;
  title: string;
  children: ReactNode;
  visible?: boolean;
  okWaiting?: boolean;
  cancelWaiting?: boolean;
}

export const Dialog = (props: DialogProps) => {
  const {
    ok = '确定',
    cancel = '取消',
    onOk,
    onCancel,
    title,
    children,
    visible,
    okWaiting,
    cancelWaiting,
  } = props;
  return (
    <Modal
      title={null}
      footer={null}
      visible={visible}
      onCancel={onCancel}
      style={{
        width: 'calc( 100% - 20px * 2)',
        maxWidth: '360px',
        margin: '20px',
        boxSizing: 'border-box',
      }}
    >
      <Column borderRadius="4px" padding="20px" alignItems="start">
        <Text
          style={{ fontSize: '16px', fontWeight: '500', paddingBottom: '16px' }}
        >
          {title}
        </Text>
        {children}
        <Row width="100%">
          <Expand />
          <Button
            loading={cancelWaiting}
            type="secondary"
            onClick={onCancel}
            style={{ marginRight: '8px' }}
          >
            {cancel}
          </Button>
          <Button loading={okWaiting} type="primary" onClick={onOk}>
            {ok}
          </Button>
        </Row>
      </Column>
    </Modal>
  );
};

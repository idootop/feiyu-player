import { Button, Modal } from '@arco-design/web-react';
import { ReactNode } from 'react';

import { isNotEmpty } from '@/utils/is';

import { Box } from './Box';
import { Column, Expand, Row } from './Flex';
import { Text } from './Text';

interface DialogProps {
  ok?: string;
  cancel?: string;
  lead?: string;
  onOk?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  onLead?: () => void;
  title: string;
  children: ReactNode;
  visible?: boolean;
  okWaiting?: boolean;
  cancelWaiting?: boolean;
  leadWaiting?: boolean;
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
    lead,
    onLead,
    onClose = onCancel,
    leadWaiting,
  } = props;
  return (
    <Modal
      title={null}
      footer={null}
      visible={visible}
      onCancel={onClose}
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
          {lead ? (
            <Button loading={leadWaiting} type="secondary" onClick={onLead}>
              {lead}
            </Button>
          ) : (
            <Box />
          )}
          <Expand />
          {isNotEmpty(cancel) ? (
            <Button
              loading={cancelWaiting}
              type="secondary"
              onClick={onCancel}
              style={{ marginRight: '8px' }}
            >
              {cancel}
            </Button>
          ) : (
            <Box />
          )}
          <Button loading={okWaiting} type="primary" onClick={onOk}>
            {ok}
          </Button>
        </Row>
      </Column>
    </Modal>
  );
};

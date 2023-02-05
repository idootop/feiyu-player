import { Text } from './Text';

const _longText = Array(100).fill('________').join('________');

export const LongText = () => {
  return (
    <Text
      style={{
        visibility: 'hidden',
        fontSize: '1px',
        lineHeight: '0.1px',
      }}
    >
      {_longText}
    </Text>
  );
};

import { Button } from '@arco-design/web-react';
import { IconMoon, IconSun } from '@arco-design/web-react/icon';

import { useDarkMode } from '@/hooks/useDarkMode';

export const SwitchDark = () => {
  const { isDarkMode, switchDarkMode } = useDarkMode();
  return (
    <Button
      shape="circle"
      type="secondary"
      onClick={switchDarkMode}
      icon={isDarkMode ? <IconMoon /> : <IconSun />}
    />
  );
};

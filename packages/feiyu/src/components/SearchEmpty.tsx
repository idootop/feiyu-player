import { Empty } from '@arco-design/web-react';
import { useEffect, useState } from 'react';

import { isValidProxy } from '@/services/http';
import { usePages } from '@/services/routes/page';

export const SearchEmpty = (props?: { check?: boolean }) => {
  const { check = true } = props ?? {};
  const [invalid, setInvalid] = useState(false);
  const { jumpToPage } = usePages();
  useEffect(() => {
    if (check) {
      setTimeout(async () => {
        const result = await isValidProxy();
        setInvalid(!result);
      }, 0);
    }
  }, []);
  return invalid ? (
    <div
      style={{
        cursor: 'pointer',
      }}
      onClick={() => {
        // 点击打开设置页面
        jumpToPage('settings');
      }}
    >
      <Empty description="请先打开「设置」，配置请求代理" />
    </div>
  ) : (
    <Empty description="空空如也，喵呜 ฅ'ω'ฅ" />
  );
};

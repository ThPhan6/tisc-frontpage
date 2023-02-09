import React from 'react';

import { Button, Result } from 'antd';

import { pushTo } from '@/helper/history';

const NoAccessPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you don't have permission to access this page."
    extra={
      <Button type="primary" onClick={() => pushTo('/')}>
        Back Home
      </Button>
    }
  />
);

export default NoAccessPage;

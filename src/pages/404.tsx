import React from 'react';

import { Button, Result } from 'antd';

import { pushTo } from '@/helper/history';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Button type="primary" onClick={() => pushTo('/')}>
        Back Home
      </Button>
    }
  />
);

export default NoFoundPage;

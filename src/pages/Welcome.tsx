import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert } from 'antd';
import styles from './Welcome.less';

const Welcome: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Alert message={'welcome'} type="success" banner />
      </Card>
    </PageContainer>
  );
};

export default Welcome;

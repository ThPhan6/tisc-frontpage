import { Spin } from 'antd';

import { useAppSelector } from '@/reducers';

import styles from './styles/index.less';

const LoadingPageCustomize = () => {
  const loading = useAppSelector((state) => state.loading.spninning);

  if (loading) {
    return (
      <div className={styles.container}>
        <Spin size="large" />
      </div>
    );
  }
  return null;
};

export default LoadingPageCustomize;

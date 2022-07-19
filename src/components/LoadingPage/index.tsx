import { Spin } from 'antd';
import styles from './styles/index.less';

const LoadingPageCustomize = () => {
  return (
    <div className={styles.container}>
      <Spin size="large" />
    </div>
  );
};
export default LoadingPageCustomize;

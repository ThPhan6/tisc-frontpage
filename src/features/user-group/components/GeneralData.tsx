import { FC } from 'react';

import { Empty } from 'antd';

import styles from './GeneralData.less';

const GeneralData: FC = ({ children }) => {
  return (
    <div>{children || <Empty className={styles.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />}</div>
  );
};

export default GeneralData;

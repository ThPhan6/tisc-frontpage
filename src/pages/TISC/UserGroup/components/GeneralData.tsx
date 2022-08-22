import { BodyText } from '@/components/Typography';
import { Empty } from 'antd';
import { FC } from 'react';
import styles from './GeneralData.less';

const GeneralData: FC = ({ children }) => {
  return (
    <div>
      {children || (
        <Empty description={<BodyText level={3}>No Data</BodyText>} className={styles.empty} />
      )}
    </div>
  );
};

export default GeneralData;

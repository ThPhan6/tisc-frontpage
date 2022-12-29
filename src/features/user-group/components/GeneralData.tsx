import { FC } from 'react';

import { EmptyOne } from '@/components/Empty';

import styles from './GeneralData.less';

const GeneralData: FC = ({ children }) => {
  return <div>{children || <EmptyOne customClass={styles.empty} />}</div>;
};

export default GeneralData;

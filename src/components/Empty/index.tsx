import type { FC } from 'react';

import { Empty } from 'antd';

import styles from './index.less';

type BodyTextLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;
interface EmptyProps {
  description?: string;
  level?: BodyTextLevel;
  imgHeight?: number;
  isCenter?: boolean;
  customClass?: string;
}
export const EmptyOne: FC<EmptyProps> = ({ imgHeight = 60, isCenter, customClass = '' }) => {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      imageStyle={{ height: imgHeight }}
      className={`${styles.customEmptyOne} ${customClass} ${isCenter ? styles.center : ''}`}
    />
  );
};

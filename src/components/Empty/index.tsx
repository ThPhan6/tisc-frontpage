import type { FC } from 'react';
import { Empty } from 'antd';
import { BodyText } from '@/components/Typography';
import { ReactComponent as EmptyOnePlaceholder } from '@/assets/images/empty-image-placeholder.svg';
import styles from './index.less';

type BodyTextLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;
interface EmptyProps {
  description?: string;
  level?: BodyTextLevel;
  imgHeight?: number;
  isCenter?: boolean;
  customClass?: string;
}
export const EmptyOne: FC<EmptyProps> = ({
  description = 'No Data',
  level = 4,
  imgHeight = 60,
  isCenter,
  customClass,
}) => {
  return (
    <Empty
      image={<EmptyOnePlaceholder />}
      imageStyle={{ height: imgHeight }}
      description={<BodyText level={level}>{description}</BodyText>}
      className={`${customClass} ${isCenter ? styles.center : ''}`}
    />
  );
};

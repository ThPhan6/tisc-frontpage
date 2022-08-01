import { BodyText } from '@/components/Typography';
import { FC } from 'react';
import styles from '../styles/attributes.less';

const AttributeCollapseHeader: FC<{ name: string }> = ({ name = '' }) => {
  return (
    <div className={styles.brandProfileHeader}>
      <BodyText level={6} fontFamily="Roboto" className={styles.name}>
        {name}
      </BodyText>
    </div>
  );
};
export default AttributeCollapseHeader;

import { BodyText } from '@/components/Typography';
import type { FC, ReactNode } from 'react';
import styles from '../styles/attributes.less';

interface ProductAttributeLineProps {
  name: string;
  children?: ReactNode;
}

const ProductAttributeLine: FC<ProductAttributeLineProps> = ({ name = '', children }) => {
  return (
    <div className={`${styles.content} ${styles.attribute}`}>
      <BodyText level={4} customClass={styles.content_type}>
        {name}
      </BodyText>
      {children}
    </div>
  );
};
export default ProductAttributeLine;

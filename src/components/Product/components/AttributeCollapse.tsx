import CustomCollapse from '@/components/Collapse';
import AttributeCollapseHeader from './AttributeCollapseHeader';
import type { FC, ReactNode } from 'react';
import styles from '../styles/attributes.less';

interface AttributeCollapseProps {
  name: string;
  index: number;
  children?: ReactNode;
}

const AttributeCollapse: FC<AttributeCollapseProps> = ({ name, index, children }) => {
  return (
    <CustomCollapse
      showActiveBoxShadow
      key={`${name}_${index}`}
      className={styles.vendorSection}
      customHeaderClass={styles.vendorCustomPanelBox}
      header={<AttributeCollapseHeader name={name} />}
    >
      {children}
    </CustomCollapse>
  );
};
export default AttributeCollapse;

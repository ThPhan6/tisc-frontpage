import { FC, ReactNode } from 'react';

import { Collapse } from 'antd';
import type { CollapseProps } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import styles from './index.less';

interface CustomCollapseProps extends CollapseProps {
  header: string | ReactNode;
  children: ReactNode;
  customHeaderClass?: string;
  showActiveBoxShadow?: boolean;
  noBorder?: boolean;
  arrowAlignRight?: boolean;
  fontBold?: boolean;
}

const CustomCollapse: FC<CustomCollapseProps> = ({
  header,
  children,
  customHeaderClass,
  className,
  showActiveBoxShadow,
  noBorder,
  arrowAlignRight,
  fontBold,
  ...props
}) => {
  return (
    <Collapse
      expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
      expandIconPosition="right"
      className={`${styles.customCollapse} ${className || ''} ${
        showActiveBoxShadow ? styles.activeBoxShadow : ''
      } ${noBorder ? styles.noBorder : ''} ${arrowAlignRight ? styles.arrowAlignRight : ''} ${
        fontBold ? styles.fontBold : styles.fontNormal
      } `}
      {...props}>
      <Collapse.Panel
        key="1"
        className={`${styles.customHeaderCollapse} ${customHeaderClass || ''}`}
        header={header}>
        {children}
      </Collapse.Panel>
    </Collapse>
  );
};
export default CustomCollapse;

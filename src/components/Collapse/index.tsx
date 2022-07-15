import { FC, ReactNode } from 'react';
import { Collapse } from 'antd';
import type { CollapseProps } from 'antd';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import styles from './styles/collapse.less';

interface CustomCollapseInterface extends CollapseProps {
  header: string | ReactNode;
  children: ReactNode;
  customHeaderClass?: string;
}

const CustomCollapse: FC<CustomCollapseInterface> = ({
  header,
  children,
  customHeaderClass,
  className,
  ...props
}) => {
  return (
    <Collapse
      expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
      expandIconPosition="right"
      className={`${styles.customCollapse} ${className}`}
      {...props}
    >
      <Collapse.Panel
        key="1"
        className={`${styles.customHeaderCollapse} ${customHeaderClass}`}
        header={header}
      >
        {children}
      </Collapse.Panel>
    </Collapse>
  );
};
export default CustomCollapse;

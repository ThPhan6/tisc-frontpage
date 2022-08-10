import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import type { CollapsibleType } from 'antd/lib/collapse/CollapsePanel';
import type { CollapseProps } from 'antd/lib/collapse/Collapse';
import dropdownStyle from '@/components/CustomRadio/styles/dropdownList.less';
import styles from '../styles/index.less';

interface PanelProps {
  isActive?: boolean;
  header?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showArrow?: boolean;
  forceRender?: boolean;
  /** @deprecated Use `collapsible="disabled"` instead */
  disabled?: boolean;
  extra?: React.ReactNode;
  collapsible?: CollapsibleType;
}

export const expandIconLevel1 = ({ isActive }: PanelProps) => {
  return isActive ? <DropdownIcon /> : <DropupIcon />;
};

export const expandIconLevel2 = ({ isActive }: PanelProps) => {
  return isActive ? <DropupV2Icon /> : <DropdownV2Icon />;
};

export const collapseProps: CollapseProps = {
  accordion: true,
  bordered: false,
  expandIconPosition: 'right',
};

export const CollapseLevel1Props: CollapseProps = {
  ...collapseProps,
  expandIcon: expandIconLevel1,
  className: `${dropdownStyle.dropdownList}`,
};

export const CollapseLevel2Props: CollapseProps = {
  ...collapseProps,
  expandIcon: expandIconLevel2,
  className: `${styles.secondDropdownList}`,
};

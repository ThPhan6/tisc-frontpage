import type { CollapseProps } from 'antd/lib/collapse/Collapse';

import { collapseProps, expandIconLevel1, expandIconLevel2 } from '@/components/Collapse/Expand';
import dropdownStyle from '@/components/CustomRadio/styles/dropdownList.less';

import styles from '../styles/index.less';

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

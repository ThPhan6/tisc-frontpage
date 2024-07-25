import type { CollapseProps } from 'antd/lib/collapse/Collapse';

import { collapseProps } from '@/components/Collapse/Expand';
import dropdownStyle from '@/components/CustomRadio/styles/dropdownList.less';

import styles from '../styles/index.less';

export const CollapseLevel1Props: CollapseProps = {
  ...collapseProps,
  className: `${dropdownStyle.dropdownList}`,
};

export const CollapseLevel2Props: CollapseProps = {
  ...collapseProps,
  className: `${styles.secondDropdownList}`,
};

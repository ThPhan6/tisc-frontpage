import type { CSSProperties, ReactNode } from 'react';

import { CheckboxChangeEvent } from 'antd/lib/checkbox';

export type CheckboxValue = {
  label: string | ReactNode;
  value: string | number;
  disabled?: boolean;
};

export type LabelType = 'label' | 'sub-label';

export interface CustomCheckboxProps {
  direction?: 'horizontal' | 'vertical';
  options: CheckboxValue[];
  otherInput?: boolean;
  clearOtherInput?: boolean;
  inputPlaceholder?: string;
  onChange?: (value: CheckboxValue[]) => void;
  onOneChange?: (e: CheckboxChangeEvent) => void;
  isCheckboxList?: boolean;
  selected?: CheckboxValue[];
  checkboxClass?: string;
  heightItem?: string;
  style?: CSSProperties;
  disabled?: boolean;
  filterBySelected?: boolean;
  chosenItems?: CheckboxValue[];
  additionalSelected?: string[];
  onChangeAdditionalSelected?: (value: string, option?: any, action?: 'add' | 'remove') => void;
  isExpanded?: boolean;
  onCollClick?: (value: string) => void;
  isLabel?: boolean;
}

export interface DropdownCheckboxItem {
  [key: string]: any;
  margin?: 8 | 12;
  options: CheckboxValue[];
}
export interface DropdownCheckboxListProps {
  selected?: CheckboxValue[];
  chosenItem?: CheckboxValue[];
  data: DropdownCheckboxItem[];
  renderTitle?: (data: DropdownCheckboxItem) => string | number | React.ReactNode;
  onChange?: (value: CheckboxValue[]) => void;
  onOneChange?: (e: any | { isSelectedAll: boolean; optionIds: string[] }) => void;
  noCollapse?: boolean;
  combinable?: boolean;
  showCount?: boolean;
  customClass?: string;
  canActiveMultiKey?: boolean;
  isSelectAll?: boolean;
  forceEnableCollapse?: boolean;
  showCollapseIcon?: boolean;
  additionalSelected?: string[];
  onChangeAdditionalSelected?: (value: string) => void;
  collapseLevel?: '1' | '2';
}

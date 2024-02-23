import type { CSSProperties, ReactNode } from 'react';

import { CheckboxChangeEvent } from 'antd/lib/checkbox';

export type CheckboxValue = {
  label: string | ReactNode;
  value: string | number;
  disabled?: boolean;
};

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
}

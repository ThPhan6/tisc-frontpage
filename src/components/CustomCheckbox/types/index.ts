import type { CSSProperties, ReactNode } from 'react';

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
  isCheckboxList?: boolean;
  selected?: CheckboxValue[];
  checkboxClass?: string;
  heightItem?: string;
  style?: CSSProperties;
}

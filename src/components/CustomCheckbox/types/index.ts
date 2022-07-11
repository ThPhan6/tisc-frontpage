import type { ReactNode } from 'react';

export type CheckboxValue = {
  label: string | ReactNode;
  value: string;
  disabled?: boolean;
  id?: string;
};

export interface CustomCheckboxProps {
  direction?: 'horizontal' | 'vertical';
  options: CheckboxValue[];
  otherInput?: boolean;
  inputPlaceholder?: string;
  onChange?: (value: CheckboxValue[]) => void;
  isCheckboxList?: boolean;
  selected?: CheckboxValue[];
  checkboxClass?: string;
  heightItem?: string;
}

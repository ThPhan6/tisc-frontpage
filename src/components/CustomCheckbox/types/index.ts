export type CheckboxValue = {
  label: string;
  value: string;
  disabled?: boolean;
};

export interface CustomCheckboxProps {
  direction?: 'horizontal' | 'vertical';
  options: CheckboxValue[];
  otherInput?: boolean;
  inputPlaceholder?: string;
  onChange?: (value: CheckboxValue[]) => void;
  isCheckboxList?: boolean;
  defaultValue?: CheckboxValue;
  checkboxClass?: string;
  heightItem?: string;
}

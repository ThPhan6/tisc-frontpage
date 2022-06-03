export type CheckboxValue = {
  label: string;
  value: string;
  disabled?: boolean;
};

export interface CustomCheckboxProps {
  direction?: 'horizontal' | 'vertical';
  checked?: boolean;
  options: CheckboxValue[];
  otherInput?: boolean;
  inputPlaceholder?: string;
  defaultChecked?: boolean;
  onChange?: (value: CheckboxValue) => void;
  isCheckboxList?: boolean;
}

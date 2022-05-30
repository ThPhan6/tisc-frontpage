import { CheckboxOptionType } from 'antd';

export type RadioValue = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface CustomRadioProps {
  direction?: 'horizontal' | 'vertical';
  options: RadioValue[];
  defaultValue?: RadioValue;
  value?: RadioValue;
  isRadioList?: boolean;
  otherInput?: boolean;
  onChange?: (value: CheckboxOptionType) => void;
  inputPlaceholder?: string;
  containerClass?: string;
}

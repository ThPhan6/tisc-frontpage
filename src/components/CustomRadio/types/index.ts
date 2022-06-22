import type { ReactNode } from 'react';

export type RadioValue = {
  value: string;
  label: string | ReactNode;
  disabled?: boolean;
};

export interface CustomRadioProps {
  direction?: 'horizontal' | 'vertical';
  options: RadioValue[];
  defaultValue?: RadioValue;
  value?: string | number;
  isRadioList?: boolean;
  otherInput?: boolean;
  onChange?: (value: RadioValue) => void;
  inputPlaceholder?: string;
  containerClass?: string;
}

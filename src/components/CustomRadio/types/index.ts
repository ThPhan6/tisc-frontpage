import type { CSSProperties, ReactNode } from 'react';

export type RadioValue = {
  value: string | boolean | number;
  label: string | ReactNode;
  disabled?: boolean;
  customClass?: string;
};

export type CustomRadioValue = RadioValue & { labelText: string };

export interface CustomRadioProps {
  direction?: 'horizontal' | 'vertical';
  options: RadioValue[];
  defaultValue?: RadioValue;
  value?: string | number | boolean;
  selected?: RadioValue;
  isRadioList?: boolean;
  otherInput?: boolean;
  onChange?: (value: RadioValue) => void;
  inputPlaceholder?: string;
  containerClass?: string;
  containerStyle?: CSSProperties;
  noPaddingLeft?: boolean;
  otherStickyBottom?: boolean;
  stickyTopItem?: boolean;
  optionStyle?: CSSProperties;
}

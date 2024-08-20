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
  clearOtherInput?: boolean;
  onChange?: (value: RadioValue) => void;
  inputPlaceholder?: string;
  containerClass?: string;
  containerStyle?: CSSProperties;
  noPaddingLeft?: boolean;
  otherStickyBottom?: boolean;
  stickyTopItem?: boolean;
  optionStyle?: CSSProperties;
  disabled?: boolean;
  additionalOtherClass?: string;
}

export interface DropdownRadioItem {
  [key: string]: any;
  margin?: 8 | 12;
  options: RadioValue[];
}

export interface DropdownRadioListProps {
  selected?: RadioValue; // current value select
  chosenItem?: RadioValue; // option selected // show active collapse
  data: DropdownRadioItem[] | undefined;
  renderTitle?: (data: DropdownRadioItem) => string | number | React.ReactNode;
  onChange?: (value: RadioValue) => void;
  noCollapse?: boolean;
  canActiveMultiKey?: boolean;
  radioDisabled?: boolean;
  forceEnableCollapse?: boolean;
  collapseLevel?: '1' | '2';
}

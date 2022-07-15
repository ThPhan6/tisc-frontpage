import type { InputProps } from 'antd';
import type { TextAreaProps } from 'antd/lib/input';

export interface FormGroupProps {
  layout?: 'horizontal' | 'vertical';
  formClass?: string;
  optional?: boolean;
  required?: boolean;
  tooltip?: string;
  label: string;
  iconTooltip?: JSX.Element;
  message?: string;
  messageType?: 'normal' | 'error' | 'warning';
  onClick?: () => void;
}

export interface CustomInputProps extends InputProps {
  containerClass?: string;
  focusColor?: 'primary' | 'secondary' | 'tertiary';
  theme?: 'dark' | 'default';
  borderBottomColor?: 'mono' | 'mono-medium' | 'white';
  status?: 'error' | 'warning' | '';
  fromLandingPage?: boolean;
  autoWidth?: boolean;
  fontLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  defaultWidth?: string | number;
}

export interface CustomTextAreaProps extends TextAreaProps {
  borderBottomColor?: 'mono' | 'mono-medium';
  maxHeight?: number;
  defaultHeight?: number;
}

export interface PhoneInputProps {
  codePlaceholder?: string;
  phonePlaceholder?: string;
  defaultValue?: PhoneInputValueProp;
  onChange?: (value: PhoneInputValueProp) => void;
  codeReadOnly?: boolean;
  phoneNumberReadOnly?: boolean;
  value?: PhoneInputValueProp;
  status?: 'error' | 'warning' | '';
  containerClass?: string;
  colorPlaceholder?: string;
}
export type PhoneInputValueProp = {
  zoneCode: string;
  phoneNumber: string;
};

export interface StatusProps {
  value: any;
  onClick: () => void;
  label: string;
  layout?: 'horizontal' | 'vertical';
  buttonName: string;
  text_1: string;
  text_2: string;
  formClass?: string;
  textClass?: string;
  activeButtonClass?: string;
  InActiveButtonClass?: string;
}

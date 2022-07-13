import type { InputProps } from 'antd';
import type { TextAreaProps } from 'antd/lib/input';

export interface FormGroupProps {
  layout?: 'horizontal' | 'vertical';
  formClass?: string;
  optional?: boolean;
  required?: boolean;
  tooltip?: string;
  label: string;
  message?: string;
  messageType?: 'normal' | 'error' | 'warning';
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
}
export type PhoneInputValueProp = {
  zoneCode: string;
  phoneNumber: string;
};

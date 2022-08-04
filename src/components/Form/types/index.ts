import { BodyTextProps, CustomTypography } from './../../Typography/types/index';
import type { InputProps } from 'antd';
import type { TextAreaProps } from 'antd/lib/input';
import { ReactNode } from 'react';

export interface FormGroupProps {
  layout?: 'horizontal' | 'vertical';
  formClass?: string;
  optional?: boolean;
  required?: boolean;
  tooltip?: string | JSX.Element;
  label: string | JSX.Element;
  labelColor?: CustomTypography['color'];
  message?: string;
  messageType?: 'normal' | 'error' | 'warning';
  iconTooltip?: ReactNode;
  customIcon?: ReactNode;
  onClick?: () => void;
  bodyText?: BodyTextExtraProps;
  placementBottomWidth?: string;
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom';
}

export interface BodyTextExtraProps extends BodyTextProps {
  text: string | JSX.Element;
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
  maxWords?: number;
  inputValidation?: (value: string) => boolean;
}

export interface CustomTextAreaProps extends TextAreaProps {
  borderBottomColor?: 'mono' | 'mono-medium';
  maxHeight?: number;
  defaultHeight?: number;
  boxShadow?: boolean;
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
  deleteIcon?: boolean;
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
  title?: string | ReactNode;
}

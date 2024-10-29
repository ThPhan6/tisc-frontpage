import { CSSProperties, ReactNode } from 'react';

import type { InputProps } from 'antd';
import type { TextAreaProps } from 'antd/lib/input';

import { BodyTextProps, CustomTypography } from '@/components/Typography/types/index';

export interface FormGroupProps {
  layout?: 'horizontal' | 'vertical';
  formClass?: string;
  customClass?: string;
  optional?: boolean;
  required?: boolean;
  tooltip?: string | JSX.Element;
  label: string | JSX.Element;
  labelColor?: CustomTypography['color'];
  labelFontSize?: BodyTextProps['level'];
  message?: string;
  messageType?: 'normal' | 'error' | 'warning';
  iconTooltip?: ReactNode;
  customIcon?: ReactNode;
  onClick?: () => void;
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
  style?: CSSProperties;
  noColon?: boolean;
  labelWidth?: any;
}

export interface TextFormProps extends FormGroupProps {
  children: string | ReactNode;
  fontLevel?: CustomInputProps['fontLevel'];
  fontFamily?: BodyTextProps['fontFamily'];
  bodyTextClass?: string;
  formClass?: string;
  boxShadow?: boolean;
}

export interface CustomInputProps extends InputProps {
  containerClass?: string;
  containerStyles?: CSSProperties;
  focusColor?: 'primary' | 'secondary' | 'tertiary';
  theme?: 'dark' | 'default';
  borderBottomColor?: 'mono' | 'mono-medium' | 'white' | 'light';
  status?: 'error' | 'warning' | '';
  message?: string;
  messageType?: 'normal' | 'warning' | 'error';
  fromLandingPage?: boolean;
  autoWidth?: boolean;
  fontLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  defaultWidth?: string | number;
  maxWords?: number;
  additionalInputClass?: string;
  ref?: any;
  inputValidation?: (value: string) => boolean;
}

export interface CustomTextAreaProps extends TextAreaProps {
  borderBottomColor?: 'mono' | 'mono-medium' | 'light' | '';
  boxShadow?: boolean;
  autoResize?: boolean;
  customClass?: string;
  maxWords?: number;
  customStyles?: CSSProperties;
  styles?: CSSProperties;
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
  priceRate?: number;
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
  toolTipTitle?: string | ReactNode;
  alignOffset?: [number, number];
  disabled?: boolean;
}

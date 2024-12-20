import { CSSProperties, ReactNode } from 'react';

import { ColProps } from 'antd';

export interface EntryFormWrapperProps extends ColProps {
  handleSubmit?: () => void;
  handleCancel?: () => void;
  handleDelete?: () => void;
  customClass?: string;
  contentClass?: string;
  contentStyles?: CSSProperties;
  textAlignTitle?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify';
  title?: any;
  titleStyles?: CSSProperties;
  titleClassName?: string;
  disableCancelButton?: boolean;
  disableSubmitButton?: boolean;
  headerContent?: any;
  footerContent?: any;
  submitButtonStatus?: boolean;
  footerClass?: string;
  footerStyles?: CSSProperties;
  extraFooterButton?: ReactNode;
  entryFormTypeOnMobile?: 'create' | 'edit' | '';
  hideHeader?: boolean;
  hideFooter?: boolean;
  isRenderFooterContent?: boolean;
  customStyles?: CSSProperties;
  cancelLabel?: string;
  submitLabel?: string;
}

export interface FormNameInputProps {
  handleOnClickAddIcon?: () => void;
  title: string;
  placeholder?: string;
  onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue?: string;
  customClass?: string;
}

export interface MainContentProps {
  hasHeight?: boolean;
  noWrap?: boolean;
  customClass?: string;
}

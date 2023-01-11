import { CSSProperties, ReactNode } from 'react';

export interface EntryFormWrapperProps {
  handleSubmit?: () => void;
  handleCancel?: () => void;
  handleDelete?: () => void;
  customClass?: string;
  contentClass?: string;
  contentStyles?: CSSProperties;
  textAlignTitle?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify';
  title?: string;
  titleStyles?: CSSProperties;
  titleClassName?: string;
  disableCancelButton?: boolean;
  disableSubmitButton?: boolean;
  headerContent?: any;
  footerContent?: any;
  submitButtonStatus?: boolean;
  extraFooterButton?: ReactNode;
  entryFormTypeOnMobile?: 'create' | 'edit' | '';
  hideAction?: boolean;
}

export interface FormNameInputProps {
  HandleOnClickAddIcon?: () => void;
  title: string;
  placeholder?: string;
  onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue?: string;
  customClass?: string;
}

export interface MainContentProps {
  hasHeight?: boolean;
  noWrap?: boolean;
}

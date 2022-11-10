export interface EntryFormWrapperProps {
  handleSubmit?: () => void;
  handleCancel?: () => void;
  customClass?: string;
  contentClass?: string;
  textAlignTitle?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify';
  title?: string;
  disableCancelButton?: boolean;
  disableSubmitButton?: boolean;
  headerContent?: any;
  footerContent?: any;
  submitButtonStatus?: boolean;
  contentSubmitButton?: string;
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

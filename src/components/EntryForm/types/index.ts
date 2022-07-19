export interface EntryFormWrapperProps {
  handleSubmit?: () => void;
  handleCancel?: () => void;
  customClass?: string;
  contentClass?: string;
  textAlignTitle?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify';
  title?: string;
  headerContent?: any;
  footerContent?: any;
  handleDisabledCancel?: boolean;
  handleDisabledSubmit?: boolean;
  submitButtonStatus?: boolean;
}

export interface FormNameInputProps {
  HandleOnClickAddIcon?: () => void;
  title: string;
  placeholder?: string;
  onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue?: string;
  customClass?: string;
}

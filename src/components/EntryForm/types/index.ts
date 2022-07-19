export interface EntryFormWrapperProps {
  handleSubmit?: () => void;
  handleCancel?: () => void;
  customClass?: string;
  contentClass?: string;
  title?: string;
  disableCancelButton?: boolean;
  disableSubmitButton?: boolean;
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

export interface EntryFormWrapperProps {
  handleSubmit?: () => void;
  handleCancel?: () => void;
  customClass?: string;
  contentClass?: string;
  title?: string;
}

export interface FormNameInputProp {
  HandleOnClickAddIcon?: () => void;
  title: string;
  placeholder?: string;
  onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue?: string;
  customClass?: string;
}

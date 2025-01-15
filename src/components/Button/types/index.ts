export interface CustomButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  buttonClass?: string;
  properties?: 'standard' | 'warning' | 'circle' | 'square' | 'rounded';
  variant?: 'primary' | 'dashed' | 'link' | 'text' | 'secondary' | 'primaryDark';
  size?: 'small' | 'medium' | 'large';
  icon?: JSX.Element;
  width?: string;
  height?: string;
  active?: boolean;
}

export interface CustomSaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isSuccess?: boolean;
  onClick?: () => void;
  customClass?: string;
  contentButton?: string;
}

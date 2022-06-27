export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonClass?: string;
  properties?: 'standard' | 'warning' | 'circle' | 'square';
  variant?: 'primary' | 'dashed' | 'link' | 'text' | 'secondary' | 'primaryDark';
  size?: 'small' | 'medium' | 'large';
  icon?: JSX.Element;
  width?: string;
  height?: string;
}

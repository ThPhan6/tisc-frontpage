export interface LoginModalProps {
  theme?: 'default' | 'dark';
  visible: {
    value: boolean;
    setValue: (value: boolean) => void;
  };
}

export type InputValueProp = {
  email: string;
  password: string;
};

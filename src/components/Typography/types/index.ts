export interface CustomTypography extends React.HTMLAttributes<HTMLParagraphElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  customClass?: string;
  color?:
    | 'primary-color'
    | 'primary-color-dark'
    | 'primary-color-medium'
    | 'primary-color-light'
    | 'secondary-color'
    | 'secondary-color-medium'
    | 'secondary-color-light'
    | 'tertiary-color'
    | 'tertiary-color-medium'
    | 'tertiary-color-light'
    | 'mono-color'
    | 'mono-color-dark'
    | 'mono-color-medium'
    | 'mono-color-light';
}

export interface BodyTextProps extends CustomTypography {
  level?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  fontFamily?: 'Roboto' | 'Cormorant-Garamond';
}

export interface MainTitleProps extends CustomTypography {
  textAlign?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify';
  level?: 1 | 2 | 3 | 4;
}

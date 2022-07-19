export interface CustomTypography extends React.HTMLAttributes<HTMLParagraphElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  customClass?: string;
  color?: string;
}

export interface BodyTextProps extends CustomTypography {
  level?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  fontFamily?: 'Roboto' | 'Cormorant-Garamond';
}

export interface MainTitleProps extends CustomTypography {
  textAlign?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify';
  level?: 1 | 2 | 3 | 4;
}

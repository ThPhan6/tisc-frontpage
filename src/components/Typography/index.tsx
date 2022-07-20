import type { FC } from 'react';
import type { BodyTextProps, CustomTypography, MainTitleProps } from './types';
import Style from './styles/index.less';

export const Title: FC<CustomTypography> = ({
  color,
  customClass = '',
  level = 1,
  children,
  ...props
}) => {
  const setLevel = () => {
    return Style[`title${level}`];
  };

  const classNameTitle = `${setLevel()}`;
  return (
    <p {...props} className={`${classNameTitle} ${customClass}`} style={{ color: color }}>
      {children}
    </p>
  );
};

export const BodyText: FC<BodyTextProps> = ({
  color,
  fontFamily = 'Cormorant-Garamond',
  customClass = '',
  level = 1,
  children,
  ...props
}) => {
  const setLevel = () => {
    switch (fontFamily) {
      case 'Roboto':
        return Style[`bodyText${level}`];
      default:
        return Style[`bodyTextCormorant${level >= 5 ? 5 : level}`];
    }
  };

  const classNameBodyText = `${setLevel()}`;
  return (
    <p {...props} className={`${classNameBodyText} ${customClass}`} style={{ color: color }}>
      {children}
    </p>
  );
};

export const MainTitle: FC<MainTitleProps> = ({
  color,
  customClass = '',
  level = 1,
  children,
  textAlign = 'left',
  ...props
}) => {
  const setLevel = () => {
    return Style[`mainTitle${level}`];
  };

  const classNameMainTitle = `${setLevel()}`;
  return (
    <p
      {...props}
      className={`${classNameMainTitle} ${customClass}`}
      style={{ color: color, textAlign: textAlign }}
    >
      {children}
    </p>
  );
};

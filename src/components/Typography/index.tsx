import type { FC } from 'react';
import type { BodyTextProps, CustomTypography, MainTitleProps } from './types';
import Style from './styles/index.less';
export const Title: FC<CustomTypography> = ({
  color = 'mono-color',
  customClass = '',
  level = 1,
  children,
  style,
  ...props
}) => {
  const setLevel = () => {
    return Style[`title${level}`];
  };
  const classNameTitle = `${setLevel()}`;
  return (
    <p
      {...props}
      className={`${classNameTitle} ${customClass} ${color}`}
      style={{ color, ...style }}
    >
      {children}
    </p>
  );
};
export const BodyText: FC<BodyTextProps> = ({
  color = 'mono-color',
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
    <p {...props} className={`${classNameBodyText} ${customClass} ${color}`}>
      {children}
    </p>
  );
};

export const RobotoBodyText: FC<BodyTextProps> = ({ children, ...props }) => {
  return (
    <BodyText fontFamily="Roboto" {...props}>
      {children}
    </BodyText>
  );
};

export const MainTitle: FC<MainTitleProps> = ({
  color = 'mono-color',
  customClass = '',
  level = 1,
  children,
  textAlign,
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
      style={{
        color: color,
        textAlign: textAlign,
      }}
    >
      {children}
    </p>
  );
};

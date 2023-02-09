import React from 'react';

import type { CustomButtonProps } from './types';

import styles from './styles/index.less';

const CustomButton: React.FC<CustomButtonProps> = ({
  properties = 'standard',
  variant = 'primary',
  size = 'medium',
  buttonClass,
  children,
  height,
  width,
  icon,
  active,
  ...props
}) => {
  const setProperties = () => {
    switch (properties) {
      case 'warning':
        return styles[`${variant}Warning`];
      case 'circle':
        return `${styles[`${variant}Standard`]} ${styles.circle}`;
      case 'rounded':
        return `${styles[`${variant}Standard`]} ${styles.rounded}`;
      default:
        return styles[`${variant}Standard`];
    }
  };

  const setDisabled = () => {
    if (props.disabled) {
      switch (variant) {
        case 'link':
          return `${styles.linkDisabled}`;
        case 'text':
          return `${styles.linkDisabled}`;
        case 'dashed':
          return `${styles.dashedDisabled}`;
        default:
          return `${styles.disabled}`;
      }
    }
    return '';
  };

  const setSize = () => {
    switch (size) {
      case 'large':
        return ['square', 'circle'].includes(properties) ? styles.largeShapeSize : styles.largeSize;
      case 'small':
        return ['square', 'circle'].includes(properties) ? styles.smallShapeSize : styles.smallSize;
      default:
        return ['square', 'circle'].includes(properties)
          ? styles.mediumShapeSize
          : styles.mediumSize;
    }
  };

  const classNameButton = `${
    styles.container
  } ${setSize()} ${setProperties()} ${setDisabled()} ${buttonClass} ${active ? styles.active : ''}`;

  return (
    <button
      {...props}
      className={classNameButton}
      style={{ ...props.style, width: width, height: height }}>
      {icon}
      {children}
    </button>
  );
};

export default CustomButton;

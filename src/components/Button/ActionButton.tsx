import React from 'react';

import { BodyText } from '../Typography';
import styles from './styles/index.less';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  onClick: (e: React.ChangeEvent<any>) => void;
  className?: string;
  title: string;
  active?: boolean;
  short?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  onClick,
  className,
  title,
  active,
  short,
  style,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.container} ${styles.actionButton} ${className ?? ''} ${
        active ? styles.active : ''
      }`}
      style={{
        ...style,
        padding: short ? '0 24px 0 0' : undefined,
      }}
      {...props}>
      {icon}

      {short ? null : (
        <BodyText level={6} fontFamily="Roboto">
          {title}
        </BodyText>
      )}
    </button>
  );
};

export default ActionButton;

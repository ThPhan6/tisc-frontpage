import React from 'react';
import { BodyText } from '../Typography';
import styles from './styles/index.less';

interface ActionButtonProps {
  icon: React.ReactNode;
  onClick: (e: React.ChangeEvent<any>) => void;
  className?: string;
  title: string;
  active?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, onClick, className, title, active }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.container} ${styles.actionButton} ${className ?? ''} ${
        active ? styles.active : ''
      }`}
    >
      {icon}

      <BodyText level={6} fontFamily="Roboto">
        {title}
      </BodyText>
    </button>
  );
};

export default ActionButton;

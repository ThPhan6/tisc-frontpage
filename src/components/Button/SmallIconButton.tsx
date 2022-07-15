import React from 'react';
import styles from './styles/smallIconButton.less';

interface ISmallIconButton {
  icon: React.ReactNode;
  onClick: (e: React.ChangeEvent<any>) => void;
  className?: string;
}

const SmallIconButton: React.FC<ISmallIconButton> = ({ icon, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={className ? `${styles.smallBtnContainer} ${className}` : styles.smallBtnContainer}
    >
      {icon}
    </button>
  );
};

export default SmallIconButton;

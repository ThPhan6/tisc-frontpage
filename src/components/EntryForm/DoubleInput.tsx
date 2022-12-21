import { FC } from 'react';

import { CustomInputProps } from '../Form/types';

import { CustomInput } from '../Form/CustomInput';
import styles from './styles/DoubleInput.less';

interface DoubleInputProps extends CustomInputProps {
  leftIcon?: React.ReactNode;
  firstValue: string;
  firstPlaceholder: string;
  firstOnChange: (firstValue: React.ChangeEvent<HTMLInputElement>) => void;
  secondValue: string;
  secondPlaceholder: string;
  secondOnChange: (firstValue: React.ChangeEvent<HTMLInputElement>) => void;
  rightIcon?: React.ReactNode;
  doubleInputClass?: string;
}

export const DoubleInput: FC<DoubleInputProps> = ({
  leftIcon,
  rightIcon,
  firstValue,
  firstPlaceholder,
  firstOnChange,
  secondValue,
  secondPlaceholder,
  secondOnChange,
  doubleInputClass = '',
  ...props
}) => {
  return (
    <div className={`${styles.info} ${doubleInputClass}`}>
      <div className="flex-start">{leftIcon}</div>
      <CustomInput
        {...props}
        containerClass={styles.firstInput}
        placeholder={firstPlaceholder}
        value={firstValue}
        onChange={(e) => {
          e.stopPropagation();
          firstOnChange(e);
        }}
      />
      <CustomInput
        {...props}
        placeholder={secondPlaceholder}
        value={secondValue}
        onChange={(e) => {
          e.stopPropagation();
          secondOnChange(e);
        }}
      />
      <div className="flex-start">{rightIcon}</div>
    </div>
  );
};

import { FC } from 'react';
import styles from './styles/FormNameInput.less';
import { MainTitle } from '../Typography';
import { FormNameInputProps } from './types';
import { ReactComponent as AddIcon } from '@/assets/icons/square-plus-icon.svg';
import { CustomInput } from '../Form/CustomInput';

export const FormNameInput: FC<FormNameInputProps> = ({
  HandleOnClickAddIcon,
  title,
  placeholder,
  onChangeInput,
  inputValue,
  customClass,
}) => {
  return (
    <div className={`${styles.form_container} ${customClass}`}>
      <div className={styles.header}>
        <MainTitle customClass={styles.header__title} level={3}>
          {title}
        </MainTitle>
        <AddIcon className={styles.header__icon} onClick={HandleOnClickAddIcon} />
      </div>
      <CustomInput
        placeholder={placeholder}
        borderBottomColor="mono"
        containerClass={styles.input}
        onChange={onChangeInput}
        value={inputValue}
      />
    </div>
  );
};

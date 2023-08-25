import { FC, useContext } from 'react';

import { ReactComponent as CardImageIcon } from '@/assets/icons/card-image-icon-18.svg';
import { ReactComponent as ListIcon } from '@/assets/icons/hamburger-menu-icon-18.svg';
import { ReactComponent as AddIcon } from '@/assets/icons/square-plus-icon.svg';

import { FormOptionGroupHeaderContext } from '../../hook';

import { FormNameInputProps } from '@/components/EntryForm/types';

import { CustomInput } from '@/components/Form/CustomInput';
import { MainTitle } from '@/components/Typography';

import styles from './FormOptionNameInput.less';

export const FormOptionNameInput: FC<FormNameInputProps> = ({
  handleOnClickAddIcon,
  title,
  placeholder,
  onChangeInput,
  inputValue,
  customClass = '',
}) => {
  const { setMode, mode } = useContext(FormOptionGroupHeaderContext);

  return (
    <div className={`${styles.option_form_container} ${customClass}`}>
      <div className={styles.header}>
        <MainTitle customClass={styles.header__title} level={3}>
          {title}
        </MainTitle>
        <CustomInput
          placeholder={placeholder}
          containerClass={styles.input}
          onChange={onChangeInput}
          value={inputValue}
        />

        <div className="flex-end">
          <AddIcon className={styles.header__icon} onClick={handleOnClickAddIcon} />
          <ListIcon
            className={`${styles.header__icon} ${mode === 'list' ? 'list-icon' : ''}`}
            onClick={() => {
              setMode('list');
            }}
          />
          <CardImageIcon
            className={`${styles.header__icon} ${mode === 'card' ? 'card-icon' : ''}`}
            onClick={() => {
              setMode('card');
            }}
          />
        </div>
      </div>
    </div>
  );
};

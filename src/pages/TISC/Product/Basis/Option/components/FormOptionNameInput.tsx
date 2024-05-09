import { FC, useContext } from 'react';

import { ReactComponent as CardImageIcon } from '@/assets/icons/card-image-icon-18.svg';
import { ReactComponent as ListIcon } from '@/assets/icons/hamburger-menu-icon-18.svg';
import { ReactComponent as AddIcon } from '@/assets/icons/square-plus-icon.svg';

import { useBrandAttributeParam, useCheckBrandAttributePath } from '../../../BrandAttribute/hook';
import { FormOptionGroupHeaderContext, useCheckBasicOptionForm } from '../../hook';

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
  const isBasicOption = useCheckBasicOptionForm();
  const { id: idBasis } = useBrandAttributeParam();
  const { componentCreatePath } = useCheckBrandAttributePath();
  const isCreateComponent = location.pathname === componentCreatePath && !idBasis;
  const { setMode, mode, hideTitleAddIcon, hideTitleInput } = useContext(
    FormOptionGroupHeaderContext,
  );
  return (
    <div className={`${styles.option_form_container} ${customClass}`}>
      <div className={styles.header}>
        <MainTitle customClass={styles.header__title} level={3}>
          {title}
        </MainTitle>
        {hideTitleInput ? null : (
          <CustomInput
            placeholder={placeholder}
            containerClass={styles.input}
            onChange={onChangeInput}
            value={inputValue}
          />
        )}

        <div className="flex-end">
          {hideTitleAddIcon ? null : isCreateComponent ? (
            <AddIcon className={styles.header__icon} onClick={handleOnClickAddIcon} />
          ) : null}
          {isBasicOption ? (
            <ListIcon
              className={`${styles.header__icon} ${mode === 'list' ? 'list-icon' : ''}`}
              onClick={() => {
                setMode?.('list');
              }}
            />
          ) : null}

          {isBasicOption ? (
            <CardImageIcon
              className={`${styles.header__icon} ${mode === 'card' ? 'card-icon' : ''}`}
              onClick={() => {
                setMode?.('card');
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

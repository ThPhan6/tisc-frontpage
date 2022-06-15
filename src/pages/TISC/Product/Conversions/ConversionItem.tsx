import { BodyText } from '@/components/Typography';
import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as SwapIcon } from '@/assets/icons/swap-horizontal-icon.svg';
import { CustomInput } from '@/components/Form/CustomInput';
import styles from './styles/ConversionItem.less';
import { FC, useEffect, useState } from 'react';
import {
  ConversionItemProps,
  conversionValueDefault,
  ConversionValueProp,
  ElementInputProp,
} from './types';
import classNames from 'classnames';
import { isEqual } from 'lodash';

const ElementInput: FC<ElementInputProp> = ({ order, onChange }) => {
  return (
    <div className={styles.element}>
      <BodyText level={3}>C:{order}</BodyText>
      <CustomInput
        placeholder={`formula ${order}`}
        name={`formula_${order}`}
        size="small"
        containerClass={styles.element__input_formula}
        onChange={onChange}
      />
      <CustomInput
        placeholder="unit"
        name={`unit_${order}`}
        size="small"
        containerClass={classNames(styles.element__input_unit)}
        onChange={onChange}
      />
    </div>
  );
};

export const ConversionItem: FC<ConversionItemProps> = ({
  value,
  onChangeValue,
  handleOnClickDelete,
}) => {
  const [inputValue, setInputValue] = useState<ConversionValueProp>(conversionValueDefault);

  useEffect(() => {
    if (value) {
      setInputValue({ ...value });
    }
  }, [!isEqual(value, inputValue)]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = {
      ...inputValue,
      [e.target.name]: e.target.value,
    };
    setInputValue(newInputValue);
    if (onChangeValue) {
      onChangeValue({ ...newInputValue });
    }
  };

  return (
    <div className={styles.conversion_container}>
      <div className={styles.field}>
        <div className={styles.field__name}>
          <BodyText level={3}>Between:</BodyText>
          <CustomInput
            onChange={handleOnChange}
            placeholder="name 1"
            name="name_1"
            size="small"
            containerClass={styles.field__name_input}
          />
          <SwapIcon />
          <CustomInput
            onChange={handleOnChange}
            placeholder="name 2"
            name="name_2"
            size="small"
            containerClass={styles.field__name_input}
          />
        </div>
        <ActionDeleteIcon className={styles.field__delete_icon} onClick={handleOnClickDelete} />
      </div>
      <div className={styles.form}>
        <ElementInput order={1} onChange={handleOnChange} />
        <ElementInput order={2} onChange={handleOnChange} />
      </div>
    </div>
  );
};

import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as AddIcon } from '@/assets/icons/square-plus-icon.svg';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

import classNames from 'classnames';
import { isEqual } from 'lodash';
import { FC, useEffect, useState } from 'react';
import styles from './styles/ConversionItem.less';
import {
  ConversionItemProps,
  conversionValueDefault,
  ConversionValueProp,
  ElementInputProp,
  ElementInputValueProp,
} from './types';

const ElementInput: FC<ElementInputProp> = ({ order, onChange }) => {
  return (
    <div className={styles.element}>
      <BodyText level={3}>O{order}:</BodyText>
      <CustomInput
        placeholder="value"
        name={`value_${order}`}
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

  const [elementInputs, setElementInputs] = useState<ElementInputValueProp[]>([]);

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

  const idElementInput = Math.random();
  const handleOnClickAddElementInput = () => {
    setElementInputs([
      ...elementInputs,
      { id: idElementInput.toString(), value_1: '', value_2: '', unit_1: '', unit_2: '' },
    ]);
  };

  const handleOnClickDeleteElement = (index: number) => {
    const newElementInputs = [...elementInputs];
    newElementInputs.splice(index, 1);
    setElementInputs(newElementInputs);
  };

  return (
    <div className={styles.conversion_container}>
      <div className={styles.field}>
        <div className={styles.field__name}>
          <BodyText level={3}>Option Name</BodyText>
        </div>
        <AddIcon className={styles.header__icon} onClick={handleOnClickAddElementInput} />
      </div>
      <div className={styles.field}>
        <div className={styles.field__name}>
          <CustomInput
            placeholder="type option name"
            name="input"
            size="small"
            containerClass={styles.element__input_formula}
            onChange={handleOnChange}
          />
        </div>
        <ActionDeleteIcon className={styles.field__delete_icon} onClick={handleOnClickDelete} />
      </div>
      {elementInputs.map((elementInput, index) => (
        <div key={elementInput.id} className={styles.element_input}>
          <div className={styles.form}>
            <ElementInput order={1} onChange={handleOnChange} />
            <ElementInput order={2} onChange={handleOnChange} />
          </div>
          <div>
            <ActionDeleteIcon
              className={styles.field__delete_icon}
              onClick={() => handleOnClickDeleteElement(index)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

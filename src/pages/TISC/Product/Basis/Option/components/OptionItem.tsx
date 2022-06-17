import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as AddElementIcon } from '@/assets/icons/circle-plus.svg';
import { ReactComponent as ActionDownUpIcon } from '@/assets/icons/action-down-up.svg';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import { FC, useEffect, useState } from 'react';
import styles from '../styles/OptionItem.less';
import {
  OptionItemProps,
  elementInputValueDefault,
  ElementInputProp,
  ElementInputValueProp,
} from '../types';
import { Radio } from 'antd';

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

export const OptionItem: FC<OptionItemProps> = ({ value, onChangeValue, handleOnClickDelete }) => {
  const [inputValue, setInputValue] = useState<ElementInputValueProp>(elementInputValueDefault);

  const [elementInputs, setElementInputs] =
    useState<ElementInputValueProp>(elementInputValueDefault);

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

  const handleOnClickAddElementInput = () => {
    const newElementInputs = {
      ...elementInputs,
      subs: [...elementInputs.subs, { name: '' }],
    };
    setElementInputs(newElementInputs);
  };

  const handleOnClickDeleteElement = (index: number) => {
    const newElementInputs = [...elementInputs.subs];
    newElementInputs.splice(index, 1);
    setElementInputs({ ...elementInputs, subs: newElementInputs });
  };

  return (
    <div className={styles.conversion_container}>
      <div className={styles.field}>
        <div className={styles.field__name}>
          <div className={styles.field__name_title}>
            <BodyText level={3}>Option Name</BodyText>
            <ActionDownUpIcon className={styles.header__icon} />
          </div>
          <div className={styles.field__name_image}>
            <BodyText level={7}>Image</BodyText>
            <Radio />
          </div>
        </div>
        <AddElementIcon className={styles.header__icon} onClick={handleOnClickAddElementInput} />
      </div>
      <div className={styles.field}>
        <div className={styles.field__name}>
          <CustomInput
            placeholder="type option name"
            name="name"
            size="small"
            containerClass={styles.element__input_formula}
            onChange={handleOnChange}
          />
        </div>
        <ActionDeleteIcon className={styles.field__delete_icon} onClick={handleOnClickDelete} />
      </div>
      {elementInputs.subs.map((elementInput, index) => (
        <div key={index} className={styles.element_input}>
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

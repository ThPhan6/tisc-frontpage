import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as CirclePlusIcon } from '@/assets/icons/circle-plus.svg';
import { ReactComponent as ArrowIcon } from '@/assets/icons/drop-down-icon.svg';

import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';
import classNames from 'classnames';
import { isEmpty, isEqual } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import styles from '../styles/OptionItem.less';
import {
  ElementInputProp,
  elementInputValueDefault,
  SubOptionProps,
  subOptionValueDefault,
  SubOptionValueProps,
} from '../types';
import { Collapse, Radio } from 'antd';

const ElementInput: FC<ElementInputProp> = ({ order, valueElementInput, onChangeElementInput }) => {
  return (
    <div className={styles.element}>
      <BodyText level={3}>O{order}:</BodyText>
      <CustomInput
        placeholder="value"
        name={`value_${order}`}
        size="small"
        containerClass={styles.element__input_formula}
        onChange={onChangeElementInput}
        value={valueElementInput[`value_${order}`]}
      />
      <CustomInput
        placeholder="unit"
        name={`unit_${order}`}
        size="small"
        containerClass={classNames(styles.element__input_unit)}
        onChange={onChangeElementInput}
        value={valueElementInput[`unit_${order}`]}
      />
    </div>
  );
};

export const OptionItem: FC<SubOptionProps> = ({ value, onChangeValue, handleOnClickDelete }) => {
  const [subOptions, setSubOptions] = useState<SubOptionValueProps>(subOptionValueDefault);
  const [activeKey, setActiveKey] = useState<string[]>([]);

  useEffect(() => {
    if (value) {
      setSubOptions({ ...value });
    }
  }, [!isEqual(value, subOptions)]);

  const handleOnChangeOptionNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSubOptions = {
      ...subOptions,
      name: e.target.value,
    };
    setSubOptions(newSubOptions);
    if (onChangeValue) {
      onChangeValue({ ...newSubOptions });
    }
  };

  const handleOnChangeElementInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newSubOptions = [...subOptions.subs];
    newSubOptions[index] = { ...newSubOptions[index], [e.target.name]: e.target.value };
    setSubOptions({ ...subOptions, subs: newSubOptions });
    onChangeValue({ ...subOptions, subs: newSubOptions });
  };

  const handleOnClickAddElementInput = () => {
    const newSubOptions = {
      ...subOptions,
      subs: [...subOptions.subs, elementInputValueDefault],
    };
    setActiveKey(['1']);
    setSubOptions(newSubOptions);
    onChangeValue({ ...newSubOptions });
  };

  const handleOnClickDeleteElement = (index: number) => {
    const newSubOptions = [...subOptions.subs];
    newSubOptions.splice(index, 1);
    setSubOptions({ ...subOptions, subs: newSubOptions });
    onChangeValue({ ...subOptions, subs: newSubOptions });
  };

  const renderPanelHeader = () => {
    return (
      <div className={styles.panel_header}>
        <div className={styles.panel_header__field}>
          <div className={styles.panel_header__field_right}>
            <div
              className={styles.panel_header__field_title}
              onClick={() => {
                setActiveKey(isEmpty(activeKey) ? ['1'] : []);
              }}
            >
              <BodyText
                level={3}
                customClass={isEmpty(activeKey) ? styles.font_weight_300 : styles.font_weight_600}
              >
                Option Name
              </BodyText>
              <ArrowIcon
                className={styles.panel_header__field_title_icon}
                style={{
                  transform: `rotate(${isEmpty(activeKey) ? '0' : '180'}deg)`,
                }}
              />
            </div>
            <div className={styles.panel_header__field_image}>
              <BodyText level={7}>Image</BodyText>
              <Radio />
            </div>
          </div>
          <CirclePlusIcon
            className={styles.panel_header__field_add}
            onClick={handleOnClickAddElementInput}
          />
        </div>
        <div className={styles.panel_header__input}>
          <CustomInput
            placeholder="type option name"
            name="name"
            size="small"
            containerClass={styles.panel_header__input_value}
            onChange={handleOnChangeOptionNameInput}
            value={subOptions.name}
          />
          <ActionDeleteIcon
            className={styles.panel_header__input_delete_icon}
            onClick={handleOnClickDelete}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.collapse_container}>
      <Collapse ghost activeKey={activeKey}>
        <Collapse.Panel
          style={{
            borderBottom: `0.5px solid ${isEmpty(activeKey) ? '#BFBFBF' : '#000'}`,
            paddingBottom: '8px',
            borderRadius: '0px',
          }}
          header={renderPanelHeader()}
          key="1"
          showArrow={false}
        >
          <div className={styles.sub_wrapper}>
            {subOptions.subs.map((elementInput, index) => (
              <div key={index} className={styles.element_input}>
                <div className={styles.form}>
                  <ElementInput
                    order={1}
                    valueElementInput={elementInput}
                    onChangeElementInput={(e) => handleOnChangeElementInput(e, index)}
                  />
                  <ElementInput
                    order={2}
                    valueElementInput={elementInput}
                    onChangeElementInput={(e) => handleOnChangeElementInput(e, index)}
                  />
                </div>
                <div className={styles.delete_icon}>
                  <ActionDeleteIcon
                    className={styles.panel_header__input_delete_icon}
                    onClick={() => handleOnClickDeleteElement(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

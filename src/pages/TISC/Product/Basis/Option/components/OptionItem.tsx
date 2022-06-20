import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as CirclePlusIcon } from '@/assets/icons/circle-plus.svg';
import { ReactComponent as ArrowIcon } from '@/assets/icons/drop-down-icon.svg';
import image from '@/assets/icons/image.png';

import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import React, { FC, useState } from 'react';
import styles from '../styles/OptionItem.less';
import { ISubBasisOption, IBasisOptionSubForm } from '../types';
import { Collapse, Radio } from 'antd';

interface IOptionItem {
  subOption: IBasisOptionSubForm;
  handleChangeSubItem: (changedSubs: IBasisOptionSubForm) => void;
  handleDeleteSubOption: () => void;
}
interface ISubItemOption {
  order: number;
  subItemOption: ISubBasisOption;
  onChange: (subItemOption: ISubBasisOption) => void;
}

const DEFAULT_SUB_OPTION_ITEM: ISubBasisOption = {
  image: '',
  value_1: '',
  value_2: '',
  unit_2: '',
  unit_1: '',
};

const SubItemOption: FC<ISubItemOption> = ({ order, subItemOption, onChange }) => {
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...subItemOption,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.element}>
      <BodyText level={3}>O{order}:</BodyText>
      <CustomInput
        placeholder="value"
        name={`value_${order}`}
        size="small"
        containerClass={styles.element__input_formula}
        onChange={handleChangeInput}
        value={subItemOption[`value_${order}`]}
      />
      <CustomInput
        placeholder="unit"
        name={`unit_${order}`}
        size="small"
        containerClass={classNames(styles.element__input_unit)}
        onChange={handleChangeInput}
        value={subItemOption[`unit_${order}`]}
      />
    </div>
  );
};

export const OptionItem: FC<IOptionItem> = (props) => {
  const { subOption, handleChangeSubItem, handleDeleteSubOption } = props;
  const [activeKey, setActiveKey] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState<boolean>(false);

  const handleActiveKeyToCollapse = () => {
    setActiveKey(isEmpty(activeKey) ? ['1'] : []);
  };

  const handleOnClickAddImage = () => {
    if (activeImage) {
      setActiveImage(false);
    } else {
      setActiveImage(true);
    }
  };

  const addNewSubOptionItem = () => {
    /// default open option item list when add new
    setActiveKey(['1']);
    /// add new sub option item
    handleChangeSubItem({
      ...subOption,
      subs: [...subOption.subs, DEFAULT_SUB_OPTION_ITEM],
    });
  };

  const handleChangeSubOptionName = (e: React.ChangeEvent<HTMLInputElement>) => {
    /// change subOption name
    handleChangeSubItem({
      ...subOption,
      name: e.target.value,
    });
  };

  const handleDeleteSubOptionItem = (index: number) => {
    const newSubItems = [...subOption.subs];
    newSubItems.splice(index, 1);
    handleChangeSubItem({
      ...subOption,
      subs: newSubItems,
    });
  };

  const handleChangeSubOptionItem = (changedOptionItem: ISubBasisOption, index: number) => {
    const newSubItems = [...subOption.subs];
    newSubItems[index] = changedOptionItem;
    handleChangeSubItem({
      ...subOption,
      subs: newSubItems,
    });
  };

  const renderPanelHeader = () => {
    return (
      <div className={styles.panel_header}>
        <div className={styles.panel_header__field}>
          <div className={styles.panel_header__field_right}>
            <div className={styles.panel_header__field_title} onClick={handleActiveKeyToCollapse}>
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
            <div
              className={classNames(
                styles.panel_header__field_image,
                activeImage ? styles['set-checked-color'] : styles['set-unchecked-color'],
              )}
              onClick={handleOnClickAddImage}
            >
              <BodyText level={7}>Image</BodyText>
              <Radio />
            </div>
          </div>
          <CirclePlusIcon
            className={styles.panel_header__field_add}
            onClick={addNewSubOptionItem}
          />
        </div>
        <div className={styles.panel_header__input}>
          <CustomInput
            placeholder="type option name"
            name="name"
            size="small"
            containerClass={styles.panel_header__input_value}
            onChange={handleChangeSubOptionName}
            value={subOption.name}
          />
          <ActionDeleteIcon
            className={styles.panel_header__input_delete_icon}
            onClick={handleDeleteSubOption}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.collapse_container}>
      <Collapse ghost activeKey={activeKey}>
        <Collapse.Panel
          className={
            isEmpty(activeKey) ? styles.active_collapse_panel : styles.unactive_collapse_panel
          }
          header={renderPanelHeader()}
          key="1"
          showArrow={false}
        >
          <div className={styles.sub_wrapper}>
            {subOption.subs.map((subItemOption, index) => (
              <div key={index} className={styles.element_input}>
                {activeImage && (
                  <div className={styles.image}>
                    <img src={image} alt="image" />
                  </div>
                )}
                <div className={styles.form}>
                  <SubItemOption
                    order={1}
                    subItemOption={subItemOption}
                    onChange={(changedOptionItem) =>
                      handleChangeSubOptionItem(changedOptionItem, index)
                    }
                  />
                  <SubItemOption
                    order={2}
                    subItemOption={subItemOption}
                    onChange={(changedOptionItem) =>
                      handleChangeSubOptionItem(changedOptionItem, index)
                    }
                  />
                </div>
                <div className={styles.delete_icon}>
                  <ActionDeleteIcon
                    className={styles.panel_header__input_delete_icon}
                    onClick={() => handleDeleteSubOptionItem(index)}
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

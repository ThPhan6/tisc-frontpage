import React, { FC } from 'react';

import { Col, Collapse, Radio, Row } from 'antd';

import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as CirclePlusIcon } from '@/assets/icons/circle-plus.svg';
import DefaultImage from '@/assets/icons/default-option-icon.png';
import { ReactComponent as ArrowIcon } from '@/assets/icons/drop-down-icon.svg';

import { getBase64, showImageUrl } from '@/helper/utils';
import { isEmpty } from 'lodash';

import { BasisOptionSubForm, SubBasisOption } from '@/types';

import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

import styles from '../styles/OptionItem.less';

interface SubItemOptionProps {
  is_have_image?: boolean;
  subItemOption: SubBasisOption;
  onChange: (subItemOption: SubBasisOption) => void;
  index: number;
  optionIndex: number;
}

const DEFAULT_SUB_OPTION_ITEM: SubBasisOption = {
  value_1: '',
  value_2: '',
  unit_2: '',
  unit_1: '',
};

const SubItemOption: FC<SubItemOptionProps> = ({
  is_have_image,
  subItemOption,
  onChange,
  index,
  optionIndex,
}) => {
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...subItemOption,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeFileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    getBase64(file)
      .then((base64Image) => {
        onChange({
          ...subItemOption,
          image: base64Image,
          isBase64: true,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getURLImage = () => {
    if (subItemOption.image) {
      return subItemOption.isBase64 ? subItemOption.image : showImageUrl(subItemOption.image);
    }
    return DefaultImage;
  };

  return (
    <div className={styles.element}>
      {is_have_image && (
        <div className={styles.image_upload}>
          <label htmlFor={`input_${optionIndex}_${index}`}>
            <img className={styles.image} src={getURLImage()} />
          </label>

          <div className={styles.image__file_input}>
            <input
              id={`input_${optionIndex}_${index}`}
              type="file"
              accept=".jpg, .jpeg, .png, .webp"
              style={{ display: 'none' }}
              onChange={handleChangeFileImage}
            />
          </div>
        </div>
      )}

      <Row className={styles.form_sub__input} gutter={16}>
        {[1, 2].map((order) => (
          <Col className={styles.form_input} key={order} span={12}>
            <BodyText level={3}>O{order}:</BodyText>
            <CustomInput
              placeholder="value"
              name={`value_${order}`}
              size="small"
              autoWidth
              defaultWidth={40}
              containerClass={styles.form_input__formula}
              onChange={handleChangeInput}
              value={subItemOption[`value_${order}`]}
            />
            <CustomInput
              placeholder="unit"
              name={`unit_${order}`}
              size="small"
              autoWidth
              defaultWidth={30}
              containerClass={styles.form_input__unit}
              onChange={handleChangeInput}
              value={subItemOption[`unit_${order}`]}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

interface OptionItemProps {
  subOption: BasisOptionSubForm;
  handleChangeSubItem: (changedSubs: BasisOptionSubForm) => void;
  handleDeleteSubOption: () => void;
  optionIndex: number;
}

export const OptionItem: FC<OptionItemProps> = (props) => {
  const { subOption, handleChangeSubItem, handleDeleteSubOption, optionIndex } = props;

  const handleActiveKeyToCollapse = () => {
    handleChangeSubItem({
      ...subOption,
      is_collapse: subOption.is_collapse ? '' : '1',
    });
  };

  const handleOnClickUsingImage = () => {
    handleChangeSubItem({
      ...subOption,
      is_have_image: subOption.is_have_image ? false : true,
    });
  };

  const addNewSubOptionItem = () => {
    /// default open option item list when add new
    /// add new sub option item
    handleChangeSubItem({
      ...subOption,
      is_collapse: '1',
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

    if (newSubItems.length < 1) {
      /// unactive image if have none sub
      handleChangeSubItem({
        ...subOption,
        subs: newSubItems,
        is_have_image: false,
        is_collapse: '',
      });
    }
  };

  const handleChangeSubOptionItem = (changedOptionItem: SubBasisOption, index: number) => {
    const newSubItems = [...subOption.subs];
    newSubItems[index] = changedOptionItem;
    handleChangeSubItem({
      ...subOption,
      subs: newSubItems,
    });
  };

  const PanelHeader = () => {
    return (
      <div className={styles.panel_header}>
        <div className={styles.panel_header__field}>
          <div className={styles.panel_header__field_right}>
            <div className={styles.panel_header__field_title} onClick={handleActiveKeyToCollapse}>
              <BodyText
                level={3}
                customClass={
                  isEmpty(subOption.is_collapse) ? styles.font_weight_300 : styles.font_weight_600
                }>
                Option Name
              </BodyText>
              <ArrowIcon
                className={styles.panel_header__field_title_icon}
                style={{
                  transform: `rotate(${isEmpty(subOption.is_collapse) ? '0' : '180'}deg)`,
                }}
              />
            </div>
            <div
              className={`
                ${styles.panel_header__field_image}
                ${
                  subOption.is_have_image
                    ? styles['set-checked-color']
                    : styles['set-unchecked-color']
                }`}
              onClick={handleOnClickUsingImage}>
              <BodyText fontFamily="Roboto" level={5}>
                Image
              </BodyText>
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
      <Collapse ghost activeKey={subOption.is_collapse!}>
        <Collapse.Panel
          className={
            isEmpty(subOption.is_collapse)
              ? styles.active_collapse_panel
              : styles.unactive_collapse_panel
          }
          header={PanelHeader()}
          key={subOption.is_collapse!}
          showArrow={false}>
          <div className={styles.sub_wrapper}>
            {subOption.subs.map((subItemOption, index) => (
              <div key={index} className={styles.element_input}>
                <div className={styles.optionItemGroup}>
                  <div className={styles.form}>
                    <SubItemOption
                      index={index}
                      optionIndex={optionIndex}
                      is_have_image={subOption.is_have_image}
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
              </div>
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

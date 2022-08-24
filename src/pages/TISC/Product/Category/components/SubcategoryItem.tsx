import { FC, useEffect, useState } from 'react';

import { Collapse } from 'antd';

import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as CirclePlusIcon } from '@/assets/icons/circle-plus.svg';
import { ReactComponent as ArrowIcon } from '@/assets/icons/drop-down-icon.svg';

import { isEmpty, isEqual } from 'lodash';

import {
  SubcategoryItemProps,
  SubcategoryValueProps,
  subcategoryValueDefault,
} from '@/features/categories/types';

import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

import styles from '../styles/SubcategoryItem.less';

const ElementInput: FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickDelete: () => void;
}> = ({ onChange, onClickDelete, value }) => {
  return (
    <div className={styles.form_input}>
      <BodyText level={3}>Category :</BodyText>
      <div className={styles.form_input__element}>
        <CustomInput
          placeholder="type category name"
          containerClass={styles.form_input__element_input}
          onChange={onChange}
          value={value}
        />
        <ActionDeleteIcon
          className={styles.form_input__element_delete_icon}
          onClick={onClickDelete}
        />
      </div>
    </div>
  );
};

export const SubcategoryItem: FC<SubcategoryItemProps> = ({
  onClickDeleteSubcategory,
  value,
  onChange,
}) => {
  const [activeKey, setActiveKey] = useState<string[]>([]);
  const [subcategoryValue, setSubcategoryValue] =
    useState<SubcategoryValueProps>(subcategoryValueDefault);

  useEffect(() => {
    if (value) {
      setSubcategoryValue({ ...value });
    }
  }, [!isEqual(value, subcategoryValue)]);

  const handleOnChangeSubcategoryName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSubcategoryValue = { ...subcategoryValue, name: e.target.value };
    setSubcategoryValue(newSubcategoryValue);
    onChange({ ...newSubcategoryValue });
  };

  const handleOnClickPlusIcon = () => {
    const newSubcategoryValue = {
      ...subcategoryValue,
      subs: [...subcategoryValue.subs, { name: '' }],
    };
    setActiveKey(['1']);
    setSubcategoryValue(newSubcategoryValue);
    onChange({ ...newSubcategoryValue });
  };

  const handleOnClickDeleteElementInput = (index: number) => {
    const newSubs = [...subcategoryValue.subs];
    newSubs.splice(index, 1);
    setSubcategoryValue({ ...subcategoryValue, subs: newSubs });
    onChange({ ...subcategoryValue, subs: newSubs });
  };

  const handleOnChangeElementInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newSubs = [...subcategoryValue.subs];
    newSubs[index] = { ...newSubs[index], name: e.target.value };
    setSubcategoryValue({ ...subcategoryValue, subs: newSubs });
    onChange({ ...subcategoryValue, subs: newSubs });
  };

  const PanelHeader = () => {
    return (
      <div className={styles.panel_header}>
        <div className={styles.panel_header__field}>
          <div
            className={styles.panel_header__field_title}
            onClick={() => {
              setActiveKey(isEmpty(activeKey) ? ['1'] : []);
            }}>
            <BodyText
              level={3}
              customClass={isEmpty(activeKey) ? styles.font_weight_300 : styles.font_weight_600}>
              Subcategory
            </BodyText>
            <ArrowIcon
              className={styles.panel_header__field_title_icon}
              style={{
                transform: `rotate(${isEmpty(activeKey) ? '0' : '180'}deg)`,
              }}
            />
          </div>
          <CirclePlusIcon
            className={styles.panel_header__field_add}
            onClick={handleOnClickPlusIcon}
          />
        </div>
        <div className={styles.panel_header__input}>
          <CustomInput
            placeholder="type subcategory name"
            containerClass={styles.panel_header__input_value}
            onChange={handleOnChangeSubcategoryName}
            value={subcategoryValue.name}
          />
          <ActionDeleteIcon
            className={styles.panel_header__input_delete_icon}
            onClick={onClickDeleteSubcategory}
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
          header={PanelHeader()}
          key="1"
          showArrow={false}>
          <div className={styles.sub_wrapper}>
            {subcategoryValue.subs.map((category, index: number) => (
              <ElementInput
                key={index}
                value={category.name}
                onChange={(e) => handleOnChangeElementInput(e, index)}
                onClickDelete={() => handleOnClickDeleteElementInput(index)}
              />
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

import { FC, useEffect, useState } from 'react';

import { Collapse } from 'antd';

import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as CirclePlusIcon } from '@/assets/icons/circle-plus.svg';
import { ReactComponent as ArrowIcon } from '@/assets/icons/drop-down-icon.svg';

import { isEmpty, isEqual } from 'lodash';

import {
  DEFAULT_ITEM_MATERIAL_PRODUCT,
  DEFAULT_SUB_MATERIAL_PRODUCT,
  MaterialProductItemProps,
  MaterialProductSubForm,
} from '../type';

import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

import styles from './MaterialProductItem.less';

export const MaterialProductItem: FC<MaterialProductItemProps> = ({
  value,
  onChangeValue,
  handleClickDelete,
}) => {
  const [materialItem, setMaterialItem] = useState<MaterialProductSubForm>(
    DEFAULT_SUB_MATERIAL_PRODUCT,
  );

  useEffect(() => {
    if (value) {
      setMaterialItem({ ...value });
    }
  }, [!isEqual(value, materialItem)]);

  const handleActiveKeyToCollapse = () => {
    onChangeValue({
      ...materialItem,
      is_collapse: materialItem.is_collapse ? '' : '1',
    });
  };

  const handleChangeSubList = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeValue({ ...materialItem, name: e.target.value });
  };

  const handleClickAddItem = () => {
    const newCodes = [...materialItem.codes, DEFAULT_ITEM_MATERIAL_PRODUCT];
    onChangeValue({ ...materialItem, is_collapse: '1', codes: newCodes });
  };

  const handleClickDeleteItem = (index: number) => {
    const newCodes = [...materialItem.codes];
    newCodes.splice(index, 1);
    onChangeValue({ ...materialItem, codes: newCodes });
    if (newCodes.length === 0) {
      onChangeValue({ ...materialItem, is_collapse: '', codes: newCodes });
    }
  };

  const handleChangeItem = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newCodes = [...materialItem.codes];
    newCodes[index] = { ...newCodes[index], [e.target.name]: e.target.value };
    onChangeValue({ ...materialItem, codes: newCodes });
  };

  const PanelHeader = () => {
    return (
      <div className={styles.panel_header}>
        <div className={styles.panel_header__field}>
          <div className={styles.panel_header__field_title} onClick={handleActiveKeyToCollapse}>
            <BodyText
              level={3}
              customClass={
                isEmpty(materialItem.is_collapse) ? styles.font_weight_300 : styles.font_weight_600
              }>
              Sub-List
            </BodyText>
            <ArrowIcon
              className={styles.panel_header__field_title_icon}
              style={{
                transform: `rotate(${isEmpty(materialItem.is_collapse) ? '0' : '180'}deg)`,
              }}
            />
          </div>
          <CirclePlusIcon className={styles.panel_header__field_add} onClick={handleClickAddItem} />
        </div>
        <div className={styles.panel_header__input}>
          <CustomInput
            placeholder="type sub-list name"
            size="small"
            containerClass={styles.panel_header__input_value}
            onChange={handleChangeSubList}
            value={materialItem.name}
          />
          <ActionDeleteIcon
            className={styles.panel_header__input_delete_icon}
            onClick={handleClickDelete}
          />
        </div>
      </div>
    );
  };
  return (
    <div className={styles.material}>
      <Collapse ghost activeKey={materialItem.is_collapse}>
        <Collapse.Panel
          className={`
             ${styles['customPadding']}
              ${
                isEmpty(materialItem.is_collapse) ? styles['bottomMedium'] : styles['bottomBlack']
              }`}
          header={PanelHeader()}
          key={materialItem.is_collapse!}
          showArrow={false}>
          <div>
            {materialItem.codes.map((item, index) => (
              <div className={styles.form} key={index}>
                <div className={styles.form__element}>
                  <div className={styles.form__element_item}>
                    <BodyText level={4}>Code:</BodyText>
                    <CustomInput
                      placeholder="enter code"
                      size="small"
                      defaultWidth={68}
                      value={item.code}
                      name="code"
                      onChange={(e) => handleChangeItem(e, index)}
                    />
                  </div>
                  <div className={styles.form__element_item}>
                    <BodyText level={4}>Description:</BodyText>
                    <CustomInput
                      placeholder="type description"
                      size="small"
                      value={item.description}
                      name="description"
                      onChange={(e) => handleChangeItem(e, index)}
                    />
                  </div>
                </div>
                <ActionDeleteIcon
                  className={styles.form__delete_icon}
                  onClick={() => handleClickDeleteItem(index)}
                />
              </div>
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

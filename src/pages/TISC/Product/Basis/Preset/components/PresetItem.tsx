import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';
import classNames from 'classnames';
import { isEmpty, isEqual } from 'lodash';
import { FC, useEffect, useState } from 'react';
import styles from '../styles/PresetItem.less';
import { ReactComponent as ArrowIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as CirclePlusIcon } from '@/assets/icons/circle-plus.svg';
import { Collapse, Col, Row } from 'antd';
import {
  PresetElementInputProp,
  PresetItemProps,
  PresetItemValueProp,
  presetsValueDefault,
  subPresetDefaultValue,
} from '../types';

const PresetElementInput: FC<PresetElementInputProp> = ({ order, onChange, value }) => {
  return (
    <div className={styles.presetElement}>
      <BodyText level={3}>P{order}:</BodyText>
      <CustomInput
        placeholder={'value'}
        name={`value_${order}`}
        size="small"
        autoWidth
        defaultWidth={40}
        containerClass={styles.presetElement__input_value}
        onChange={onChange}
        value={value[`value_${order}`]}
      />
      <CustomInput
        placeholder="unit"
        name={`unit_${order}`}
        size="small"
        autoWidth
        defaultWidth={30}
        containerClass={classNames(styles.presetElement__input_unit)}
        onChange={onChange}
        value={value[`unit_${order}`]}
      />
    </div>
  );
};

export const PresetItem: FC<PresetItemProps> = ({ handleOnClickDelete, onChangeValue, value }) => {
  const [presetItem, setPresetItem] = useState<PresetItemValueProp>(presetsValueDefault);

  useEffect(() => {
    if (value) {
      setPresetItem({ ...value });
    }
  }, [!isEqual(value, presetItem)]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newSubs = [...presetItem.subs];
    newSubs[index] = { ...newSubs[index], [e.target.name]: e.target.value };
    onChangeValue({ ...presetItem, subs: newSubs });
  };

  const handleOnClickDeleteItem = (index: number) => {
    const newSubs = [...presetItem.subs];
    newSubs.splice(index, 1);
    onChangeValue({ ...presetItem, subs: newSubs });
    if (newSubs.length === 0) {
      onChangeValue({ ...presetItem, is_collapse: '', subs: newSubs });
    }
  };

  const handleOnClickAddItem = () => {
    const newSubs = [...presetItem.subs, subPresetDefaultValue];
    onChangeValue({ ...presetItem, is_collapse: '1', subs: newSubs });
  };

  const handleOnChangePresetName = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeValue({ ...presetItem, name: e.target.value });
  };

  const renderPanelHeader = () => {
    return (
      <div className={styles.panel_header}>
        <div className={styles.panel_header__field}>
          <div
            className={styles.panel_header__field_title}
            onClick={() => {
              const newSubs = [...presetItem.subs, subPresetDefaultValue];
              onChangeValue({
                ...presetItem,
                is_collapse: presetItem.is_collapse ? '' : '1',
                subs: newSubs,
              });
            }}
          >
            <BodyText
              level={3}
              customClass={
                isEmpty(presetItem.is_collapse) ? styles.font_weight_300 : styles.font_weight_600
              }
            >
              Preset Name
            </BodyText>
            <ArrowIcon
              className={styles.panel_header__field_title_icon}
              style={{
                transform: `rotate(${isEmpty(presetItem.is_collapse) ? '0' : '180'}deg)`,
              }}
            />
          </div>
          <CirclePlusIcon
            className={styles.panel_header__field_add}
            onClick={handleOnClickAddItem}
          />
        </div>
        <div className={styles.panel_header__input}>
          <CustomInput
            placeholder="type preset name"
            size="small"
            containerClass={styles.panel_header__input_value}
            onChange={handleOnChangePresetName}
            value={presetItem.name}
            name="Preset_item_input_value"
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
    <div className={styles.preset}>
      <Collapse ghost activeKey={presetItem.is_collapse}>
        <Collapse.Panel
          className={classNames(
            styles['customPadding'],
            isEmpty(presetItem.is_collapse) ? styles['bottomMedium'] : styles['bottomBlack'],
          )}
          header={renderPanelHeader()}
          key={presetItem.is_collapse}
          showArrow={false}
        >
          <div>
            {presetItem.subs.map((preset, index) => (
              <div className={styles.form} key={index}>
                <Row className={styles.form__element}>
                  <Col span={12}>
                    <PresetElementInput
                      order={1}
                      onChange={(e) => handleOnChange(e, index)}
                      value={preset}
                    />
                  </Col>
                  <Col span={12}>
                    <PresetElementInput
                      order={2}
                      onChange={(e) => handleOnChange(e, index)}
                      value={preset}
                    />
                  </Col>
                </Row>
                <ActionDeleteIcon
                  className={styles.form__delete_icon}
                  onClick={() => handleOnClickDeleteItem(index)}
                />
              </div>
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

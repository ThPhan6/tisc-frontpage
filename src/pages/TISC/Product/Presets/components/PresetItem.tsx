import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as AddIconCircle } from '@/assets/icons/circle-plus-icon.svg';
import { ReactComponent as DropDownIcon } from '@/assets/icons/drop-down-icon.svg';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';
import classNames from 'classnames';
import { FC, useState } from 'react';
import styles from '../styles/PresetItem.less';
import {
  PresetElementInputProp,
  PresetItemProps,
  PresetItemValueProp,
  subPresetDefaultValue,
} from '../types';

const PresetElementInput: FC<PresetElementInputProp> = ({ order, onChange, value }) => {
  return (
    <div className={styles.element}>
      <BodyText level={3}>P{order}:</BodyText>
      <CustomInput
        placeholder={'value'}
        name={`value_${order}`}
        size="small"
        containerClass={styles.element__input_value}
        onChange={onChange}
        value={value[`value_${order}`]}
      />
      <CustomInput
        placeholder="unit"
        name={`unit_${order}`}
        size="small"
        containerClass={classNames(styles.element__input_unit)}
        onChange={onChange}
        value={value[`unit_${order}`]}
      />
    </div>
  );
};

export const PresetItem: FC<PresetItemProps> = ({ handleOnClickDelete, onChangeValue }) => {
  const [presetItem, setPresetItem] = useState<PresetItemValueProp>({
    name: '',
    subs: [],
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newSubs = [...presetItem.subs];
    newSubs[index] = { ...newSubs[index], [e.target.name]: e.target.value };
    setPresetItem({ ...presetItem, subs: newSubs });
    if (onChangeValue) {
      onChangeValue({ ...presetItem, subs: newSubs });
    }
  };

  const handleOnClickDeleteItem = (index: number) => {
    const newSubs = [...presetItem.subs];
    newSubs.splice(index, 1);
    setPresetItem({ ...presetItem, subs: newSubs });
  };

  const handleOnClickAddItem = () => {
    const newSubs = [...presetItem.subs, subPresetDefaultValue];
    setPresetItem({ ...presetItem, subs: newSubs });
  };
  console.log('presetItem', presetItem);
  const handleOnChangePresetName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPresetItem({ ...presetItem, name: e.target.value });
    if (onChangeValue) {
      onChangeValue({ ...presetItem, name: e.target.value });
    }
  };

  return (
    <div className={styles.preset}>
      <div className={styles.field}>
        <div className={styles.field__title}>
          <BodyText level={3}>Preset Name</BodyText>
          <DropDownIcon />
        </div>
        <AddIconCircle onClick={handleOnClickAddItem} className={styles.field__add_icon} />
      </div>
      <div className={styles.formName}>
        <CustomInput
          placeholder="type preset name"
          name="Preset_item_input_value"
          value={presetItem.name}
          onChange={handleOnChangePresetName}
          containerClass={styles.input}
        />
        <ActionDeleteIcon className={styles.field__delete_icon} onClick={handleOnClickDelete} />
      </div>
      <div>
        {presetItem.subs.map((preset, index) => (
          <div className={styles.form} key={index}>
            <PresetElementInput
              order={1}
              onChange={(e) => handleOnChange(e, index)}
              value={preset}
            />
            <PresetElementInput
              order={2}
              onChange={(e) => handleOnChange(e, index)}
              value={preset}
            />
            <ActionDeleteIcon
              className={styles.field__delete_icon}
              onClick={() => handleOnClickDeleteItem(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

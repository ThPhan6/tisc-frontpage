import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import { CheckboxValue, CustomCheckboxProps } from './types';
import { RootState } from '@/reducers';

import { MenuIconProps } from '@/components/HeaderDropdown';
import { ActionMenu, ActionType } from '@/components/TableAction';

import { CustomInput } from '../Form/CustomInput';
import style from './styles/index.less';

export const CustomCheckbox: FC<CustomCheckboxProps> = ({
  direction,
  otherInput,
  clearOtherInput,
  inputPlaceholder = 'type here',
  options,
  onChange,
  onOneChange,
  isCheckboxList,
  selected,
  checkboxClass = '',
  heightItem = '32px',
  chosenItems,
  additionalSelected,
  onChangeAdditionalSelected,
  isExpanded,
  ...props
}) => {
  const labels = useSelector((state: RootState) => state.label.labels);

  const [inputValue, setInputValue] = useState('');
  const [randomId] = useState(Math.random().toString().replace(/[\D]+/g, ''));
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (otherInput && clearOtherInput) {
      setInputValue('');
    }
  }, [otherInput && clearOtherInput]);

  const onChangeValue = (checkedValues: CheckboxValueType[]) => {
    const newCheckedValues = [...checkedValues];

    const haveOtherInput = newCheckedValues.some((checkbox) => checkbox === 'other');

    const newCheckboxValue = newCheckedValues.map((value) =>
      value === 'other'
        ? { label: inputValue, value: 'other' }
        : options.filter((item) => item.value === value)[0],
    );
    if (inputValue && !haveOtherInput) {
      newCheckboxValue.push({ label: inputValue, value: 'other' });
    }
    if (onChange) {
      onChange(newCheckboxValue);
    }
  };

  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const haveOtherInput = selected?.some((checkbox) => checkbox.value === 'other') || false;

    let newData: CheckboxValue[] = selected || [];

    if (newValue && !haveOtherInput) {
      newData.push({ label: newValue, value: 'other' });
    } else {
      newData =
        selected?.map((itemCheckbox) => {
          if (itemCheckbox.value === 'other') {
            return { ...itemCheckbox, label: newValue };
          }
          return itemCheckbox;
        }) || [];
    }

    onChange?.(newData.filter((el) => el.label !== '') ?? []);
  };

  const getActiveClass = (option: CheckboxValue) => {
    if (selected?.find((itemSelected) => itemSelected?.value == option?.value)) {
      return 'item-option-checked';
    }
    return 'item-option-uncheck';
  };

  /**
   * Function to toggle the expanded state of an item.
   *
   * @param key - The key of the item to toggle the expanded state.
   */
  const handleToggleExpand = (key: string) => {
    // Toggle the expanded state of the item based on the presence of the key.
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  /**
   * Function to handle events that change the checkbox's state.
   *
   * @param value - The value of checkbox.
   * @param option - Object containing information about the checkbox.
   * @param event - Checkbox state change event.
   */
  const handleCheckboxChange = <T extends {}>(
    value: string,
    option: T,
    event: CheckboxChangeEvent,
  ) => {
    event.stopPropagation();
    event.preventDefault();

    if (additionalSelected && onChangeAdditionalSelected) {
      onChangeAdditionalSelected(value, option, 'remove');
    }

    onOneChange?.(event);
  };

  const handleEdit = () => {};

  const handleDelete = () => {};

  const actionItems: (MenuIconProps & { type: ActionType })[] = [
    {
      type: 'updated',
      label: 'Edit',
      onClick: handleEdit,
    },

    {
      type: 'deleted',
      label: 'Delete',
      onClick: handleDelete,
    },
  ];

  const alignCenterStyles = {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '16px',
  };

  const flexEndStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    gap: '22px',
  };

  return (
    <div
      className={`${style[`checkbox-${direction}`]} ${style['checkbox-list']} ${
        isCheckboxList && style['item-list-checkbox']
      } ${style['color-checkbox-checked']} ${checkboxClass}`}
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox.Group
        {...props}
        value={selected?.map((item) => item?.value) ?? []}
        onChange={onChangeValue}
      >
        {options.map((option, index) =>
          isCheckboxList ? (
            <div key={option.value}>
              <label
                key={`${option.value}_${index}_${randomId}`}
                className={` ${style['item-wrapper']} ${
                  chosenItems?.some((el) => el.value === option.select_id)
                    ? 'item-checkbox-active'
                    : ''
                } item-wrapper-custom text-capitalize`}
                style={{ minHeight: heightItem }}
                htmlFor={`${option.value}_${index}_${randomId}`}
                onClick={() => handleToggleExpand(option.value as string)}
              >
                <div
                  style={{
                    width: 'calc(100% - 16px)',
                    marginRight: '16px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  className={`${getActiveClass(option)}`}
                >
                  {option.label}
                </div>
                {isExpanded ? (
                  expandedKeys.includes(option.value as string) ? (
                    <UpOutlined />
                  ) : (
                    <DownOutlined />
                  )
                ) : (
                  <Checkbox
                    id={`${option.value}_${index}_${randomId}`}
                    {...option}
                    onChange={(event) =>
                      handleCheckboxChange(option.value.toString(), option, event)
                    }
                  />
                )}

                {additionalSelected && onChangeAdditionalSelected ? (
                  <input
                    style={{ marginRight: 4, cursor: 'pointer' }}
                    disabled={!selected?.find((item) => item.value === option.value.toString())}
                    type="checkbox"
                    id={option.value.toString()}
                    name="defaultSelect"
                    value={option.value}
                    checked={additionalSelected.includes(option.value.toString())}
                    onChange={() => {
                      onChangeAdditionalSelected(option.value.toString(), option);
                    }}
                  />
                ) : null}
              </label>
              {isExpanded &&
                expandedKeys.includes(option.value as string) &&
                labels
                  .filter((label) => label.id === option.value)
                  .map((label) => (
                    <div key={label.id}>
                      {label.subs &&
                        label.subs.length > 0 &&
                        label.subs.map((sub, subIndex) => (
                          <div
                            key={sub.id}
                            className={`${style['sub-item-checkbox']} sub-item-wrapper-checkbox`}
                            style={alignCenterStyles}
                          >
                            <span className={`${style['sub-label-name']}`}>{sub.name}</span>
                            <div style={flexEndStyle}>
                              <ActionMenu
                                className={`mono-color`}
                                editActionOnMobile={false}
                                actionItems={actionItems}
                              />
                              <Checkbox
                                id={`${sub.id}_${subIndex}_${randomId}`}
                                {...option}
                                onChange={(event) =>
                                  handleCheckboxChange(sub.id.toString(), sub, event)
                                }
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
            </div>
          ) : (
            <div
              key={option.value}
              className={`${style['item-checkbox']} item-wrapper-checkbox`}
              style={{ minHeight: heightItem }}
            >
              <Checkbox {...option} style={{ maxWidth: '100%' }}>
                <span className={getActiveClass(option)}>{option.label}</span>
              </Checkbox>
            </div>
          ),
        )}
      </Checkbox.Group>
      {otherInput ? (
        <div
          className={`other-field-checkbox ${
            isCheckboxList ? style['other-field-checkbox-list'] : ''
          }`}
        >
          <Checkbox value={'other'}>
            <div className={style['input-wrapper']} style={{ height: heightItem }}>
              Other
              <CustomInput
                containerClass={style['other-input']}
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={onChangeInputValue}
              />
            </div>
          </Checkbox>
        </div>
      ) : null}
    </div>
  );
};

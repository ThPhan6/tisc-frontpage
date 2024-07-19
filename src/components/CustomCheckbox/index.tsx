import {
  ChangeEvent,
  FC,
  Fragment,
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Checkbox, message } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { useToggleExpand } from '@/helper/hook';
import { updateLabel } from '@/services/label.api';
import { trimStart } from 'lodash';

import { CheckboxValue, CustomCheckboxProps } from './types';
import { RootState } from '@/reducers';
import { setLabels, setSelectedSubLabels } from '@/reducers/label';

import CustomButton from '../Button';
import { CustomInput } from '../Form/CustomInput';
import { ActionMenu } from '../TableAction';
import style from './styles/index.less';
import { DynamicCheckboxValue } from '@/features/product/modals/CollectionAndLabel';
import modalStyle from '@/features/product/modals/index.less';

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
  const [inputValue, setInputValue] = useState('');
  const [isActionMenuDisabled, setIsActionMenuDisabled] = useState(false);
  const [originalLabelName, setOriginalLabelName] = useState<string>();
  const [randomId] = useState(Math.random().toString().replace(/[\D]+/g, ''));
  const [checkedItems, setCheckedItems] = useState<DynamicCheckboxValue[]>(
    (selected as DynamicCheckboxValue[]) || [],
  );

  const { labels } = useSelector((state: RootState) => state.label);

  const dispatch = useDispatch();

  const { expandedKeys, handleToggleExpand } = useToggleExpand();

  const editingLabelIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (otherInput && clearOtherInput) {
      setInputValue('');
    }
  }, [otherInput && clearOtherInput]);

  useEffect(() => {
    if (onChange) onChange(checkedItems);

    dispatch(setSelectedSubLabels(checkedItems.map((item) => String(item.value))));
  }, [JSON.stringify(checkedItems)]);

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
   * Handles the change event of a checkbox.
   *
   * @param sub - The checkbox value object.
   */
  const handleCheckboxChange = (sub: DynamicCheckboxValue) => {
    setCheckedItems((pre) =>
      pre.some((preItem) => preItem.value === sub.value)
        ? pre.filter((item) => item.value !== sub.value)
        : pre.concat([sub]),
    );
  };

  /**
   * Handles the edit action for a label.
   *
   * @param type The type of label to edit ('label' or 'sub-label').
   * @param id The ID of the label or sub-label to edit.
   * @param labelName The original label or sub-label name.
   */
  const handleEditClick = (type: 'label' | 'sub-label', id: string, labelName: string) => () => {
    editingLabelIdRef.current = id;
    setIsActionMenuDisabled(true);
    setOriginalLabelName(labelName);
  };

  const handleDelete = () => {};

  /**
   * Handles the expand/collapse action for a sub-label list with a check.
   *
   * @param key The key of the label list to expand/collapse.
   */
  const handleToggleExpandWithCheck = (key: string) => () => {
    if (!isActionMenuDisabled) handleToggleExpand(key);
  };

  /**
   * Handles the change event for the name of an assigned label.
   *
   * @param selectedValue The selected label value.
   * @param index The index of the label in the array.
   */
  const handleOnChangeLabelNameAssigned =
    (selectedValue: DynamicCheckboxValue, index: number) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const newData = [...labels];

      newData[index] = {
        ...selectedValue,
        name: trimStart(event.target.value),
      };

      dispatch(setLabels(newData));
    };

  /**
   * Handles the edit name action for an assigned label.
   *
   * @param type The type of action ('save' or 'cancel').
   * @param index The index of the label in the array.
   * @param selectedValue The selected label value.
   */
  const handleEditNameAssigned =
    (
      type: 'save' | 'cancel',
      index: number,
      selectedValue: DynamicCheckboxValue,
    ): MouseEventHandler<HTMLButtonElement> =>
    async () => {
      const newData = [...labels];
      const updatedLabel = {
        ...selectedValue,
        name: trimStart(newData[index].name),
      };

      if (type === 'save') {
        if (updatedLabel.name === '') {
          message.error('Input cannot be empty!');
          setIsActionMenuDisabled(true);
          return;
        }

        const res = await updateLabel(updatedLabel.id!, {
          name: updatedLabel.name,
          brand_id: updatedLabel.brand_id!,
        });

        if (!res) return;
      }

      if (type === 'cancel') updatedLabel.name = originalLabelName ?? '';

      newData[index] = updatedLabel;
      dispatch(setLabels(newData));
      setIsActionMenuDisabled(false);
    };

  const alignCenterStyles = {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '16px',
    margin: '8px 0',
  };

  const flexEndStyles = {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    gap: '26px',
  };

  const labelWrapperStyles = (labelId: string) => {
    return {
      display: 'flex',
      cursor: 'pointer',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: `${!expandedKeys.includes(labelId) ? '8px' : '0'}`,
    };
  };

  /**
   * Check if any sub labels are selected for a given label.
   *
   * @param labelId - The ID of the label to check.
   * @returns True if any sub label is selected, otherwise false.
   */
  const isAnySubLabelChecked = (labelId: string) => {
    const label = labels.find((item) => item.id === labelId);
    return label?.subs?.some((sub) => selected?.some((el) => el.value === sub.id));
  };

  const mainLabelNameStyles = (labelId: string) => {
    return {
      fontWeight: `${expandedKeys.includes(labelId) ? '500' : '300'}`,
      fontSize: '14px',
      fontFamily: 'Roboto',
      lineHeight: 'calc(22/14)',
      color: `${expandedKeys.includes(labelId) && isAnySubLabelChecked(labelId) ? '#2b39d4' : ''}`,
    };
  };

  const disableArrowIconStyles = {
    cursor: isActionMenuDisabled ? 'not-allowed' : 'pointer',
  };

  const sortedLabels = useMemo(
    () => [...labels].sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0)),
    [labels],
  );

  return (
    <div
      className={`${style[`checkbox-${direction}`]} ${style['checkbox-list']} ${
        isCheckboxList && style['item-list-checkbox']
      } ${style['color-checkbox-checked']} ${checkboxClass}`}
      onClick={(e) => e.stopPropagation()}
    >
      {!isExpanded ? (
        <Checkbox.Group
          {...props}
          value={selected?.map((item) => item?.value) ?? []}
          onChange={onChangeValue}
        >
          {options.map((option, index) =>
            isCheckboxList ? (
              <label
                key={`${option.value}_${index}_${randomId}`}
                className={` ${style['item-wrapper']} ${
                  chosenItems?.some((el) => el.value === option.value) ? 'item-checkbox-active' : ''
                } item-wrapper-custom text-capitalize`}
                style={{ minHeight: heightItem }}
                htmlFor={`${option.value}_${index}_${randomId}`}
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
                <Checkbox id={`${option.value}_${index}_${randomId}`} {...option} />
                {additionalSelected && onChangeAdditionalSelected && (
                  <input
                    style={{ marginRight: 4, cursor: 'pointer' }}
                    disabled={!selected?.find((item) => item.value === option.value.toString())}
                    type="checkbox"
                    id={option.value.toString()}
                    name="defaultSelect"
                    value={option.value}
                    checked={additionalSelected.includes(option.value.toString())}
                    onChange={() => onChangeAdditionalSelected(option.value.toString(), option)}
                  />
                )}
              </label>
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
      ) : (
        sortedLabels.map((label, index) => (
          <Fragment key={label.id}>
            <section
              style={labelWrapperStyles(label.id as string)}
              onClick={handleToggleExpandWithCheck(label.value as string)}
            >
              {isActionMenuDisabled && editingLabelIdRef.current === label.id ? (
                <div className={`${modalStyle.actionBtn} ${style['action-menu-wrapper']}`}>
                  <CustomInput
                    autoFocus={isActionMenuDisabled}
                    placeholder="type here"
                    className={modalStyle.paddingLeftNone}
                    value={label.name}
                    onChange={handleOnChangeLabelNameAssigned(label, index)}
                  />
                  <div className={`cursor-default flex-start ${style['btn-action-wrapper']}`}>
                    <CustomButton
                      size="small"
                      variant="primary"
                      properties="rounded"
                      buttonClass={modalStyle.btnSize}
                      onClick={handleEditNameAssigned('save', index, label)}
                    >
                      Save
                    </CustomButton>
                    <CustomButton
                      size="small"
                      variant="primary"
                      properties="rounded"
                      buttonClass={modalStyle.btnSize}
                      onClick={handleEditNameAssigned('cancel', index, label)}
                    >
                      Cancel
                    </CustomButton>
                  </div>
                </div>
              ) : (
                <h2
                  style={mainLabelNameStyles(label.id!)}
                  className={`${style['main-label-name']}`}
                >
                  {label.name}
                </h2>
              )}

              <ActionMenu
                disabled={isActionMenuDisabled}
                className={`${modalStyle.marginSpace} ${
                  isActionMenuDisabled ? 'mono-color-medium' : 'mono-color'
                } ${style['action-menu']}`}
                overlayClassName={modalStyle.actionMenuOverlay}
                editActionOnMobile={false}
                actionItems={[
                  {
                    type: 'updated',
                    label: 'Edit',
                    onClick: handleEditClick('label', label.id!, label.name as string),
                  },

                  {
                    type: 'deleted',
                    label: 'Delete',
                    onClick: handleDelete,
                  },
                ]}
              />

              {expandedKeys.includes(label.id!) ? (
                <span style={disableArrowIconStyles}>
                  <DropupIcon />
                </span>
              ) : (
                <span style={disableArrowIconStyles}>
                  <DropdownIcon />
                </span>
              )}
            </section>

            {expandedKeys.includes(label.id as string) &&
              label.subs &&
              label.subs
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((sub) => {
                  const temp = selected?.some((preItem) => preItem.value === sub.id);

                  const isSubLabelNameSelected = selected?.some(
                    (itemSelected) => itemSelected?.value === sub.id,
                  );

                  const handleCheckboxChangeWithSub = (item: DynamicCheckboxValue) => () => {
                    handleCheckboxChange({
                      value: item.id!,
                      label: item.name!,
                    });
                  };

                  const subLabelNameStyles = () => {
                    return {
                      fontWeight: '300',
                      fontSize: '14px',
                      fontFamily: 'Roboto',
                      lineHeight: 'calc(22/14)',
                      color: `${isSubLabelNameSelected ? '#2b39d4' : ''}`,
                      width: '100%',
                    };
                  };

                  return (
                    <section
                      key={sub.id}
                      style={alignCenterStyles}
                      className={`${style['sub-label-wrapper']}`}
                    >
                      <h2 style={subLabelNameStyles()}>{sub.name}</h2>
                      <div style={flexEndStyles}>
                        <ActionMenu
                          className="mono-color"
                          editActionOnMobile={false}
                          actionItems={[
                            {
                              type: 'updated',
                              label: 'Edit',
                              onClick: handleEditClick('sub-label', sub.id, sub.name),
                            },

                            {
                              type: 'deleted',
                              label: 'Delete',
                              onClick: handleDelete,
                            },
                          ]}
                        />
                        <Checkbox
                          id={`${sub.id}`}
                          checked={temp}
                          onChange={handleCheckboxChangeWithSub({
                            value: sub.id!,
                            label: sub.name!,
                          })}
                        />
                      </div>
                    </section>
                  );
                })}
          </Fragment>
        ))
      )}

      {otherInput && (
        <div
          className={`other-field-checkbox ${
            isCheckboxList ? style['other-field-checkbox-list'] : ''
          }`}
        >
          <Checkbox value="other">
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
      )}
    </div>
  );
};

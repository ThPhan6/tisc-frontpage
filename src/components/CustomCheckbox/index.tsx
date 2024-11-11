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

import { confirmDelete } from '@/helper/common';
import { useToggleExpand } from '@/helper/hook';
import { deleteLabel, getLabels, moveSubLabelToLabel, updateLabel } from '@/services/label.api';
import { trimStart } from 'lodash';

import { CheckboxValue, CustomCheckboxProps, LabelType } from './types';
import { RootState } from '@/reducers';
import { setLabels } from '@/reducers/label';
import { SubLabel } from '@/types';

import { CustomDropDown } from '@/features/product/components';

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
  onCollClick,
  isLabel,
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isActionMenuDisabled, setIsActionMenuDisabled] = useState(false);
  const [editingValue, setEditingValue] = useState<string>('');
  const [randomId] = useState(Math.random().toString().replace(/[\D]+/g, ''));
  const [checkedItems, setCheckedItems] = useState<DynamicCheckboxValue[]>(
    (selected as DynamicCheckboxValue[]) || [],
  );
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const { expandedKeys, setExpandedKeys, handleToggleExpand } = useToggleExpand();

  const { labels } = useSelector((state: RootState) => state.label);

  const dispatch = useDispatch();

  const editingLabelIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLabel) {
      const allSubLabels = labels.reduce((pre: SubLabel[], cur) => {
        return pre.concat(cur.subs!);
      }, []);
      const selectedParents = checkedItems.map((sub) => {
        const foundSubLabel = allSubLabels.find((subLabel: SubLabel) => subLabel.id === sub.value);
        return foundSubLabel?.parent_id;
      });

      setExpandedKeys((prevExpandedKeys) => {
        const newExpandedKeys = new Set(prevExpandedKeys);

        selectedParents.forEach((parentId) => {
          if (parentId && !newExpandedKeys.has(parentId)) {
            newExpandedKeys.add(parentId);
          }
        });

        return Array.from(newExpandedKeys);
      });
    }
  }, [JSON.stringify(checkedItems.map((item) => ({ value: item.value })))]);

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
   * Handles the change event of a checkbox.
   *
   * @param sub - The checkbox value object.
   */
  const handleCheckboxChange = (sub: DynamicCheckboxValue) => () => {
    if (isActionMenuDisabled) return;

    setCheckedItems((pre) => {
      const temp = pre.some((preItem) => preItem.value === sub.value)
        ? pre.filter((item) => item.value !== sub.value)
        : pre.concat([sub]);
      if (onChange) {
        onChange(temp);
      }
      return temp;
    });
  };

  /**
   * Handles the edit action for a label or sub label.
   *
   * @param type The type of label to edit ('label' or 'sub-label').
   * @param id The ID of the label or sub-label to edit.
   * @param labelName The original label or sub-label name.
   */
  const handleEditClick = (id: string, labelName: string) => () => {
    editingLabelIdRef.current = id;
    setIsActionMenuDisabled(true);
    setEditingValue(labelName);
  };

  /**
   * Handles label or sub label deletion actions.
   *
   * @param id The ID of the label or sub label to delete.
   * @param type Type of label to remove ('label' or 'sub-label').
   * @param parentSubLabelId ID of the parent sub label.
   */
  const handleDelete = (id: string, type: LabelType, parentSubLabelId?: string) => async () => {
    confirmDelete(async () => {
      const res = await deleteLabel(id);

      if (!res) return;

      const updatedLabels =
        type === 'label'
          ? labels.filter((label) => label.id !== id)
          : labels.map((label) => {
              if (label.id !== parentSubLabelId) return label;

              const updatedSubs = label.subs?.filter((sub) => sub.id !== id);
              if (updatedSubs?.length === 0) handleToggleExpand(label.id!);

              return { ...label, subs: updatedSubs };
            });

      dispatch(setLabels(updatedLabels));
    });
  };

  /**
   * Handles the expand/collapse action for a sub-label list with a check.
   *
   * @param key The key of the label list to expand/collapse.
   * @param hasSubLabel The state to check is whether the label has the sub-label or not.
   */
  const handleToggleExpandWithCheck = (key: string, hasSubLabel: boolean) => () => {
    if (!isActionMenuDisabled && hasSubLabel) handleToggleExpand(key);
  };

  /**
   * Handle the event of changing the value of the label name input field.
   *
   * @param event Change event of the input field.
   */
  const handleOnChangeLabelNameAssigned = (event: ChangeEvent<HTMLInputElement>) =>
    setEditingValue(trimStart(event.target.value));

  /**
   * Handles the edit name action for an assigned label.
   *
   * @param type The type of label to edit ('label' or 'sub-label').
   * @param selectedValue The selected label value.
   */
  const handleEditNameAssigned =
    (selectedValue: DynamicCheckboxValue, type: LabelType) => async () => {
      if (editingValue === '') {
        message.error('Input cannot be empty!');
        return;
      }

      const res = await updateLabel(selectedValue.id!, {
        name: editingValue,
        brand_id: selectedValue.brand_id!,
      });

      if (res) {
        const actionMap = {
          label: (label: DynamicCheckboxValue) =>
            label.id === selectedValue.id ? { ...label, name: editingValue } : label,

          'sub-label': (label: DynamicCheckboxValue) =>
            label.subs
              ? {
                  ...label,
                  subs: label.subs.map((sub) =>
                    sub.id === selectedValue.id ? { ...sub, name: editingValue } : sub,
                  ),
                }
              : label,
        };

        const updatedLabels = labels.map(actionMap[type]);

        dispatch(setLabels(updatedLabels));
        setIsActionMenuDisabled(false);
      }
    };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    setIsActionMenuDisabled(false);
  };

  const handleClickOpenDropdown = (subLabelId: string) => () =>
    setOpenDropdownId(openDropdownId === subLabelId ? null : subLabelId);

  const handleMoveSubLabelToLabel =
    (subLabelId: string, labelId: string, brand_id: string) => async () => {
      const res = await moveSubLabelToLabel(subLabelId, labelId);

      if (res) {
        const updatedLabels = (await getLabels(brand_id)) as DynamicCheckboxValue[];
        dispatch(setLabels(updatedLabels as DynamicCheckboxValue[]));
      }
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

  const sortedLabels = useMemo(
    () => [...labels].sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0)),
    [labels],
  );

  const labelItems = useMemo(
    () => (currentSubLabelId: string, labelId: string, brand_id: string) =>
      labels
        .filter(({ id }) => id !== labelId)
        .map((mainLabel) => {
          return {
            key: `label-${mainLabel.id}`,
            label: mainLabel.name,
            onClick: handleMoveSubLabelToLabel(currentSubLabelId, mainLabel.id!, brand_id),
          };
        }),
    [labels, handleMoveSubLabelToLabel],
  );

  const getCursorStyle = (label: DynamicCheckboxValue) => {
    if (isActionMenuDisabled) return 'not-allowed';
    return label.subs?.length === 0 ? 'not-allowed' : 'pointer';
  };

  return (
    <>
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
                    chosenItems?.some((el) => el.value === option.value)
                      ? 'item-checkbox-active'
                      : ''
                  } item-wrapper-custom text-capitalize`}
                  style={{ minHeight: heightItem }}
                  htmlFor={`${option.value}_${index}_${randomId}`}
                  onClick={() => {
                    if (onCollClick) onCollClick(option.value as string);
                  }}
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
                  <Checkbox
                    id={`${option.value}_${index}_${randomId}`}
                    {...option}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (additionalSelected && onChangeAdditionalSelected)
                        onChangeAdditionalSelected(option.value.toString(), option, 'remove');
                      onOneChange?.(e);
                    }}
                  />

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
          sortedLabels.map((label) => (
            <Fragment key={label.id}>
              <div
                style={{ marginBottom: `${!expandedKeys.includes(label.id!) ? '8px' : '0'}` }}
                className={`${style['label-wrapper']}`}
                onClick={handleToggleExpandWithCheck(label.id!, (label.subs?.length ?? 0) > 0)}
              >
                {isActionMenuDisabled && editingLabelIdRef.current === label.id ? (
                  <div className={`${modalStyle.actionBtn} ${style['action-menu-wrapper']}`}>
                    <CustomInput
                      autoFocus={isActionMenuDisabled}
                      placeholder="type here"
                      className={modalStyle.paddingLeftNone}
                      value={editingValue}
                      onChange={handleOnChangeLabelNameAssigned}
                    />
                    <div className={`cursor-default flex-start ${style['btn-action-wrapper']}`}>
                      <CustomButton
                        size="small"
                        variant="primary"
                        properties="rounded"
                        buttonClass={modalStyle.btnSize}
                        onClick={handleEditNameAssigned(label, 'label')}
                      >
                        Save
                      </CustomButton>
                      <CustomButton
                        size="small"
                        variant="primary"
                        properties="rounded"
                        buttonClass={modalStyle.btnSize}
                        onClick={handleCancel}
                      >
                        Cancel
                      </CustomButton>
                    </div>
                  </div>
                ) : (
                  <span
                    style={{
                      fontWeight: `${
                        expandedKeys.includes(label.id!) && (label.subs?.length ?? 0) > 0
                          ? '500'
                          : ''
                      }`,
                    }}
                    className={`main-label-name w-full text-hover-normal ${
                      isAnySubLabelChecked(label.id!) ? style['color-checked'] : ''
                    }`}
                  >
                    {label.name}
                  </span>
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
                      onClick: handleEditClick(label.id!, label.name as string),
                    },

                    {
                      type: 'deleted',
                      label: 'Delete',
                      onClick: handleDelete(label.id!, 'label'),
                    },
                  ]}
                />

                <span
                  style={{
                    cursor: getCursorStyle(label),
                  }}
                  className={`${style['arrow-icon']}`}
                >
                  {expandedKeys.includes(label.id!) ? <DropupIcon /> : <DropdownIcon />}
                </span>
              </div>

              <div
                className={`${style['expandable-section']} ${
                  expandedKeys.includes(label.id!) ? style['expanded'] : ''
                }`}
              >
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

                      return (
                        <section
                          key={sub.id}
                          className={`${style['sub-label-wrapper']}`}
                          onClick={handleCheckboxChange({ value: sub.id, label: sub.name })}
                        >
                          {isActionMenuDisabled && editingLabelIdRef.current === sub.id ? (
                            <div
                              className={`${modalStyle.actionBtn} ${style['action-menu-wrapper']}`}
                            >
                              <CustomInput
                                autoFocus={isActionMenuDisabled}
                                placeholder="type here"
                                className={modalStyle.paddingLeftNone}
                                value={editingValue}
                                onChange={handleOnChangeLabelNameAssigned}
                              />
                              <div
                                className={`cursor-default flex-start ${style['btn-action-wrapper']}`}
                              >
                                <CustomButton
                                  size="small"
                                  variant="primary"
                                  properties="rounded"
                                  buttonClass={modalStyle.btnSize}
                                  onClick={handleEditNameAssigned(
                                    {
                                      id: sub.id,
                                      label: sub.name,
                                      brand_id: sub.brand_id,
                                      value: sub.id,
                                    },
                                    'sub-label',
                                  )}
                                >
                                  Save
                                </CustomButton>
                                <CustomButton
                                  size="small"
                                  variant="primary"
                                  properties="rounded"
                                  buttonClass={modalStyle.btnSize}
                                  onClick={handleCancel}
                                >
                                  Cancel
                                </CustomButton>
                              </div>
                            </div>
                          ) : (
                            <span
                              className={`sub-label-name w-full text-hover-normal ${
                                isSubLabelNameSelected ? style['color-checked'] : ''
                              }`}
                              style={{ fontWeight: `${isSubLabelNameSelected ? 500 : ''}` }}
                            >
                              {sub.name}
                            </span>
                          )}

                          <div className={`${style['action-sub-label-wrapper']}`}>
                            <ActionMenu
                              disabled={isActionMenuDisabled}
                              className={`${modalStyle.marginSpace} ${
                                isActionMenuDisabled ? 'mono-color-medium' : 'mono-color'
                              }`}
                              overlayClassName={modalStyle.actionMenuOverlay}
                              editActionOnMobile={false}
                              containerStyle={{ position: 'relative' }}
                              actionItems={[
                                {
                                  type: 'updated',
                                  label: 'Edit',
                                  additionalStyle: { boxShadow: 'none' },
                                  onClick: handleEditClick(sub.id, sub.name),
                                },

                                {
                                  type: 'move_to',
                                  label: (
                                    <div
                                      onClick={(event) => {
                                        event.stopPropagation();
                                      }}
                                    >
                                      <CustomDropDown
                                        placement="bottomLeft"
                                        menuStyle={{
                                          position: 'absolute',
                                          left: 80,
                                          top: 0,
                                          width: 'max-content',
                                          height: 'fit-content',
                                        }}
                                        hideDropdownIcon
                                        visible={openDropdownId === sub.id}
                                        items={labelItems(sub.id, sub.parent_id, label.brand_id!)}
                                        onVisibleChange={handleClickOpenDropdown(sub.id)}
                                      >
                                        Move to
                                      </CustomDropDown>
                                    </div>
                                  ),
                                  onClick: handleClickOpenDropdown(sub.id),
                                },

                                {
                                  type: 'deleted',
                                  label: 'Delete',
                                  onClick: handleDelete(sub.id, 'sub-label', sub.parent_id),
                                },
                              ]}
                            />
                            <Checkbox
                              id={`${sub.id}`}
                              checked={temp}
                              disabled={isActionMenuDisabled}
                            />
                          </div>
                        </section>
                      );
                    })}
              </div>
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
    </>
  );
};

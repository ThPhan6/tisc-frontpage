import { Modal } from 'antd';
import type { FC, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { ReactComponent as CloseIcon } from '../../assets/icons/action-close-open-icon.svg';
import CustomButton from '@/components/Button';
import { MainTitle } from '@/components/Typography';
import DropdownRadioList from '@/components/CustomRadio/DropdownRadioList';
import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import GroupRadioList from '@/components/CustomRadio/RadioList';
import CheckboxList from '@/components/CustomCheckbox/CheckboxList';
import DropdownCategoryList from '@/pages/TISC/Product/Configuration/components/CategoryDropdown';

import type { CheckboxOption } from '@/components/CustomCheckbox/CheckboxList';
import type { DropdownRadioItem } from '@/components/CustomRadio/DropdownRadioList';
import type { DropdownCheckboxItem } from '@/components/CustomCheckbox/DropdownCheckboxList';
import type { IRadioListOption } from '@/components/CustomRadio/RadioList';

import styles from './styles/Popover.less';

interface PopoverProps {
  title: string | ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  /// dropdown radio list
  dropdownRadioList?: DropdownRadioItem[];
  dropDownRadioTitle?: (data: DropdownRadioItem) => string | number | ReactNode;

  /// group radio list
  groupRadioList?: IRadioListOption[];

  /// dropdown checkbox list
  dropdownCheckboxList?: DropdownCheckboxItem[];
  dropdownCheckboxTitle?: (data: DropdownCheckboxItem) => string | number | ReactNode;

  // checkbox listTab
  checkboxList?: CheckboxOption;

  // category dropdown checkbox
  categoryDropdown?: boolean;

  // active value
  chosenValue?: any;
  setChosenValue?: (value: any) => void;

  // extra top action
  extraTopAction?: ReactNode;
  noFooter?: boolean;
}

const Popover: FC<PopoverProps> = ({
  title,
  visible,
  setVisible,
  dropdownRadioList,
  dropDownRadioTitle,
  dropdownCheckboxList,
  dropdownCheckboxTitle,
  groupRadioList,
  checkboxList,
  categoryDropdown,
  chosenValue,
  setChosenValue,
  extraTopAction,
  noFooter,
}) => {
  const [currentValue, setCurrentValue] = useState<any>(chosenValue);

  useEffect(() => {
    setCurrentValue(chosenValue);
  }, [chosenValue]);

  const renderChildren = () => {
    /// for dropdown radio list
    if (dropdownRadioList) {
      return (
        <DropdownRadioList
          selected={currentValue}
          chosenItem={chosenValue}
          data={dropdownRadioList}
          renderTitle={dropDownRadioTitle}
          onChange={setCurrentValue}
        />
      );
    }
    // group radio list
    if (groupRadioList) {
      return (
        <GroupRadioList
          selected={currentValue}
          chosenItem={chosenValue}
          data={groupRadioList}
          onChange={setCurrentValue}
        />
      );
    }
    /// drodown checkbox list
    if (dropdownCheckboxList) {
      return (
        <DropdownCheckboxList
          selected={currentValue}
          chosenItem={chosenValue}
          data={dropdownCheckboxList}
          renderTitle={dropdownCheckboxTitle}
          onChange={setCurrentValue}
        />
      );
    }
    if (checkboxList) {
      return (
        <CheckboxList
          selected={currentValue}
          chosenItem={chosenValue}
          data={checkboxList}
          onChange={setCurrentValue}
        />
      );
    }

    if (categoryDropdown) {
      return (
        <DropdownCategoryList
          selected={currentValue}
          chosenItem={chosenValue}
          onChange={setCurrentValue}
        />
      );
    }

    /// default
    return null;
  };

  const onCancel = () => {
    // reset current value
    setCurrentValue(chosenValue);
    // onchange selected Value
    if (setChosenValue) {
      setChosenValue(chosenValue);
    }
    // hide popup
    setVisible(false);
  };

  const handleDone = () => {
    // onchange selected Value
    if (setChosenValue) {
      setChosenValue(currentValue);
    }
    // hide popup
    setVisible(false);
  };

  return (
    <div>
      <Modal
        title={
          <MainTitle level={3} customClass="text-uppercase">
            {title}
          </MainTitle>
        }
        centered
        visible={visible}
        onCancel={onCancel}
        width={576}
        closeIcon={<CloseIcon />}
        footer={
          noFooter ? null : (
            <CustomButton
              size="small"
              variant="primary"
              properties="rounded"
              buttonClass="done-btn"
              onClick={handleDone}
            >
              Done
            </CustomButton>
          )
        }
        className={styles.customPopover}
      >
        {extraTopAction}
        {renderChildren()}
      </Modal>
    </div>
  );
};
export default Popover;

import { Modal } from 'antd';
import type { FC, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { ReactComponent as CloseIcon } from '../../assets/icons/action-close-open-icon.svg';
import CustomButton from '@/components/Button';
import { MainTitle, BodyText } from '@/components/Typography';
import DropdownRadioList from '@/components/CustomRadio/DropdownRadioList';
import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import GroupRadioList from '@/components/CustomRadio/RadioList';
import CheckboxList from '@/components/CustomCheckbox/CheckboxList';
import { DropdownCategoryList } from '@/features/categories/components';
import { Empty } from 'antd';
import { isEmpty } from 'lodash';
import type { CheckboxOption } from '@/components/CustomCheckbox/CheckboxList';
import type { DropdownRadioItem } from '@/components/CustomRadio/DropdownRadioList';
import type { DropdownCheckboxItem } from '@/components/CustomCheckbox/DropdownCheckboxList';
import type { RadioListOption } from '@/components/CustomRadio/RadioList';

import styles from './styles/Popover.less';

export interface PopoverProps {
  title: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  /// dropdown radio list
  dropdownRadioList?: DropdownRadioItem[];
  dropDownRadioTitle?: (data: DropdownRadioItem) => string | number | ReactNode;

  /// group radio list
  groupRadioList?: RadioListOption[];

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

  className?: string;

  // combinable checkbox value ?
  combinableCheckbox?: boolean;

  onFormSubmit?: () => void;
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
  className,
  combinableCheckbox,
  children,
  onFormSubmit,
}) => {
  const [currentValue, setCurrentValue] = useState<any>(chosenValue);

  useEffect(() => {
    setCurrentValue(chosenValue);
  }, [chosenValue]);

  const renderEmptyData = () => {
    return (
      <div className={styles.popoverEmptyData}>
        <Empty description={<BodyText level={3}>No Data</BodyText>} />
      </div>
    );
  };

  const renderChildren = () => {
    /// for dropdown radio list
    if (dropdownRadioList) {
      if (dropdownRadioList.length == 1 && isEmpty(dropdownRadioList[0].options)) {
        return renderEmptyData();
      }
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
      if (groupRadioList.length == 1 && isEmpty(groupRadioList[0].options)) {
        return renderEmptyData();
      }
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
      if (dropdownCheckboxList.length == 1 && isEmpty(dropdownCheckboxList[0].options)) {
        return renderEmptyData();
      }
      return (
        <DropdownCheckboxList
          selected={currentValue}
          chosenItem={chosenValue}
          data={dropdownCheckboxList}
          renderTitle={dropdownCheckboxTitle}
          onChange={setCurrentValue}
          combinable={combinableCheckbox}
        />
      );
    }
    if (checkboxList) {
      if (isEmpty(checkboxList)) {
        return renderEmptyData();
      }
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
    if (onFormSubmit) {
      return onFormSubmit();
    }

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
        className={`${styles.customPopover} ${className ?? ''}`}
      >
        {extraTopAction}
        {renderChildren()}
        {children}
      </Modal>
    </div>
  );
};
export default Popover;

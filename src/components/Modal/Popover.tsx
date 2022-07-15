import { Modal } from 'antd';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { ReactComponent as CloseIcon } from '../../assets/icons/action-close-open-icon.svg';
import CustomButton from '@/components/Button';
import { MainTitle } from '@/components/Typography';
import DropdownRadioList from '@/components/CustomRadio/DropdownRadioList';
import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import GroupRadioList from '@/components/CustomRadio/RadioList';
import type { IDropdownRadioItemList } from '@/components/CustomRadio/DropdownRadioList';
import type { IDropdownCheckboxItemList } from '@/components/CustomCheckbox/DropdownCheckboxList';
import type { IRadioListOption } from '@/components/CustomRadio/RadioList';

import styles from './styles/Popover.less';

interface IPopover {
  title: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  /// dropdown radio list
  dropdownRadioList?: IDropdownRadioItemList[];
  dropDownRadioTitle?: (data: IDropdownRadioItemList) => string | number | ReactNode;

  /// group radio list
  groupRadioList?: IRadioListOption[];

  /// dropdown checkbox list
  dropdownCheckboxList?: IDropdownCheckboxItemList[];
  dropdownCheckboxTitle?: (data: IDropdownCheckboxItemList) => string | number | ReactNode;

  // active value
  chosenValue?: any;
  setChosenValue?: (value: any) => void;

  // extra top action
  extraTopAction?: ReactNode;
  noFooter?: boolean;
}
const Popover: FC<IPopover> = ({
  title,
  visible,
  setVisible,
  dropdownRadioList,
  dropDownRadioTitle,
  dropdownCheckboxList,
  dropdownCheckboxTitle,
  groupRadioList,
  chosenValue,
  setChosenValue,
  extraTopAction,
  noFooter,
}) => {
  const [currentValue, setCurrentValue] = useState<any>(chosenValue);

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
          noFooter ? undefined : (
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

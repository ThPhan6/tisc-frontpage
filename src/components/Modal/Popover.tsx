import { Modal } from 'antd';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { ReactComponent as CloseIcon } from '../../assets/icons/action-close-open-icon.svg';
import CustomButton from '@/components/Button';
import { MainTitle } from '@/components/Typography';
import DropdownRadioList from '@/components/CustomRadio/DropdownRadioList';
import type { IDropdownRadioItemList } from '@/components/CustomRadio/DropdownRadioList';

import styles from './styles/Popover.less';

interface IPopover {
  title: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  dropdownRadioList?: IDropdownRadioItemList[];
  dropDownRadioTitle?: (data: IDropdownRadioItemList) => string | number | ReactNode;
  chosenValue?: any;
  setChosenValue?: (value: any) => void;
}
const Popover: FC<IPopover> = ({
  title,
  visible,
  setVisible,
  dropdownRadioList,
  dropDownRadioTitle,
  chosenValue,
  setChosenValue,
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
          <CustomButton
            size="small"
            variant="primary"
            properties="rounded"
            buttonClass="done-btn"
            onClick={handleDone}
          >
            Done
          </CustomButton>
        }
        className={styles.customPopover}
      >
        {renderChildren()}
      </Modal>
    </div>
  );
};
export default Popover;

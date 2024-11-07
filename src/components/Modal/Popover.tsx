import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { Modal } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/action-close-open-icon.svg';
import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';
import { ReactComponent as SearchIcon } from '@/assets/icons/ic-search.svg';

import { useScreen } from '@/helper/common';
import { isEmpty } from 'lodash';

import { CheckboxValue, DropdownCheckboxItem } from '../CustomCheckbox/types';
import { DropdownRadioItem } from '../CustomRadio/types';
import { closeModal } from '@/reducers/modal';

import CustomButton from '@/components/Button';
import CheckboxList from '@/components/CustomCheckbox/CheckboxList';
import type { CheckboxOption } from '@/components/CustomCheckbox/CheckboxList';
import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import DropdownRadioList from '@/components/CustomRadio/DropdownRadioList';
import GroupRadioList from '@/components/CustomRadio/RadioList';
import type { RadioListOption } from '@/components/CustomRadio/RadioList';
import { MainTitle } from '@/components/Typography';
import { DropdownCategoryList } from '@/features/categories/components/CategoryDropdown';

import { CustomCheckbox } from '../CustomCheckbox';
import { EmptyOne } from '../Empty';
import { CustomInput } from '../Form/CustomInput';
import { MobileDrawer } from './Drawer';
import styles from './styles/Popover.less';

export interface PopoverProps {
  title: string;
  titlePosition?: 'left' | 'center';
  visible: boolean;
  setVisible?: (visible: boolean) => void;
  /// dropdown radio list
  dropdownRadioList?: DropdownRadioItem[];
  dropDownRadioTitle?: (data: DropdownRadioItem) => string | number | ReactNode;

  /// group radio list
  groupRadioList?: RadioListOption[];
  disabledDropDownRadio?: boolean;

  /// group checkbox list
  groupCheckboxList?: CheckboxValue[];

  /// Currently, only implemented for dropdown checkbox list and drop down radio list
  collapseLevel?: '1' | '2';

  /// dropdown checkbox list
  dropdownCheckboxList?: DropdownCheckboxItem[];
  dropdownCheckboxTitle?: (data: DropdownCheckboxItem) => string | number | ReactNode;

  // checkbox listTab
  checkboxList?: CheckboxOption;
  leftCheckboxList?: CheckboxOption;
  rightCheckboxList?: CheckboxOption;

  // category dropdown checkbox
  categoryDropdown?: boolean;

  // active value
  chosenValue?: any;
  rightChosenValue?: any;
  setChosenValue?: (value: any) => void;
  setRightChosenValue?: (value: any) => void;

  // extra top action
  extraTopAction?: ReactNode;
  noFooter?: boolean;
  cancelSaveFooter?: boolean;

  className?: string;

  // combinable checkbox value ?
  combinableCheckbox?: boolean;

  onFormSubmit?: (v?: any) => void;
  submitButtonStatus?: boolean;
  disabledSubmit?: boolean;

  // clear select on close
  clearOnClose?: boolean;

  hasOrtherInput?: boolean;

  forceUpdateCurrentValue?: boolean;

  secondaryModal?: boolean;

  maskClosable?: boolean;

  width?: string | number;
  notScrollWholeContent?: boolean;

  onCountrySearch?: (e?: any) => void;
  onCollClick?: (e?: any) => void;
  styleButtonCancel?: React.CSSProperties;
}

const Popover: FC<PopoverProps> = ({
  title,
  titlePosition = 'left',
  visible,
  setVisible,
  dropdownRadioList,
  disabledDropDownRadio,
  dropDownRadioTitle,
  dropdownCheckboxList,
  dropdownCheckboxTitle,
  groupRadioList,
  groupCheckboxList,
  checkboxList,
  leftCheckboxList,
  rightCheckboxList,
  categoryDropdown,
  chosenValue,
  rightChosenValue,
  setChosenValue,
  setRightChosenValue,
  extraTopAction,
  noFooter,
  className,
  combinableCheckbox,
  children,
  onFormSubmit,
  submitButtonStatus,
  disabledSubmit,
  clearOnClose,
  hasOrtherInput = true,
  forceUpdateCurrentValue = true,
  secondaryModal,
  maskClosable,
  width,
  cancelSaveFooter,
  collapseLevel,
  notScrollWholeContent,
  onCountrySearch,
  onCollClick,
  styleButtonCancel,
}) => {
  const { isMobile } = useScreen();

  const [currentValue, setCurrentValue] = useState<any>(chosenValue);
  const [rightCurrentValue, setRightCurrentValue] = useState<any>(rightChosenValue);
  useEffect(() => {
    if (forceUpdateCurrentValue) {
      setCurrentValue(chosenValue);
    }
  }, [chosenValue]);

  const renderEmptyData = () => {
    return (
      <div className={styles.popoverEmptyData}>
        <EmptyOne isCenter />
      </div>
    );
  };

  const renderChildren = () => {
    /// for dropdown radio list
    if (dropdownRadioList) {
      if (dropdownRadioList.length <= 1 && isEmpty(dropdownRadioList?.[0]?.options)) {
        return renderEmptyData();
      }
      return (
        <DropdownRadioList
          selected={currentValue}
          chosenItem={chosenValue}
          data={dropdownRadioList}
          renderTitle={dropDownRadioTitle}
          onChange={setCurrentValue}
          radioDisabled={disabledDropDownRadio}
          collapseLevel={collapseLevel}
        />
      );
    }
    // group radio list
    if (groupRadioList) {
      if (groupRadioList.length == 1 && isEmpty(groupRadioList[0].options)) {
        return renderEmptyData();
      }
      return (
        <GroupRadioList selected={currentValue} data={groupRadioList} onChange={setCurrentValue} />
      );
    }
    /// drodown checkbox list
    if (dropdownCheckboxList) {
      if (dropdownCheckboxList.length <= 1 && isEmpty(dropdownCheckboxList?.[0]?.options)) {
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
          collapseLevel={collapseLevel}
        />
      );
    }

    /// group checkbox list
    if (groupCheckboxList) {
      return (
        <CustomCheckbox
          options={groupCheckboxList}
          isCheckboxList
          otherInput={hasOrtherInput}
          selected={currentValue}
          onChange={setCurrentValue}
        />
      );
    }

    if (leftCheckboxList && rightCheckboxList) {
      if (isEmpty(leftCheckboxList)) {
        return renderEmptyData();
      }
      return (
        <div className={`d-flex ${styles.sidePopover}`}>
          <div className={'flex-grow side-container'}>
            <CheckboxList
              selected={currentValue}
              chosenItem={chosenValue}
              data={leftCheckboxList}
              onChange={setCurrentValue}
              isExpanded={false}
              onCollClick={title === 'SELECT COLLECTION & LABEL' ? onCollClick : undefined}
            />
          </div>
          <div className={'flex-grow side-container'}>
            <CheckboxList
              selected={rightCurrentValue}
              chosenItem={rightChosenValue}
              data={rightCheckboxList}
              onChange={setRightCurrentValue}
              isExpanded={true}
            />
          </div>
        </div>
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

  const onClose = () => {
    setVisible?.(false);
    closeModal();

    if (clearOnClose) {
      setChosenValue?.(undefined);
    }
  };

  const onCancel = () => {
    // if (clearOnClose) {
    //   setChosenValue?.(undefined);
    // } else {
    //   // reset current value
    //   setCurrentValue(chosenValue);
    //   // onchange selected Value
    //   if (setChosenValue) {
    //     setChosenValue(chosenValue);
    //   }
    // }

    // reset current value
    setCurrentValue(chosenValue);
    // onchange selected Value
    if (setChosenValue) {
      setChosenValue(chosenValue);
    }
    if (setRightChosenValue) {
      setRightChosenValue(rightChosenValue);
    }

    // hide popup
    onClose();
  };

  const handleDone = () => {
    if (onFormSubmit) {
      onFormSubmit(currentValue);
      return;
    }

    // onchange selected Value
    if (setChosenValue) {
      setChosenValue(currentValue);
    }
    // onchange selected Value for right list
    if (setRightChosenValue) {
      setRightChosenValue(rightCurrentValue);
    }

    // hide popup
    onClose();
  };

  const renderDoneFooter = (label: string = 'Done') => {
    return submitButtonStatus ? (
      <CustomButton
        size="small"
        variant="primary"
        properties="rounded"
        buttonClass={styles.submitButton}
        icon={<CheckSuccessIcon />}
      />
    ) : (
      <div className="done-btn">
        {title === 'SELECT COUNTRY' && <SearchIcon />}
        {title === 'SELECT COUNTRY' && (
          <CustomInput
            placeholder="Search"
            style={{ paddingLeft: 16, paddingRight: 16 }}
            onChange={onCountrySearch}
          />
        )}
        <CustomButton
          size="small"
          variant="primary"
          properties="rounded"
          disabled={disabledSubmit}
          onClick={handleDone}
        >
          {label}
        </CustomButton>
      </div>
    );
  };

  const renderButtonFooter = () => {
    if (cancelSaveFooter) {
      return (
        <div className={`${styles.footerButtons} flex-end`} style={{ gap: 16 }}>
          <CustomButton
            size="small"
            variant="primary"
            properties="rounded"
            disabled={disabledSubmit}
            onClick={onCancel}
          >
            Cancel
          </CustomButton>

          {renderDoneFooter('Save')}
        </div>
      );
    }

    return renderDoneFooter();
  };

  const renderMobileContent = () => (
    <div className={`${styles.customPopoverMobile} ${className}`}>
      {extraTopAction}
      {renderChildren()}
      {children}
      {noFooter ? null : (
        <div className={`flex-end ${styles.popoverFooterMobile}`}>{renderButtonFooter()}</div>
      )}
    </div>
  );

  if (isMobile) {
    if (secondaryModal) {
      return (
        <MobileDrawer onClose={onCancel} visible={visible} title={title}>
          {renderMobileContent()}
        </MobileDrawer>
      );
    }
    return renderMobileContent();
  }

  return (
    <div>
      <Modal
        title={
          <MainTitle
            level={3}
            customClass={`text-uppercase text-overflow ${styles.headingTitle}`}
            style={{ maxWidth: '95%' }}
          >
            {title}
          </MainTitle>
        }
        centered
        maskClosable={maskClosable}
        visible={visible}
        onCancel={onCancel}
        width={width ? width : 576}
        closeIcon={<CloseIcon style={{ color: '#000' }} />}
        footer={noFooter ? null : renderButtonFooter()}
        className={`${styles.customPopover} ${className ?? ''} ${
          titlePosition === 'center' ? styles.titlePositionCenter : ''
        } ${notScrollWholeContent ? styles['customPopover-notScroll'] : ''}`}
      >
        {extraTopAction}
        {renderChildren()}
        {children}
      </Modal>
    </div>
  );
};
export default Popover;

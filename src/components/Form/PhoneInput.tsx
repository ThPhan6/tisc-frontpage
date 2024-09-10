import { FC, useEffect, useState } from 'react';

import { Input } from 'antd';

import { ReactComponent as RemoveIcon } from '@/assets/icons/action-remove-icon.svg';

import { formatPhoneCode, validatePhoneNumber } from '@/helper/utils';
import { trimStart } from 'lodash';

import { PhoneInputProps } from './types';

import { BodyText } from '../Typography';
import styles from './styles/PhoneInput.less';

export const PhoneInput: FC<PhoneInputProps> = ({
  codePlaceholder,
  phonePlaceholder,
  onChange,
  defaultValue,
  value,
  codeReadOnly,
  phoneNumberReadOnly,
  status,
  containerClass,
  deleteIcon,
}) => {
  const [phoneInputValue, setPhoneInputValue] = useState({
    zoneCode: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (
      value &&
      (value.phoneNumber !== phoneInputValue.phoneNumber ||
        value.zoneCode !== phoneInputValue.zoneCode)
    ) {
      setPhoneInputValue({ ...value });
    }
  }, [value]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = trimStart(e.target.value ?? '');
    if (phoneNumber != '' && !validatePhoneNumber(phoneNumber) && e.target.name === 'phoneNumber') {
      return;
    }
    const newPhoneInputValue = {
      ...phoneInputValue,
      [e.target.name]: phoneNumber,
    };
    setPhoneInputValue({ ...newPhoneInputValue });
    if (onChange) {
      onChange({ ...newPhoneInputValue });
    }
  };

  const getWidthZoneCode = () => {
    const zoneCodeLength = phoneInputValue.zoneCode?.length ?? 0;
    if (zoneCodeLength <= 2) {
      return '16px';
    }
    if (zoneCodeLength >= 10) {
      return '80px';
    }
    return zoneCodeLength * 8 + 'px';
  };

  const handleClearPhoneInput = () => {
    if (onChange) {
      onChange({
        zoneCode: phoneInputValue.zoneCode,
        phoneNumber: '',
      });
    }
  };

  return (
    <div
      className={`${styles['phone-input-container']} ${
        status ? styles[`${status}-status`] : ''
      } ${containerClass} `}
    >
      <div className={styles['wrapper-code-input']}>
        <BodyText level={5} fontFamily="Roboto">
          +
        </BodyText>
        <Input
          readOnly={codeReadOnly}
          className={styles['code-input']}
          placeholder={codePlaceholder || '00'}
          value={formatPhoneCode(phoneInputValue.zoneCode, true)}
          onChange={handleOnChange}
          name="zoneCode"
          defaultValue={defaultValue?.zoneCode || ''}
          style={{
            width: getWidthZoneCode(),
          }}
        />
      </div>
      <Input
        defaultValue={defaultValue?.phoneNumber || ''}
        readOnly={phoneNumberReadOnly}
        placeholder={phonePlaceholder}
        value={value?.phoneNumber || phoneInputValue.phoneNumber}
        className={`
          ${styles['phone-input']}
          phone-input-custom-text
        `}
        onChange={handleOnChange}
        name="phoneNumber"
        pattern=""
      />
      {phoneInputValue.phoneNumber && deleteIcon ? (
        <RemoveIcon className={styles.removePhoneInputText} onClick={handleClearPhoneInput} />
      ) : null}
    </div>
  );
};

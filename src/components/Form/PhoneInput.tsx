import { Input } from 'antd';
import { FC, useEffect, useState } from 'react';
import { BodyText } from '../Typography';
import styles from './styles/PhoneInput.less';
import { PhoneInputProps } from './types';

export const PhoneInput: FC<PhoneInputProps> = ({
  codePlaceholder,
  phonePlaceholder,
  onChange,
  defaultValue,
  value,
  codeReadOnly,
  phoneNumberReadOnly,
  status,
  colorPlaceholder,
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
    const newPhoneInputValue = {
      ...phoneInputValue,
      [e.target.name]: e.target.value,
    };
    setPhoneInputValue({ ...newPhoneInputValue });
    if (onChange) {
      onChange({ ...newPhoneInputValue });
    }
  };

  const getWidthZoneCode = () => {
    const zoneCodeLength = phoneInputValue.zoneCode.length;
    if (zoneCodeLength <= 2) {
      return '16px';
    }
    if (zoneCodeLength >= 10) {
      return '80px';
    }
    return zoneCodeLength * 8 + 'px';
  };

  return (
    <div className={`${styles['phone-input-container']} ${status && styles[`${status}-status`]} `}>
      <div
        className={`${styles['wrapper-code-input']} ${
          colorPlaceholder === 'mono' && styles['color-placeholder']
        }`}
      >
        <BodyText level={5} fontFamily="Roboto">
          +
        </BodyText>
        <Input
          readOnly={codeReadOnly}
          className={styles['code-input']}
          placeholder={codePlaceholder || '00'}
          value={value?.zoneCode || phoneInputValue.zoneCode}
          type="number"
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
        className={styles['phone-input']}
        type="number"
        onChange={handleOnChange}
        name="phoneNumber"
      />
    </div>
  );
};

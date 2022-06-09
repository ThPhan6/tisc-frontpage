import { Input } from 'antd';
import { FC, useState } from 'react';
import { BodyText } from '../Typography';
import styles from './styles/PhoneInput.less';
import { PhoneInputProps, PhoneInputValueProp } from './types';

export const PhoneInput: FC<PhoneInputProps> = ({
  codePlaceholder,
  phonePlaceholder,
  onChange,
  defaultValue,
  codeReadOnly,
  phoneNumberReadOnly,
}) => {
  const [phoneInputValue, setPhoneInputValue] = useState<PhoneInputValueProp>(
    defaultValue || {
      zoneCode: '',
      phoneNumber: '',
    },
  );

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneInputValue = {
      ...phoneInputValue,
      [e.target.name]: e.target.value,
    };
    setPhoneInputValue(newPhoneInputValue);
    if (onChange) {
      onChange({ ...newPhoneInputValue });
    }
  };

  return (
    <div className={styles['phone-input-container']}>
      <div className={styles['wrapper-code-input']}>
        <BodyText level={5} fontFamily="Roboto">
          +
        </BodyText>
        <Input
          readOnly={codeReadOnly}
          className={styles['code-input']}
          placeholder={codePlaceholder || '00'}
          value={phoneInputValue.zoneCode}
          type="number"
          onChange={handleOnChange}
          name="zoneCode"
        />
      </div>
      <Input
        readOnly={phoneNumberReadOnly}
        placeholder={phonePlaceholder}
        value={phoneInputValue.phoneNumber}
        className={styles['phone-input']}
        type="number"
        onChange={handleOnChange}
        name="phoneNumber"
      />
    </div>
  );
};

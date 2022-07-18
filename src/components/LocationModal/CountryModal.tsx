import Popover from '@/components/Modal/Popover';
import { getCountries } from '@/services/location.api';
import { ICountry } from '@/types';
import { FC, useEffect, useState } from 'react';
import { formatPhoneCode } from '@/helper/utils';
import styles from './styles/CountryModal.less';

const CountryModal: FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: any;
  setChosenValue: (value: any) => void;
  withPhoneCode?: boolean;
}> = ({ visible, setVisible, chosenValue, setChosenValue, withPhoneCode }) => {
  const [countries, setCountries] = useState<ICountry[]>([]);

  const getCountryList = () => {
    getCountries().then((res) => {
      const newCountries = [{ name: 'Global', id: '-1', phone_code: '00' }, ...res];
      setCountries(newCountries);
      if (chosenValue.value) {
        const checked = newCountries.find((item) => item.id === chosenValue.value);
        if (checked) {
          setChosenValue({
            label: checked.name,
            value: checked.id,
            phoneCode: checked.phone_code,
          });
        }
      }
    });
  };

  useEffect(() => {
    getCountryList();
  }, []);

  return (
    <Popover
      title="SELECT COUNTRY"
      visible={visible}
      setVisible={setVisible}
      chosenValue={chosenValue}
      setChosenValue={(data) => {
        const selectedCountry = countries.find((country) => country.id === data.value);
        if (selectedCountry) {
          setChosenValue({
            label: selectedCountry.name,
            value: selectedCountry.id,
            phoneCode: selectedCountry.phone_code,
          });
        }
      }}
      groupRadioList={[
        {
          options: countries.map((country) => {
            return {
              label: (
                <span>
                  {country.name}{' '}
                  {withPhoneCode ? (
                    <span className={styles.phone_code}>
                      {country.id !== '-1' ? formatPhoneCode(country.phone_code) : ''}
                    </span>
                  ) : (
                    ''
                  )}
                </span>
              ),
              value: country.id,
              customClass: country.id === '-1' ? styles.headingClass : '',
            };
          }),
        },
      ]}
    />
  );
};
export default CountryModal;

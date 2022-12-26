import { FC, useEffect, useState } from 'react';

import { formatPhoneCode } from '@/helper/utils';

import { Country } from '../type';

import Popover from '@/components/Modal/Popover';

import { getCountries } from '../api';
import styles from './CountryModal.less';

const CountryModal: FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: any;
  setChosenValue: (value: any) => void;
  withPhoneCode?: boolean;
  hasGlobal?: boolean;
}> = ({ visible, setVisible, chosenValue, setChosenValue, withPhoneCode, hasGlobal = true }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const GlobalItem: Country = { name: 'Global', id: '-1', phone_code: '00' };
  const getCountryList = () => {
    getCountries().then((res) => {
      let newCountries: Country[] = [];
      newCountries = [GlobalItem, ...res];
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
      secondaryModal
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
              customClass: `${
                country.id === '-1' ? (hasGlobal ? styles.headingClass : styles.muteGlobal) : ''
              } `,
            };
          }),
        },
      ]}
    />
  );
};
export default CountryModal;

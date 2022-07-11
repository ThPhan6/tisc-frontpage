import Popover from '@/components/Modal/Popover';
import { getCountries } from '@/services/location.api';
import { ICountry } from '@/types/location.types';
import { Radio } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from '../styles/CountryModal.less';

const CountryModal: FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: any;
  setChosenValue?: (value: any) => void;
}> = ({ visible, setVisible, chosenValue, setChosenValue }) => {
  const [countries, setCountries] = useState<ICountry[]>([]);

  const getCountryList = () => {
    getCountries().then(setCountries);
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
      setChosenValue={setChosenValue}
      groupRadioList={[
        {
          heading: (
            <div className={styles.customHeading}>
              <span className={styles.customTitle}>Global</span>
              <Radio />
            </div>
          ),
          options: countries.map((country) => {
            return {
              label: country.name,
              value: country.id,
            };
          }),
        },
      ]}
    />
  );
};
export default CountryModal;

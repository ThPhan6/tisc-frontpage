import Popover from '@/components/Modal/Popover';
import { getCitiesByCountryIdAndStateId } from '@/services/location.api';
import { ICity } from '@/types/location.types';
import { Radio } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from '../styles/CountryModal.less';

const CityModal: FC<{
  stateId: string;
  countryId: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: any;
  setChosenValue: (value: any) => void;
}> = ({ visible, setVisible, chosenValue, setChosenValue, stateId, countryId }) => {
  const [cities, setCities] = useState<ICity[]>([]);

  const getCityList = () => {
    getCitiesByCountryIdAndStateId(countryId, stateId).then((res) => {
      if (res) {
        if (!res.find((item) => item.id === chosenValue.value)) {
          setChosenValue({ id: '', label: '' });
        }
        setCities(res);
      }
    });
  };

  useEffect(() => {
    if (stateId) {
      getCityList();
    } else {
      setChosenValue({ id: '', label: '' });
    }
  }, [stateId]);

  return (
    <Popover
      title="SELECT CITY / TOWN"
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
          options: cities.map((city) => {
            return {
              label: city.name,
              value: city.id,
            };
          }),
        },
      ]}
    />
  );
};
export default CityModal;

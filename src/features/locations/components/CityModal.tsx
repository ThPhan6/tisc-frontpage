import { FC, useEffect, useState } from 'react';

import { City } from '../type';

import Popover from '@/components/Modal/Popover';

import { getCitiesByCountryIdAndStateId } from '../api';

const CityModal: FC<{
  stateId: string;
  countryId: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: any;
  setChosenValue: (value: any) => void;
}> = ({ visible, setVisible, chosenValue, setChosenValue, stateId, countryId }) => {
  const [cities, setCities] = useState<City[]>([]);

  const getCityList = () => {
    getCitiesByCountryIdAndStateId(countryId, stateId).then((res) => {
      if (res) {
        const checked = res.find((item) => item.id === chosenValue.value);
        if (!checked) {
          setChosenValue({ value: '', label: '' });
        } else {
          setChosenValue({ value: checked.id, label: checked.name });
        }
        setCities(res);
      }
    });
  };

  useEffect(() => {
    if (stateId) {
      getCityList();
    } else {
      setChosenValue({ value: '', label: '' });
    }
  }, [stateId, countryId]);

  return (
    <Popover
      title="SELECT CITY / TOWN"
      visible={visible}
      setVisible={setVisible}
      secondaryModal
      chosenValue={chosenValue}
      setChosenValue={setChosenValue}
      groupRadioList={[
        {
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

import { FC, forwardRef, useEffect, useImperativeHandle, useState } from 'react';

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
}> = forwardRef(({ visible, setVisible, chosenValue, setChosenValue, stateId, countryId }, ref) => {
  const [cities, setCities] = useState<City[]>([]);

  const getCityList = async () => {
    if (!countryId || !stateId) {
      return [];
    }

    const city = await getCitiesByCountryIdAndStateId(countryId, stateId);

    if (city) {
      const checked = city.find((item) => item.id === chosenValue.value);
      if (!checked) {
        setChosenValue({ value: '', label: '' });
      } else {
        setChosenValue({ value: checked.id, label: checked.name });
      }
      setCities(city);
    }

    return city;
  };

  useEffect(() => {
    if (stateId) {
      getCityList();
    } else {
      setChosenValue({ value: '', label: '' });
    }
  }, [stateId, countryId]);

  useImperativeHandle(ref, () => cities, [JSON.stringify(cities)]);

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
});
export default CityModal;

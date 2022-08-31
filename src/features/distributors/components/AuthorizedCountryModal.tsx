import { FC, useEffect, useState } from 'react';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { Country, Regions } from '@/features/locations/type';

import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';

import { getRegions } from '@/features/locations/api';

const AuthorizedCountryModal: FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: any;
  setChosenValue: (value: any) => void;
}> = ({ visible, setVisible, chosenValue, setChosenValue }) => {
  const [countryGroup, setCountryGroup] = useState<Regions[]>([]);

  const getCountryGroup = () => {
    getRegions().then((res) => {
      setCountryGroup(res);
    });
  };

  useEffect(() => {
    getCountryGroup();
  }, []);

  const renderLabel = (item: Country) => {
    return (
      <BodyText level={5} fontFamily="Roboto">
        <span style={{ marginRight: '8px' }}>{item.name}</span>
        <span>+{item.phone_code}</span>
      </BodyText>
    );
  };

  const handleSelectedData = (checkedData: CheckboxValue[]) => {
    const newData: Country[] = [];
    let authorCountryData: CheckboxValue[] = [];
    let selectedCountry = undefined;
    checkedData.forEach((checked) => {
      countryGroup.forEach((item) => {
        const result = item.countries.find((country) => country.id === checked.value);
        if (result) {
          selectedCountry = result;
          newData.push(selectedCountry);
        }
      });
    });
    if (newData.length > 0) {
      authorCountryData = newData.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    }
    setChosenValue(authorCountryData);
  };

  return (
    <Popover
      title="SELECT COUNTRY"
      visible={visible}
      setVisible={setVisible}
      chosenValue={chosenValue}
      setChosenValue={(data) => handleSelectedData(data)}
      dropdownCheckboxList={countryGroup.map((items) => {
        return {
          key: items.name,
          options: items.countries.map((item) => {
            return {
              label: renderLabel(item),
              value: item.id,
            };
          }),
        };
      })}
      dropdownCheckboxTitle={(data) => data.key}
      combinableCheckbox
    />
  );
};
export default AuthorizedCountryModal;

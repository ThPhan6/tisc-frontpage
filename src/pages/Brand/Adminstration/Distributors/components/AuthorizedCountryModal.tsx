import { CheckboxValue } from '@/components/CustomCheckbox/types';
import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';
import { getWorkLocations } from '@/services/location.api';
import { LocationGroupedByCountry, ILocationDetail } from '@/types';
import { FC, useEffect, useState } from 'react';

const AuthorizedCountryModal: FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: any;
  setChosenValue: (value: any) => void;
}> = ({ visible, setVisible, chosenValue, setChosenValue }) => {
  const [countryGroup, setCountryGroup] = useState<LocationGroupedByCountry[]>([]);

  const getCountryGroup = () => {
    getWorkLocations().then((res) => {
      setCountryGroup(res);
    });
  };

  useEffect(() => {
    getCountryGroup();
  }, []);

  const renderLabel = (item: ILocationDetail) => {
    return (
      <BodyText level={5} fontFamily="Roboto">
        <span style={{ marginRight: '8px' }}>{item.country_name}</span>
        <span>+{item.phone_code}</span>
      </BodyText>
    );
  };

  const handleSelectedData = (checkedData: CheckboxValue[]) => {
    let selectedCountry = undefined;
    checkedData.map((checked) => {
      countryGroup.forEach((item) => {
        const result = item.locations.find((country) => country.country_id === checked.value);
        if (result) {
          selectedCountry = result;
        }
      });
    });
    if (selectedCountry) {
      setChosenValue([
        {
          label: selectedCountry['country_name'],
          value: selectedCountry['country_id'],
        },
      ]);
    }
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
          key: items.country_name,
          options: items.locations.map((item) => {
            return {
              label: renderLabel(item),
              value: item.country_id,
            };
          }),
        };
      })}
      dropdownCheckboxTitle={(data) => data.key}
    />
  );
};
export default AuthorizedCountryModal;

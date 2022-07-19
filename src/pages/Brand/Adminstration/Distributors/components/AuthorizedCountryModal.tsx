import { CheckboxValue } from '@/components/CustomCheckbox/types';
import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';
import { getListCountryGroup } from '@/services/location.api';
import { ICountryGroup, ILocationDetail } from '@/types';
import { FC, useEffect, useState } from 'react';

const AuthorizedCountryModal: FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: any;
  setChosenValue: (value: any) => void;
}> = ({ visible, setVisible, chosenValue, setChosenValue }) => {
  const [countryGroup, setCountryGroup] = useState<ICountryGroup[]>([]);

  const getCountryGroup = () => {
    getListCountryGroup().then((res) => {
      setCountryGroup(res as ICountryGroup[]);
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
    console.log(checkedData);
    // const newChosenData = [];
    const selectedCountry = checkedData.map((checked) => {
      countryGroup.map((item) => {
        console.log(item.locations);
        item.locations.find((country) => country.country_id === checked.value);
      });
    });
    console.log(selectedCountry);
    if (selectedCountry) {
      setChosenValue('');
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

import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';
import { getListCountryGroup } from '@/services/location.api';
import { ICountryGroup, ILocationDetail } from '@/types';
import { FC, useEffect, useState } from 'react';

const AuthorizedCountryModal: FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: any;
  setChosenValue?: (value: any) => void;
}> = ({ visible, setVisible, chosenValue, setChosenValue }) => {
  const [countryGroup, setCountryGroup] = useState<ICountryGroup[]>([]);

  const getCountryGroup = () => {
    getListCountryGroup().then(setCountryGroup);
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

  return (
    <Popover
      title="SELECT COUNTRY"
      visible={visible}
      setVisible={setVisible}
      chosenValue={chosenValue}
      setChosenValue={setChosenValue}
      dropdownCheckboxList={countryGroup.map((items) => {
        return {
          key: items.country_name,
          options: items.locations.map((item) => {
            return {
              label: renderLabel(item),
              value: item.country_name,
              id: item.country_id,
            };
          }),
        };
      })}
      dropdownCheckboxTitle={(data) => data.key}
    />
  );
};
export default AuthorizedCountryModal;

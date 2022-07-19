import { RadioValue } from '@/components/CustomRadio/types';
import Popover from '@/components/Modal/Popover';
import { FC } from 'react';

interface ILocationModal {
  locationValue: string | boolean;
  setLocationValue: (data: RadioValue) => void;
  visible: boolean;
  setVisible: (value: boolean) => void;
}

const LocationModal: FC<ILocationModal> = ({
  visible,
  setVisible,
  locationValue,
  setLocationValue,
}) => {
  // const [locationList, setLocationList] = useState<ICountryGroup[]>([]);

  // load location list
  // useEffect(() => {
  //   getTeamProfileLocationList().then((isSuccess) => {
  //     if (isSuccess) {
  //       setLocationList(isSuccess);
  //     }
  //   });
  // }, []);

  // const BusinessName: FC<{ countryName: string; type: string }> = ({ countryName, type }) => {
  //   return (
  //     <>
  //       <span>{countryName}</span>
  //       <span>{type}</span>
  //     </>
  //   );
  // };

  return (
    <Popover
      title="SELECT LOCATION"
      visible={visible}
      setVisible={(isVisible) => setVisible(isVisible)}
      // dropdownRadioList={locationList.map((countries) => {
      //   return {
      //     key: countries.country_name,
      //     options: countries.locations.map((location) => {
      //       return location.functional_types.map((type) => ({
      //         label: type.name,
      //         value: type.id,
      //       }));
      //     }),
      //   };
      // })}
      dropDownRadioTitle={(country) => country.key}
      chosenValue={locationValue}
      setChosenValue={setLocationValue}
    />
  );
};

export default LocationModal;

import { RadioValue } from '@/components/CustomRadio/types';
import Popover from '@/components/Modal/Popover';
import { getTeamProfileLocationList } from '@/services';
import { ICountryGroup } from '@/types';
import { FC, useEffect, useState } from 'react';
import styles from '../styles/LocationModal.less';

interface IBusinessDetail {
  business: string;
  type: string;
  address: string;
  country?: string;
}

interface ILocationModal {
  locationValue: RadioValue;
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
  const [locationList, setLocationList] = useState<ICountryGroup[]>([]);

  // console.log('locationValue', locationValue);

  // load location list
  useEffect(() => {
    getTeamProfileLocationList().then((isSuccess) => {
      if (isSuccess) {
        setLocationList(isSuccess);
      }
    });
  }, []);

  const BusinessDetail: FC<IBusinessDetail> = ({ business, type = '', address }) => {
    return (
      <div className={styles.detail}>
        <div className={styles.detail_business}>
          <span className={styles.name}>{business}</span>
          <span className={styles.type}>{type && `(${type})`}</span>
        </div>
        <span className={styles.detail_address}>{address}</span>
      </div>
    );
  };

  return (
    <Popover
      title="SELECT LOCATION"
      visible={visible}
      setVisible={(isVisible) => setVisible(isVisible)}
      dropdownRadioList={locationList.map((country) => {
        return {
          key: country.country_name,
          options: country.locations.map((location) => {
            return {
              label: (
                <BusinessDetail
                  business={location.business_name}
                  type={location.functional_types[0]?.name}
                  address={location.address}
                  country={location.country_name.toUpperCase()}
                />
              ),
              value: location.id,
            };
          }),
        };
      })}
      dropDownRadioTitle={(country) => country.key}
      chosenValue={locationValue}
      setChosenValue={setLocationValue}
    />
  );
};

export default LocationModal;

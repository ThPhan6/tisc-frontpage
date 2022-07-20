import { RadioValue } from '@/components/CustomRadio/types';
import Popover from '@/components/Modal/Popover';
import { getWorkLocations } from '@/services';
import { LocationGroupedByCountry } from '@/types';
import { FC, useEffect, useState } from 'react';
import { upperCase } from 'lodash';
import styles from '../styles/LocationModal.less';

interface IBusinessDetail {
  business: string;
  type: string;
  address: string;
  country?: string;
}

interface WorkLocationData {
  label: string;
  value: string;
  phoneCode: string;
}

interface ILocationModal {
  workLocation: WorkLocationData;
  setWorkLocation: (data: WorkLocationData) => void;
  visible: boolean;
  setVisible: (value: boolean) => void;
}

const LocationModal: FC<ILocationModal> = ({
  visible,
  setVisible,
  workLocation,
  setWorkLocation,
}) => {
  const [workLocations, setWorkLocations] = useState<LocationGroupedByCountry[]>([]);

  // load location list
  useEffect(() => {
    getWorkLocations().then((res) => {
      setWorkLocations(res);
      res.forEach((country) => {
        const selectedLocation = country.locations.find((location) => {
          return location.id === workLocation.value;
        });
        if (selectedLocation) {
          setWorkLocation({
            label: `${selectedLocation.business_name}, ${upperCase(selectedLocation.country_name)}`,
            value: selectedLocation.id,
            phoneCode: selectedLocation.phone_code,
          });
        }
      });
    });
  }, []);

  const setLocationValue = (selectedValue: RadioValue) => {
    workLocations.forEach((country) => {
      const selectedLocation = country.locations.find((location) => {
        return location.id === selectedValue.value;
      });
      if (selectedLocation) {
        setWorkLocation({
          label: `${selectedLocation.business_name}, ${upperCase(selectedLocation.country_name)}`,
          value: selectedLocation.id,
          phoneCode: selectedLocation.phone_code,
        });
      }
    });
  };

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
      dropdownRadioList={workLocations.map((country) => {
        return {
          country_name: country.country_name,
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
      dropDownRadioTitle={(dropdownData) => dropdownData.country_name}
      chosenValue={{
        label: workLocation.label,
        value: workLocation.value,
      }}
      setChosenValue={setLocationValue}
      className={styles.customLocationModal}
    />
  );
};

export default LocationModal;

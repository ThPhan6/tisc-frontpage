import { FC, useEffect, useState } from 'react';

import { upperCase } from 'lodash';

import { RadioValue } from '@/components/CustomRadio/types';
import { LocationDetail, LocationGroupedByCountry } from '@/features/locations/type';

import Popover from '@/components/Modal/Popover';

import styles from './LocationModal.less';
import { getWorkLocations } from '@/features/locations/api';

interface WorkLocationData {
  label: string;
  value: string;
  phoneCode: string;
}

interface LocationModalProps {
  workLocation: WorkLocationData;
  setWorkLocation: (data: WorkLocationData) => void;
  visible: boolean;
  setVisible: (value: boolean) => void;
}

const LocationModal: FC<LocationModalProps> = ({
  visible,
  setVisible,
  workLocation,
  setWorkLocation,
}) => {
  const [workLocations, setWorkLocations] = useState<LocationGroupedByCountry[]>([]);

  const setSelectedWorkLocation = (location: LocationDetail) => {
    let workLocationText = '';
    if (location.city_name) {
      workLocationText = `${location.city_name}, `;
    }
    if (location.country_name) {
      workLocationText += upperCase(location.country_name);
    }
    setWorkLocation({
      label: workLocationText,
      value: location.id,
      phoneCode: location.phone_code ?? '',
    });
  };

  // load location list
  useEffect(() => {
    getWorkLocations().then((res) => {
      setWorkLocations(res);
      res.forEach((country) => {
        const selectedLocation = country.locations.find((location) => {
          return location.id === workLocation.value;
        });
        if (selectedLocation) {
          setSelectedWorkLocation(selectedLocation);
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
        setSelectedWorkLocation(selectedLocation);
      }
    });
  };

  interface BusinessDetailProps {
    business: string;
    type: string;
    address: string;
    country?: string;
  }

  const BusinessDetail: FC<BusinessDetailProps> = ({ business, type = '', address }) => {
    return (
      <div className={styles.detail}>
        <div className={styles.detail_business}>
          <span className={styles.name}> {business} </span>
          <span className={styles.type}> {type && `(${type})`} </span>
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

import { FC, useEffect, useState } from 'react';

import { getBusinessAddress } from '@/helper/utils';
import { upperCase } from 'lodash';

import { RadioValue } from '@/components/CustomRadio/types';
import { LocationDetail, LocationGroupedByCountry } from '@/features/locations/type';
import { useAppSelector } from '@/reducers';
import { modalPropsSelector } from '@/reducers/modal';

import Popover from '@/components/Modal/Popover';
import { BodyText, RobotoBodyText } from '@/components/Typography';

import styles from './LocationModal.less';
import { getWorkLocations } from '@/features/locations/api';

export interface WorkLocationData extends Partial<LocationDetail> {
  label: string;
  value: string;
  phoneCode: string;
}

const LocationModal: FC = () => {
  const workLocation = useAppSelector(modalPropsSelector).workLocation;
  const data = workLocation?.data || [];
  const onChange = workLocation?.onChange || (() => {});

  const [workLocations, setWorkLocations] = useState<LocationGroupedByCountry[]>([]);

  const setSelectedWorkLocation = (location: LocationDetail) => {
    let workLocationText = '';
    if (location.city_name) {
      workLocationText = `${location.city_name}, `;
    }
    if (location.country_name) {
      workLocationText += upperCase(location.country_name);
    }
    onChange({
      ...location,
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
          return location.id === data.value;
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
    email?: string;
    phone?: string;
  }

  const BusinessDetail: FC<BusinessDetailProps> = ({
    business,
    type = '',
    address,
    email,
    phone,
  }) => {
    return (
      <div className={`${styles.detail} ${email || phone ? styles.detail_extra_class : ''}`}>
        <div className={styles.detail_business}>
          <span className={`${styles.name} ${email || phone ? 'mr-16' : ''}`}> {business} </span>
          <span className={styles.type}> {type && `(${type})`} </span>
        </div>
        <span className={styles.detail_address}>{address}</span>
        {email || phone ? (
          <article className="d-flex items-center">
            <BodyText customClass="mr-16 d-flex items-center" level={4}>
              Email:{' '}
              <RobotoBodyText customClass="ml-16" level={6}>
                {email}
              </RobotoBodyText>
            </BodyText>
            <BodyText customClass="mr-16 d-flex items-center" level={4}>
              Phone:{' '}
              <RobotoBodyText customClass="ml-16" level={6}>
                {phone}
              </RobotoBodyText>
            </BodyText>
          </article>
        ) : null}
      </div>
    );
  };

  return (
    <Popover
      title="SELECT LOCATION"
      visible
      dropdownRadioList={workLocations.map((country) => {
        return {
          country_name: country.country_name,
          options: country.locations.map((location) => {
            return {
              label: (
                <BusinessDetail
                  business={location.business_name}
                  type={location.functional_types[0]?.name}
                  address={getBusinessAddress(location)}
                  country={location.country_name.toUpperCase()}
                  email={location.general_email}
                  phone={location.general_phone}
                />
              ),
              value: location.id,
            };
          }),
        };
      })}
      dropDownRadioTitle={(dropdownData) => dropdownData.country_name}
      chosenValue={{
        label: data.label,
        value: data.value,
      }}
      setChosenValue={setLocationValue}
      className={styles.customLocationModal}
    />
  );
};

export default LocationModal;

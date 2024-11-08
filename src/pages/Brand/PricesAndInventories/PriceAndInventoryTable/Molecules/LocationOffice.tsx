import { useEffect, useState } from 'react';

import { getBusinessAddress } from '@/helper/utils';

import { DropdownRadioItem } from '@/components/CustomRadio/types';
import { LocationDetail, LocationGroupedByCountry } from '@/features/locations/type';

import Popover from '@/components/Modal/Popover';
import { BusinessDetail } from '@/features/product/components/BrandContact';

import { getLocationByBrandId } from '@/features/locations/api';

interface LocationOfficeProps {
  brandId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedLocation: LocationDetail) => void;
}

const LocationOffice = ({ brandId, isOpen, onClose, onSave }: LocationOfficeProps) => {
  const [groupedLocations, setGroupedLocations] = useState<LocationGroupedByCountry[]>([]);
  const [chosenValue, setChosenValue] = useState<LocationDetail | null>(null);

  useEffect(() => {
    const fetchPartnerGroupByCountry = async () => {
      const res = await getLocationByBrandId(brandId);
      if (res) setGroupedLocations(res);
    };

    fetchPartnerGroupByCountry();
  }, []);

  const handleLocationSelect = (type: 'select' | 'submit') => (el: { value: string }) => {
    const selectedLocation = groupedLocations
      ?.flatMap((country) => country.locations)
      .find((location) => location.id === el?.value);

    if (selectedLocation) {
      if (type === 'select') {
        setChosenValue(selectedLocation);
        return;
      }

      onSave(selectedLocation);
      onClose();
    }
  };

  const dropDownTitle = (data: DropdownRadioItem) => data.country_name;

  const radioList = groupedLocations.map((country) => ({
    country_name: country.country_name,
    options: country.locations.map((location) => ({
      value: location.id,
      label: (
        <BusinessDetail
          business={location.business_name}
          type={location?.functional_type}
          address={getBusinessAddress(location)}
          country={location.country_name.toUpperCase()}
          phone_code={location.phone_code}
          general_phone={location.general_phone}
          genernal_email={location.general_email}
          hideContact={false}
        />
      ),
    })),
  }));

  return (
    <Popover
      title="SELECT LOCATION"
      visible={isOpen}
      setVisible={onClose}
      maskClosable
      onFormSubmit={handleLocationSelect('submit')}
      setChosenValue={handleLocationSelect('select')}
      chosenValue={chosenValue}
      dropDownRadioTitle={dropDownTitle}
      dropdownRadioList={radioList}
    />
  );
};

export default LocationOffice;

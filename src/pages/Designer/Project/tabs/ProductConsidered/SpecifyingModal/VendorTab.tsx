import { FC, useEffect, useState } from 'react';

import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';

import { getBrandLocation, getDistributorLocation } from '@/services';

import { OnChangeSpecifyingProductFnc } from './types';
import { RadioValue } from '@/components/CustomRadio/types';
import { LocationDetail, LocationGroupedByCountry } from '@/types';
import { DistributorProductMarket } from '@/types/distributor.type';

import CustomCollapse from '@/components/Collapse';
import Popover from '@/components/Modal/Popover';
import { RenderEntireProjectLabel } from '@/components/RenderHeaderLabel';
import { BodyText, RobotoBodyText } from '@/components/Typography';
import { BusinessDetail } from '@/features/product/components/BrandContact';

import styles from './styles/vendor-tab.less';

const activeKey = '1';

const getSelectedLocation = (locationGroup: LocationGroupedByCountry[], selectedId: string) => {
  const allLocations = locationGroup.flatMap((el) => el.locations);

  const selectedLocation = allLocations.find((el) => el.id === selectedId);
  const locationOption: RadioValue = {
    value: selectedId || '',
    label: selectedLocation ? (
      <BusinessDetail
        business={selectedLocation.business_name}
        type={selectedLocation.functional_types[0]?.name}
        address={`${selectedLocation.address}, ${
          selectedLocation.city_name !== '' ? `${selectedLocation.city_name},` : ''
        } ${selectedLocation.state_name !== '' ? `${selectedLocation.state_name},` : ''} ${
          selectedLocation.country_name
        }`}
        country={selectedLocation.country_name.toUpperCase()}
        phone_code={selectedLocation.phone_code}
        general_phone={selectedLocation.general_phone}
        genernal_email={selectedLocation.general_email}
      />
    ) : (
      ''
    ),
  };

  return {
    selectedLocation,
    locationOption,
    countryName: selectedLocation?.country_name || '',
  };
};

const getSelectedDistributors = (locationGroup: DistributorProductMarket[], selectedId: string) => {
  const allLocations = locationGroup.flatMap((el) => el.distributors);

  const selectedLocation = allLocations.find((el) => el.id === selectedId);
  const locationOption: RadioValue = {
    value: selectedId || '',
    label: selectedLocation ? (
      <BusinessDetail
        business={selectedLocation.name}
        address={`${selectedLocation.address}, ${
          selectedLocation.city_name !== '' ? `${selectedLocation.city_name},` : ''
        } ${selectedLocation.state_name !== '' ? `${selectedLocation.state_name},` : ''} ${
          selectedLocation.country_name
        }`}
        country={selectedLocation.country_name.toUpperCase()}
        phone_code={selectedLocation.phone_code}
        general_phone={selectedLocation.phone}
        genernal_email={selectedLocation.email}
        first_name={selectedLocation.first_name}
        last_name={selectedLocation.last_name}
      />
    ) : (
      ''
    ),
  };

  return {
    selectedLocation,
    locationOption,
    countryName: selectedLocation?.country_name || '',
  };
};

interface VendorTabProps {
  productId: string;
  brandId: string;
  onChangeSpecifyingState: OnChangeSpecifyingProductFnc;
  brandAddressId: string;
  distributorAddressId: string;
}

const VendorTab: FC<VendorTabProps> = ({
  productId,
  brandId,
  onChangeSpecifyingState,
  brandAddressId,
  distributorAddressId,
}) => {
  // for brand
  const [brandActiveKey, setBrandActiveKey] = useState<string | string[]>();
  const [brandAddresses, setBrandAddresses] = useState<LocationGroupedByCountry[]>([]);

  // for distributor
  const [distributorActiveKey, setDistributorActiveKey] = useState<string | string[]>();
  const [distributorAddresses, setDistributorAddresses] = useState<DistributorProductMarket[]>([]);

  // get location selected
  const {
    locationOption: chosenBrand,
    countryName: chosenBrandCountry,
    selectedLocation: selectedLocationBrand,
  } = getSelectedLocation(brandAddresses, brandAddressId);
  const {
    locationOption: chosenDistributor,
    countryName: chosenDistributorCountry,
    selectedLocation: selectedLocationDistributor,
  } = getSelectedDistributors(distributorAddresses, distributorAddressId);

  const [locationPopup, setLocationPopup] = useState<'' | 'brand' | 'distributor'>('');

  // get data
  const chosenValue =
    locationPopup === 'brand'
      ? chosenBrand
      : locationPopup === 'distributor'
      ? chosenDistributor
      : undefined;

  useEffect(() => {
    getBrandLocation(brandId).then((data) => {
      if (data) {
        setBrandAddresses(data);
      }
    });

    getDistributorLocation(productId).then((data) => {
      if (data) {
        setDistributorAddresses(data);
      }
    });
  }, []);

  const handleCollapse = (field: 'brand' | 'distributor', key: string | string[]) => {
    if (field === 'brand') {
      setBrandActiveKey(key === activeKey ? '' : typeof key !== 'string' ? key[0] : key);

      setDistributorActiveKey([]);
    } else if (field === 'distributor') {
      setDistributorActiveKey(key === activeKey ? '' : typeof key !== 'string' ? key[0] : key);

      setBrandActiveKey([]);
    }
  };

  const handleOnChangeSpecifying = (checked: RadioValue) => {
    if (locationPopup === 'brand') {
      onChangeSpecifyingState({
        brand_location_id: checked?.value ? String(checked.value) : '',
      });
    }
    if (locationPopup === 'distributor') {
      onChangeSpecifyingState({
        distributor_location_id: checked?.value ? String(checked.value) : '',
      });
    }
  };

  const renderBusinessAdressDetail = (location?: LocationDetail) =>
    location ? (
      <BusinessDetail
        business={location?.business_name ?? ''}
        type={location?.functional_types?.[0]?.name ?? ''}
        address={`${location.address}, ${
          location.city_name !== '' ? `${location.city_name},` : ''
        } ${location.state_name !== '' ? `${location.state_name},` : ''} ${location.country_name}`}
        phone_code={location?.phone_code ?? ''}
        general_phone={location?.general_phone ?? ''}
        genernal_email={location?.general_email ?? ''}
        customClass={styles.businessDetail}
      />
    ) : null;

  const renderDistributorBusinessAdressDetail = (
    location?: DistributorProductMarket['distributors'][0],
  ) =>
    location ? (
      <BusinessDetail
        business={location?.name ?? ''}
        address={`${location.address}, ${
          location.city_name !== '' ? `${location.city_name},` : ''
        } ${location.state_name !== '' ? `${location.state_name},` : ''} ${location.country_name}`}
        phone_code={location?.phone_code ?? ''}
        general_phone={location?.phone ?? ''}
        genernal_email={location?.email ?? ''}
        customClass={styles.businessDetail}
        first_name={location.first_name}
        last_name={location.last_name}
      />
    ) : null;

  const renderCollapseHeader = (
    title: string,
    country: string,
    activeCollapse: boolean,
    onSelect: () => void,
  ) => {
    return (
      <div className={country ? 'contact-item-selected' : 'contact-item-not-selected'}>
        <BodyText level={4} customClass={`${activeCollapse ? 'active-title' : 'inActive-title'}`}>
          {title}
        </BodyText>

        <div className="contact-select-box" onClick={onSelect}>
          <BodyText
            level={6}
            fontFamily="Roboto"
            color={country ? 'mono-color' : 'mono-color-medium'}
            customClass="country-name">
            {country || 'select location'}
          </BodyText>
          <SingleRightIcon className={country ? 'icon-active' : 'icon-unActive'} />
        </div>
      </div>
    );
  };

  return (
    <div>
      <RenderEntireProjectLabel
        title="Contact & Address"
        toolTiptitle={
          <RobotoBodyText level={6}>
            Confirm project location-based or your prefered vendor contact/address information.
          </RobotoBodyText>
        }
      />

      <div>
        {/* Brand Address */}
        <div
          className={`${
            brandActiveKey === activeKey && chosenBrand.value
              ? styles.collapsed
              : styles.notCollapsed
          } `}>
          <div className={styles.address}>
            <CustomCollapse
              header={renderCollapseHeader(
                'Brand Address',
                chosenBrandCountry,
                brandActiveKey === activeKey && chosenBrand.value ? true : false,
                () => {
                  setLocationPopup('brand');
                  setBrandActiveKey(activeKey);
                },
              )}
              collapsible={chosenBrand.value ? 'header' : 'disabled'}
              onChange={(key) => handleCollapse('brand', key)}
              activeKey={brandActiveKey}
              customHeaderClass={styles.collapseHeader}>
              {renderBusinessAdressDetail(selectedLocationBrand)}
            </CustomCollapse>
          </div>
        </div>

        {/* Distributor Address */}
        <div
          className={`${
            distributorActiveKey === activeKey && chosenDistributor.value
              ? styles.collapsed
              : styles.notCollapsed
          } `}>
          <div className={styles.address}>
            <CustomCollapse
              header={renderCollapseHeader(
                'Distributor Address',
                chosenDistributorCountry,
                distributorActiveKey === activeKey && chosenDistributor.value ? true : false,
                () => {
                  setLocationPopup('distributor');
                  setDistributorActiveKey(activeKey);
                },
              )}
              collapsible={chosenDistributor.value ? 'header' : 'disabled'}
              onChange={(key) => handleCollapse('distributor', key)}
              activeKey={distributorActiveKey}
              customHeaderClass={styles.collapseHeader}>
              {renderDistributorBusinessAdressDetail(selectedLocationDistributor)}
            </CustomCollapse>
          </div>
        </div>
      </div>

      <Popover
        title="SELECT LOCATION"
        className={styles.customLocationModal}
        visible={locationPopup === 'brand'}
        setVisible={(visible) => (visible ? undefined : setLocationPopup(''))}
        chosenValue={chosenValue}
        setChosenValue={(checked) =>
          locationPopup ? handleOnChangeSpecifying(checked) : undefined
        }
        dropDownRadioTitle={(dropdownData) => dropdownData.country_name}
        dropdownRadioList={brandAddresses.map((country) => {
          return {
            country_name: country.country_name,
            options: country.locations.map((location) => {
              return {
                value: location.id,
                label: (
                  <BusinessDetail
                    business={location.business_name}
                    type={location.functional_types[0]?.name}
                    address={`${location.address}, ${
                      location.city_name !== '' ? `${location.city_name},` : ''
                    } ${location.state_name !== '' ? `${location.state_name},` : ''} ${
                      location.country_name
                    }`}
                    country={location.country_name.toUpperCase()}
                    phone_code={location.phone_code}
                    general_phone={location.general_phone}
                    genernal_email={location.general_email}
                  />
                ),
              };
            }),
          };
        })}
      />

      <Popover
        title="SELECT LOCATION"
        className={styles.customLocationModal}
        visible={locationPopup === 'distributor'}
        setVisible={(visible) => (visible ? undefined : setLocationPopup(''))}
        chosenValue={chosenValue}
        setChosenValue={(checked) =>
          locationPopup ? handleOnChangeSpecifying(checked) : undefined
        }
        dropDownRadioTitle={(dropdownData) => dropdownData.country_name}
        dropdownRadioList={distributorAddresses.map((country) => {
          return {
            country_name: country.country_name,
            options: country.distributors.map((distributor) => {
              return {
                value: distributor.id,
                label: (
                  <BusinessDetail
                    business={distributor.name}
                    address={`${distributor.address}, ${
                      distributor.city_name !== '' ? `${distributor.city_name},` : ''
                    } ${distributor.state_name !== '' ? `${distributor.state_name},` : ''} ${
                      distributor.country_name
                    }`}
                    country={distributor.country_name.toUpperCase()}
                    phone_code={distributor.phone_code}
                    general_phone={distributor.phone}
                    genernal_email={distributor.email}
                    first_name={distributor.first_name}
                    last_name={distributor.last_name}
                  />
                ),
              };
            }),
          };
        })}
      />
    </div>
  );
};
export default VendorTab;

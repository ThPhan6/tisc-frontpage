import { FC, useEffect, useState } from 'react';

import { ReactComponent as DropDownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';

import { selectProductSpecification } from '../product/services';
import { useCheckPermission, useQuery } from '@/helper/hook';
import { getBusinessAddress } from '@/helper/utils';

import { RadioValue } from '@/components/CustomRadio/types';
import { DistributorProductMarket } from '@/features/distributors/type';
import { LocationDetail, LocationGroupedByCountry } from '@/features/locations/type';
import { setPartialProductDetail } from '@/features/product/reducers';
import store, { useAppSelector } from '@/reducers';

import CustomCollapse from '@/components/Collapse';
import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';
import { BusinessDetail } from '@/features/product/components/BrandContact';

import styles from './VendorLocation.less';
import { getBrandLocation, getDistributorLocation } from '@/features/locations/api';

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
        address={getBusinessAddress(selectedLocation)}
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
        address={getBusinessAddress(selectedLocation)}
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
  userSelection?: boolean;
  borderBottomNone?: boolean;
  isSpecifying?: boolean;
}

export const VendorLocation: FC<VendorTabProps> = ({
  productId,
  brandId,
  userSelection,
  borderBottomNone,
  isSpecifying,
}) => {
  // for brand
  const [brandActiveKey, setBrandActiveKey] = useState<string | string[]>();
  const [brandAddresses, setBrandAddresses] = useState<LocationGroupedByCountry[]>([]);

  // for distributor
  const [distributorActiveKey, setDistributorActiveKey] = useState<string | string[]>();
  const [distributorAddresses, setDistributorAddresses] = useState<DistributorProductMarket[]>([]);

  const brandLocationId = useAppSelector((state) => state.product.details.brand_location_id);
  const distributorLocationId = useAppSelector(
    (state) => state.product.details.distributor_location_id,
  );

  const isTiscAdmin = useCheckPermission('TISC Admin');

  const signature = useQuery().get('signature');
  const isPublicPage = signature ? true : false;

  // get location selected
  const {
    locationOption: chosenBrand,
    countryName: chosenBrandCountry,
    selectedLocation: selectedLocationBrand,
  } = getSelectedLocation(brandAddresses, brandLocationId);
  const {
    locationOption: chosenDistributor,
    countryName: chosenDistributorCountry,
    selectedLocation: selectedLocationDistributor,
  } = getSelectedDistributors(distributorAddresses, distributorLocationId);

  const [locationPopup, setLocationPopup] = useState<'' | 'brand' | 'distributor'>('');

  const getChosenValue = () => {
    if (locationPopup === 'brand') {
      return chosenBrand;
    }
    return locationPopup === 'distributor' ? chosenDistributor : undefined;
  };

  useEffect(() => {
    if (!isTiscAdmin) {
      if (brandId) {
        getBrandLocation(brandId).then((data) => {
          if (data) {
            setBrandAddresses(data);
          }
        });
      }

      if (productId) {
        getDistributorLocation(productId).then((data) => {
          if (data) {
            setDistributorAddresses(data);
          }
        });
      }
    }
  }, []);

  const handleCollapse = (field: 'brand' | 'distributor', key: string | string[]) => {
    const collapseKey = typeof key === 'string' ? key : key[0];

    if (field === 'brand') {
      setBrandActiveKey(collapseKey);
      setDistributorActiveKey([]);
    } else if (field === 'distributor') {
      setDistributorActiveKey(collapseKey);
      setBrandActiveKey([]);
    }
  };

  const handleOnChangeSpecifying = (checked: RadioValue) => {
    const newValue = checked?.value ? String(checked.value) : '';
    if (locationPopup === 'brand') {
      store.dispatch(setPartialProductDetail({ brand_location_id: newValue }));
      if (userSelection) {
        selectProductSpecification(productId, { brand_location_id: newValue });
      }
    }
    if (locationPopup === 'distributor') {
      store.dispatch(setPartialProductDetail({ distributor_location_id: newValue }));
      if (userSelection) {
        selectProductSpecification(productId, { distributor_location_id: newValue });
      }
    }
  };

  const renderBusinessAdressDetail = (location?: LocationDetail) =>
    location ? (
      <BusinessDetail
        business={location?.business_name ?? ''}
        type={location?.functional_types?.[0]?.name ?? ''}
        address={getBusinessAddress(location)}
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
        address={getBusinessAddress(location)}
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
    const handleShowAddress = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (brandActiveKey === activeKey || distributorActiveKey === activeKey) {
        e.stopPropagation();
      }

      if (onSelect) {
        onSelect();
      }
    };

    const getCountryName = () => {
      if (country) return country;

      if (isPublicPage) return null;

      if (isSpecifying) return 'select location';

      return 'select';
    };

    const renderRightIcon = () => {
      if (isPublicPage) return null;

      if (isTiscAdmin) {
        return <DropDownIcon className="mono-color-medium" style={{ marginLeft: '12px' }} />;
      }

      return <SingleRightIcon className="mono-color" style={{ marginLeft: '12px' }} />;
    };

    return (
      <div className={`${styles.addressPanel} ${isSpecifying ? styles.customHeight : ''}`}>
        <div className={`contact-item-none ${country ? 'contact-item-selected' : ''}`}>
          <BodyText level={4} customClass={`${activeCollapse ? 'active-title' : 'inActive-title'}`}>
            {title}
          </BodyText>

          <div
            className={`contact-select-box ${isTiscAdmin ? 'cursor-disabled' : 'cursor-pointer'}`}
            onClick={isTiscAdmin || isPublicPage ? undefined : (e) => handleShowAddress(e)}>
            <BodyText
              level={6}
              fontFamily="Roboto"
              color={country ? 'mono-color' : 'mono-color-medium'}>
              {getCountryName()}
            </BodyText>
            {renderRightIcon()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={borderBottomNone ? styles.borderBottomNone : ''}>
        {/* Brand Address */}
        <div
          className={`${
            brandActiveKey === activeKey && chosenBrand.value
              ? styles.collapsed
              : styles.notCollapsed
          } ${isSpecifying ? '' : styles.marginBottomNone}`}>
          <div className={styles.address}>
            <CustomCollapse
              header={renderCollapseHeader(
                'Brand Address',
                chosenBrandCountry,
                brandActiveKey === activeKey && chosenBrand.value ? true : false,
                () => {
                  setLocationPopup('brand');
                  handleCollapse('brand', activeKey);
                },
              )}
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
          } ${isSpecifying ? '' : styles.marginBottomNone}`}>
          <div className={styles.address}>
            <CustomCollapse
              header={renderCollapseHeader(
                'Distributor Address',
                chosenDistributorCountry,
                distributorActiveKey === activeKey && chosenDistributor.value ? true : false,
                () => {
                  setLocationPopup('distributor');
                  handleCollapse('distributor', activeKey);
                },
              )}
              onChange={(key) => handleCollapse('distributor', key)}
              activeKey={distributorActiveKey}
              customHeaderClass={styles.collapseHeader}>
              {renderDistributorBusinessAdressDetail(selectedLocationDistributor)}
            </CustomCollapse>
          </div>
        </div>
      </div>

      {isPublicPage || isTiscAdmin ? null : (
        <>
          <Popover
            title="SELECT LOCATION"
            className={styles.customLocationModal}
            visible={locationPopup === 'brand'}
            setVisible={(visible) => (visible ? undefined : setLocationPopup(''))}
            chosenValue={getChosenValue()}
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
                        address={getBusinessAddress(location)}
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
            chosenValue={getChosenValue()}
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
                        address={getBusinessAddress(distributor)}
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
        </>
      )}
    </>
  );
};

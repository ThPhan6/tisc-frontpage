import { FC, useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { message } from 'antd';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as DropDownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';

import { selectProductSpecification } from '../product/services';
import { useCheckPermission, useQuery } from '@/helper/hook';
import { getBusinessAddress } from '@/helper/utils';
import { getCustomDistributorByCompany } from '@/pages/Designer/Products/CustomLibrary/services';
import { isEmpty } from 'lodash';

import { BrandDetail } from '../user-group/types';
import { RadioValue } from '@/components/CustomRadio/types';
import { DistributorProductMarket } from '@/features/distributors/type';
import { LocationDetail, LocationGroupedByCountry } from '@/features/locations/type';
import { setPartialProductDetail } from '@/features/product/reducers';
import store, { useAppSelector } from '@/reducers';

import CustomCollapse from '@/components/Collapse';
import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';
import { BusinessDetail } from '@/features/product/components/BrandContact';
import { updateCustomProductSpecifiedDetail } from '@/pages/Designer/Products/CustomLibrary/slice';

import styles from './VendorLocation.less';
import { getBrandLocation, getDistributorLocation } from '@/features/locations/api';

const activeKey = '1';

const getSelectedLocation = (locationGroup: LocationGroupedByCountry[], selectedId?: string) => {
  const allLocations = locationGroup.flatMap((el) => el.locations);

  const selectedLocation = allLocations.find((el) => el.id === selectedId);
  const locationOption: RadioValue = {
    value: selectedId || '',
    label: selectedLocation ? (
      <BusinessDetail
        business={selectedLocation.business_name}
        type={selectedLocation.functional_types?.[0]?.name}
        address={getBusinessAddress(selectedLocation)}
        country={selectedLocation.country_name.toUpperCase()}
        phone_code={selectedLocation.phone_code}
        general_phone={selectedLocation.general_phone}
        genernal_email={selectedLocation.general_email}
        contacts={selectedLocation.contacts}
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
        contacts={selectedLocation.contacts}
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
  projectId?: string;
  brandId: string;
  userSelection?: boolean;
  borderBottomNone?: boolean;
  isSpecifying?: boolean;
  customProduct?: boolean;
  brand?: BrandDetail;
}

export const VendorLocation: FC<VendorTabProps> = ({
  productId,
  projectId,
  brandId,
  userSelection,
  borderBottomNone,
  isSpecifying,
  customProduct,
  brand,
}) => {
  // for brand
  const [brandActiveKey, setBrandActiveKey] = useState<string | string[]>();
  const [brandAddresses, setBrandAddresses] = useState<LocationGroupedByCountry[]>([]);

  // for distributor
  const [distributorActiveKey, setDistributorActiveKey] = useState<string | string[]>();
  const [distributorAddresses, setDistributorAddresses] = useState<DistributorProductMarket[]>([]);

  const brandLocationId =
    useAppSelector((state) =>
      customProduct
        ? state.customProduct.details.specifiedDetail?.brand_location_id
        : state.product.details.brand_location_id,
    ) || '';
  const distributorLocationId =
    useAppSelector((state) =>
      customProduct
        ? state.customProduct.details.specifiedDetail?.distributor_location_id
        : state.product.details.distributor_location_id,
    ) || '';

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
    if (isTiscAdmin || !brandId || !productId) {
      return;
    }

    const fetchDistributorsFunc = customProduct
      ? getCustomDistributorByCompany
      : getDistributorLocation;
    fetchDistributorsFunc(customProduct ? brandId : productId, projectId).then((data) => {
      if (data) {
        setDistributorAddresses(data);
      }
    });

    if (customProduct) {
      setBrandAddresses([
        {
          country_name: brand?.location?.country_name || '',
          count: 1,
          locations: brand?.location ? [brand.location] : [],
        },
      ]);
    } else {
      getBrandLocation(brandId).then((data) => {
        if (data) {
          setBrandAddresses(data);
        }
      });
    }
  }, [customProduct, brand]);

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

  const handleOnChangeSpecifying = (checked?: RadioValue, isBrand?: boolean) => {
    const newValue = checked?.value ? String(checked.value) : '';
    const updateProductDetailFunc = customProduct
      ? updateCustomProductSpecifiedDetail
      : setPartialProductDetail;
    const newUpdate =
      locationPopup === 'brand' || isBrand
        ? { brand_location_id: newValue }
        : { distributor_location_id: newValue };
    store.dispatch(updateProductDetailFunc(newUpdate));
    if (userSelection) {
      selectProductSpecification(productId, newUpdate);
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
        contacts={brand?.contacts || location.contacts}
      />
    ) : null;

  const renderDistributorBusinessAdressDetail = (
    distributor?: DistributorProductMarket['distributors'][0],
  ) =>
    distributor ? (
      <BusinessDetail
        business={distributor?.name || distributor?.business_name || ''}
        address={getBusinessAddress(distributor)}
        phone_code={distributor?.phone_code ?? ''}
        general_phone={distributor?.phone ?? ''}
        genernal_email={distributor?.email ?? ''}
        customClass={styles.businessDetail}
        first_name={distributor.first_name}
        last_name={distributor.last_name}
        contacts={distributor.contacts}
      />
    ) : null;

  const renderCollapseHeader = (
    title: 'Brand Address' | 'Distributor Address',
    country: string,
    activeCollapse: boolean,
    onSelect: () => void,
  ) => {
    const handleShowAddress = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      onSelect?.();
    };

    const handleUncheckAddress = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      e.stopPropagation();
      handleOnChangeSpecifying(undefined, title === 'Brand Address');
    };

    const renderDeleteIcon = () => {
      if (
        isTiscAdmin ||
        isPublicPage ||
        (title == 'Brand Address' && !chosenBrandCountry) ||
        (title == 'Distributor Address' && !chosenDistributorCountry)
      )
        return null;

      return <DeleteIcon className={styles.deleteIcon} onClick={handleUncheckAddress} />;
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
            className="flex-start"
            style={{ height: '100%', cursor: 'default' }}
            onClick={(e) => {
              e.stopPropagation();
            }}>
            {renderDeleteIcon()}

            <div
              className={` ${isTiscAdmin ? 'cursor-disabled' : 'cursor-default'}`}
              onClick={isTiscAdmin || isPublicPage ? undefined : (e) => handleShowAddress(e)}>
              <div className="contact-select-box cursor-pointer">
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
                  if (isEmpty(distributorAddresses) && isSpecifying) {
                    return message.warn(MESSAGE_ERROR.DISTRIBUTOR_UNAVAILABLE);
                  }
                  setLocationPopup('distributor');
                  handleCollapse('distributor', activeKey);
                  return true;
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
                        type={location.functional_types?.[0]?.name}
                        address={getBusinessAddress(location)}
                        country={location.country_name.toUpperCase()}
                        phone_code={location.phone_code}
                        general_phone={location.general_phone}
                        genernal_email={location.general_email}
                        hideContact
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
                        business={distributor.business_name || distributor.name}
                        address={getBusinessAddress(distributor)}
                        country={distributor.country_name.toUpperCase()}
                        phone_code={distributor.phone_code}
                        general_phone={distributor.phone}
                        genernal_email={distributor.email}
                        first_name={distributor.first_name}
                        last_name={distributor.last_name}
                        hideContact
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

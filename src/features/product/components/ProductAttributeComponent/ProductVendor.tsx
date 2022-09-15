import { FC, useEffect, useState } from 'react';

import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as CatelogueIcon } from '@/assets/icons/catelogue-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as LocationIcon } from '@/assets/icons/location-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';

import { useCheckPermission, useGetParamId } from '@/helper/hook';
import { formatPhoneCode, getFullName } from '@/helper/utils';

import { DistributorProductMarket } from '@/features/distributors/type';
import { LocationGroupedByCountry } from '@/features/locations/type';
import { useAppSelector } from '@/reducers';

import CustomCollapse from '@/components/Collapse';
import { DropdownRadioItem } from '@/components/CustomRadio/DropdownRadioList';
import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';

import { BusinessDetail } from '../BrandContact';
import { CatelogueDownload } from './CatelogueDownload';
import styles from './ProductVendor.less';
import { getBrandLocation, getDistributorLocation } from '@/features/locations/api';

type BrandContactTitle = 'Brand Locations' | 'Distributor Locations';
type ModalTypes = '' | BrandContactTitle;

export const BRAND_CONTACT_TITLE: BrandContactTitle[] = [
  'Brand Locations',
  'Distributor Locations',
];

interface PopupForm {
  title: string;
  className?: string;
  dropDownRadioTitle: (dropdownData: DropdownRadioItem) => void;
  setVisible: (visible: boolean) => void;
}

interface BrandContactProps {
  title: BrandContactTitle;
}

export const BrandContact: FC<BrandContactProps> = ({ title }) => {
  const [openModal, setOpenModal] = useState<ModalTypes>('');

  /// for distributor location
  const [distributorLocation, setDistributorLocation] = useState<DistributorProductMarket[]>([]);

  /// for brand location
  const [brandLocation, setBrandLocation] = useState<LocationGroupedByCountry[]>([]);

  /// get productID
  const productID = useGetParamId();

  /// check user permission
  const showPopUp = useCheckPermission(['Brand Admin', 'Design Admin']);

  const brandID = useAppSelector((state) => state.product.brand?.id) || '';

  const handleShowPopup = (locationTitle: BrandContactTitle) => {
    if (!showPopUp) {
      return;
    }
    if (locationTitle === 'Brand Locations') {
      setOpenModal('Brand Locations');
    } else if (locationTitle === 'Distributor Locations') {
      setOpenModal('Distributor Locations');
    }
  };

  useEffect(() => {
    if (productID) {
      getDistributorLocation(productID).then((data) => {
        if (data) {
          setDistributorLocation(data);
        }
      });
    }
  }, [productID]);

  useEffect(() => {
    if (brandID) {
      getBrandLocation(brandID).then((data) => {
        if (data) {
          setBrandLocation(data);
        }
      });
    }
  }, [brandID]);

  const popupProps: PopupForm = {
    title: 'SELECT LOCATION',
    className: styles.customLocationModal,
    dropDownRadioTitle: (dropdownData: DropdownRadioItem) => dropdownData.country_name,
    setVisible: (visible: boolean) => (visible ? undefined : setOpenModal('')),
  };

  return (
    <div className="contact-item-wrapper">
      <div className="contact-item">
        <BodyText level={4} customClass="contact-item-title">
          {title}
        </BodyText>
        <div
          className={`contact-select-box ${showPopUp ? 'cursor-pointer' : 'cursor-default'} `}
          onClick={() => handleShowPopup(title)}>
          <BodyText level={6} fontFamily="Roboto">
            select
          </BodyText>
          {showPopUp ? <SingleRightIcon className="single-right-icon" /> : <DropdownIcon />}
        </div>
      </div>

      {/* distributor location */}
      <Popover
        {...popupProps}
        visible={openModal === 'Distributor Locations'}
        dropdownRadioList={distributorLocation.map((country) => {
          return {
            country_name: country.country_name,
            options: country.distributors.map((distributor) => {
              return {
                label: (
                  <BusinessDetail
                    business={distributor.name}
                    type={`
                      ${getFullName(distributor)},
                      ${formatPhoneCode(distributor.phone_code)} ${distributor.phone}
                    `}
                    address={`${distributor.address}, ${distributor.city_name}`}
                    country={country.country_name.toUpperCase()}
                  />
                ),
                value: distributor.id,
              };
            }),
          };
        })}
      />

      {/* brand location */}
      <Popover
        {...popupProps}
        visible={openModal === 'Brand Locations'}
        dropdownRadioList={brandLocation.map((country) => {
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
      />
    </div>
  );
};

export const ProductVendor: FC = () => {
  const brand = useAppSelector((state) => state.product.brand);

  return (
    <div className={styles.productVendorContainer}>
      <CustomCollapse
        showActiveBoxShadow
        className={styles.vendorSection}
        customHeaderClass={styles.vendorCustomPanelBox}
        header={
          <div className={styles.brandProfileHeader}>
            <BrandIcon />
            <BodyText level={6} fontFamily="Roboto">
              Brand Profile
            </BodyText>
          </div>
        }>
        <div className={styles.brandProfileInfo}>
          <div className="info-group">
            <BodyText level={4} customClass="brand-text-info-label">
              Slogan :
            </BodyText>
            <BodyText level={6} fontFamily="Roboto" customClass="brand-text-info">
              {brand?.slogan ?? ''}
            </BodyText>
          </div>
          <div className="info-group">
            <BodyText level={4} customClass="brand-text-info-label">
              Mission & Vison :
            </BodyText>
            <BodyText level={6} fontFamily="Roboto" customClass="brand-text-info">
              {brand?.mission_n_vision ?? ''}
            </BodyText>
          </div>
          <div className="info-group">
            <BodyText level={4} customClass="brand-text-info-label">
              Official Website :
            </BodyText>
            <table className="brand-websites">
              <tbody>
                {brand?.official_websites?.map((website, index: number) => (
                  <tr key={index}>
                    <td>
                      <BodyText level={6} fontFamily="Roboto" customClass={styles.countryName}>
                        {website.country_name ?? 'N/A'}
                      </BodyText>
                    </td>
                    <td>
                      <BodyText level={6} fontFamily="Roboto">
                        <a href={website.url ?? 'N/A'} target="_blank" rel="noreferrer">
                          {website.url ?? 'N/A'}
                        </a>
                      </BodyText>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CustomCollapse>

      <div className={styles.vendorSection}>
        <div className={styles.contactHeadline}>
          <LocationIcon className="contact-icon" />
          <BodyText level={6} fontFamily="Roboto">
            Contact & Address
          </BodyText>
        </div>
        <div className={styles.contactContent}>
          {BRAND_CONTACT_TITLE.map((title) => (
            <BrandContact title={title} />
          ))}
        </div>
      </div>

      <CustomCollapse
        showActiveBoxShadow
        className={`${styles.vendorSection} ${styles.catelogueSection}`}
        customHeaderClass={styles.vendorCustomPanelBox}
        header={
          <div className={styles.brandProfileHeader}>
            <CatelogueIcon />
            <BodyText level={6} fontFamily="Roboto">
              Catelogue & Download
            </BodyText>
          </div>
        }>
        <CatelogueDownload />
      </CustomCollapse>
    </div>
  );
};

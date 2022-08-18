import { FC, useEffect, useState } from 'react';
import { useAppSelector } from '@/reducers';
import styles from './ProductVendor.less';
import CustomCollapse from '@/components/Collapse';
import { BodyText } from '@/components/Typography';
import { useBoolean, useCheckPermission } from '@/helper/hook';
import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as CatelogueIcon } from '@/assets/icons/catelogue-icon.svg';
import { ReactComponent as LocationIcon } from '@/assets/icons/location-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';
import Popover from '@/components/Modal/Popover';
import { getBrandLocation, getDistributorLocation } from '@/services';
import { formatPhoneCode } from '@/helper/utils';
import { LocationGroupedByCountry, DistributorProductMarket } from '@/types';
import { useParams } from 'umi';
import { CatelogueDownload } from './CatelogueDownload';

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

type BrandContactTitle = 'Brand Locations' | 'Distributor Locations';
interface BrandContactProps {
  title: BrandContactTitle;
}

export const BRAND_CONTACT_TITLE: BrandContactTitle[] = [
  'Brand Locations',
  'Distributor Locations',
];

export const BrandContact: FC<BrandContactProps> = ({ title }) => {
  /// for distributor location
  const showDistributeSelection = useBoolean();
  const [distributorLocation, setDistributorLocation] = useState<DistributorProductMarket[]>([]);

  /// for brand location
  const showBrandSelection = useBoolean();
  const [brandLocation, setBrandLocation] = useState<LocationGroupedByCountry[]>([]);

  /// get productID
  const params = useParams<{ id: string }>();
  const productID = params?.id || '';

  /// check user permission
  const showPopUp = useCheckPermission(['Brand Admin', 'Design Admin']);

  const brandID = useAppSelector((state) => state.product.brand?.id) || '';

  const handleShowPopup = (locationTitle: BrandContactTitle) => {
    if (!showPopUp) {
      return;
    }
    if (locationTitle === 'Brand Locations') {
      showBrandSelection.setValue(true);
    } else if (locationTitle === 'Distributor Locations') {
      showDistributeSelection.setValue(true);
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

  return (
    <div className="contact-item-wrapper">
      <div className="contact-item">
        <BodyText level={4} customClass="contact-item-title">
          {title}
        </BodyText>
        <div className="contact-select-box" onClick={() => handleShowPopup(title)}>
          <BodyText level={6} fontFamily="Roboto">
            select
          </BodyText>
          {showPopUp ? <SingleRightIcon className="single-right-icon" /> : <DropdownIcon />}
        </div>
      </div>

      {/* distributor location */}
      <Popover
        title="SELECT LOCATION"
        className={styles.customLocationModal}
        visible={showDistributeSelection.value}
        setVisible={showDistributeSelection.setValue}
        dropDownRadioTitle={(dropdownData) => dropdownData.country_name}
        dropdownRadioList={distributorLocation.map((country) => {
          return {
            country_name: country.country_name,
            options: country.distributors.map((distributor) => {
              return {
                label: (
                  <BusinessDetail
                    business={distributor.name}
                    type={`
                      ${distributor.last_name} ${distributor.first_name},
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
        title="SELECT LOCATION"
        className={styles.customLocationModal}
        visible={showBrandSelection.value}
        setVisible={showBrandSelection.setValue}
        dropDownRadioTitle={(dropdownData) => dropdownData.country_name}
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
  const product = useAppSelector((state) => state.product);
  const { brand } = product;

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
        }
      >
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
                      <BodyText level={6} fontFamily="Roboto">
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
        }
      >
        <CatelogueDownload />
      </CustomCollapse>
    </div>
  );
};

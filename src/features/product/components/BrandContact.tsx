import Popover from '@/components/Modal/Popover';
import { BodyText, RobotoBodyText } from '@/components/Typography';
import { useBoolean, useCheckPermission } from '@/helper/hook';
import { getBrandLocation, getDistributorLocation } from '@/services';
import { LocationGroupedByCountry } from '@/types';
import { FC, ReactNode, useEffect, useState } from 'react';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';
import styles from './BrandContact.less';
import { RadioValue } from '@/components/CustomRadio/types';

export interface BusinessDetailProps {
  business: string;
  type: string;
  address: string;
  country?: string;
  phone_code?: string;
  general_phone?: string;
  genernal_email?: string;
  customClass?: string;
}
export const BusinessDetail: FC<BusinessDetailProps> = ({
  business = '',
  type = '',
  address = '',
  phone_code = '',
  general_phone = '',
  genernal_email = '',
  customClass = '',
}) => {
  return (
    <div className={`${styles.detail} ${customClass}`}>
      <div className={styles.detail_business}>
        <RobotoBodyText level={6} customClass={styles.name}>
          {business}
        </RobotoBodyText>
        <RobotoBodyText level={6} customClass={styles.type}>
          {type && `(${type})`}
        </RobotoBodyText>
      </div>
      <RobotoBodyText level={6} customClass={styles.detail_address}>
        {address}
      </RobotoBodyText>
      <div className={styles.detail_phoneEmail}>
        {general_phone ? (
          <RobotoBodyText level={6} customClass={styles.phone}>
            T: {`${phone_code} ${general_phone}`}
          </RobotoBodyText>
        ) : (
          ''
        )}
        {genernal_email ? <RobotoBodyText level={6}>E: {genernal_email}</RobotoBodyText> : ''}
      </div>
      {/* {      <span className={styles.detail_contact}>Contact: hien tai trong data khong co</span> :  ''} */}
    </div>
  );
};

export type BrandDistributorLocationAddress = BusinessDetailProps & RadioValue;
interface ChosenValueProps {
  chosenValue?: BrandDistributorLocationAddress;
  setChosenValue?: (chosenValue: BrandDistributorLocationAddress) => void;
}

interface BrandDistributorLocationProps extends ChosenValueProps {
  showSelection: { value: any; setValue: React.Dispatch<any> };
  data: LocationGroupedByCountry[];
  title?: string;
}

export const BrandDistributorLocationPopUp: FC<BrandDistributorLocationProps> = ({
  showSelection,
  data,
  title = 'SELECT LOCATION',
  chosenValue,
  setChosenValue,
}) => {
  return (
    <Popover
      title={title}
      className={styles.customLocationModal}
      visible={showSelection.value}
      setVisible={showSelection.setValue}
      chosenValue={chosenValue}
      setChosenValue={setChosenValue}
      dropDownRadioTitle={(dropdownData) => dropdownData.country_name}
      dropdownRadioList={data.map((country) => {
        return {
          country_name: country.country_name,
          options: country.locations.map((location) => {
            return {
              value: location.id,
              label: (
                <BusinessDetail
                  business={location.business_name}
                  type={location.functional_types[0]?.name}
                  address={location.address}
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
  );
};

interface BrandDistributorLabelProps {
  title: string;
  label?: string;
  handleShowPopup: (title: string) => void;
  showPopUp: boolean;
  showTitle?: boolean;
  icon?: ReactNode;
}

export const BrandDistributorLabel: FC<BrandDistributorLabelProps> = ({
  title,
  label,
  handleShowPopup,
  showPopUp,
  showTitle,
  icon,
}) => {
  return (
    <div className="contact-item">
      {showTitle ? (
        <BodyText level={4} customClass="contact-item-title">
          {title}
        </BodyText>
      ) : (
        ''
      )}
      <div className="contact-select-box" onClick={() => handleShowPopup(title)}>
        <BodyText level={6} fontFamily="Roboto">
          {label}
        </BodyText>
        {showPopUp ? (
          icon ? (
            icon
          ) : (
            <SingleRightIcon className="single-right-icon" />
          )
        ) : (
          <DropdownIcon />
        )}
      </div>
    </div>
  );
};

type BrandContactTitle = 'Brand' | 'Distributor';
interface BrandContactProps extends ChosenValueProps {
  productId?: string;
  brandId?: string;
  title: BrandContactTitle;
  label?: string;
  showTitle?: boolean;
  customClass?: string;
}

// export const BRAND_CONTACT_TITLE: BrandContactTitle[] = [
//   'Brand Locations',
//   'Distributor Locations',
//   'Brand Address',
//   'Distributor Address',
// ];

const BrandContact: FC<BrandContactProps> = ({
  productId,
  brandId,
  title,
  label = 'select',
  showTitle,
  customClass = '',
  chosenValue,
  setChosenValue,
}) => {
  /// for distributor location
  const showDistributeSelection = useBoolean();
  const [distributorLocation, setDistributorLocation] = useState<LocationGroupedByCountry[]>([]);

  /// for brand location
  const showBrandSelection = useBoolean();
  const [brandLocation, setBrandLocation] = useState<LocationGroupedByCountry[]>([]);

  /// check user permission
  const showPopUp = useCheckPermission(['Brand Admin', 'Design Admin']);

  // const brandID = useAppSelector((state) => state.product.brand?.id) || '';

  const handleShowPopup = (locationTitle: BrandContactTitle) => {
    if (!showPopUp) {
      return;
    }
    if (locationTitle === 'Brand') {
      showBrandSelection.setValue(true);
    } else if (locationTitle === 'Distributor') {
      showDistributeSelection.setValue(true);
    }
  };

  useEffect(() => {
    if (productId) {
      getDistributorLocation(productId).then((data) => {
        if (data) {
          setDistributorLocation(data);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (brandId) {
      getBrandLocation(brandId).then((data) => {
        if (data) {
          setBrandLocation(data);
        }
      });
    }
  }, []);

  return (
    <div className={`${styles.contactContent} ${customClass}`}>
      <div className="contact-item-wrapper">
        <BrandDistributorLabel
          title={title}
          label={label}
          handleShowPopup={() => handleShowPopup(title)}
          showPopUp
          showTitle={showTitle}
        />

        {/* distributor location */}
        <BrandDistributorLocationPopUp
          data={distributorLocation}
          showSelection={showDistributeSelection}
          chosenValue={chosenValue}
          setChosenValue={setChosenValue}
        />

        {/* brand location */}
        <BrandDistributorLocationPopUp
          data={brandLocation}
          showSelection={showBrandSelection}
          chosenValue={chosenValue}
          setChosenValue={setChosenValue}
        />
      </div>
    </div>
  );
};

export default BrandContact;

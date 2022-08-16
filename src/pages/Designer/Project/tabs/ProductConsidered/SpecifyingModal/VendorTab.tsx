// import { useState } from 'react';
import styles from './styles/vendor-tab.less';
import { RenderEntireProjectLabel } from '@/components/RenderHeaderLabel';
import { RobotoBodyText } from '@/components/Typography';
import BrandContact, {
  BrandDistributorLocationAddress,
  BusinessDetail,
} from '@/features/product/components/BrandContact';
import { FC, useState } from 'react';
import CustomCollapse from '@/components/Collapse';
import { RadioValue } from '@/components/CustomRadio/types';
import { CollapsibleType } from 'antd/lib/collapse/CollapsePanel';
import { OnChangeSpecifyingProductFnc } from './types';

interface VendorTabProps {
  productId: string;
  brandId: string;
  onChangeSpecifyingState: OnChangeSpecifyingProductFnc;
}

const VendorTab: FC<VendorTabProps> = ({ productId, brandId, onChangeSpecifyingState }) => {
  console.log('productId', productId);
  console.log('brandId', brandId);

  const [brandActiveKey, setBrandActiveKey] = useState<string | string[]>();
  const [brandAddressDetail, setBrandAddressDetail] = useState<BrandDistributorLocationAddress>();
  const [brandCollapsible, setBrandCollapsible] = useState<CollapsibleType>('disabled');
  const [brandBottomLine, setBrandBottomLine] = useState<boolean>(false);

  const onBrandAddressSelected = (locationSelected: RadioValue) => {
    // get detail
    setBrandAddressDetail(locationSelected?.label?.props);

    /// handle collapse
    if (locationSelected?.value) {
      onChangeSpecifyingState({ brand_location_id: String(locationSelected.value) });
      setBrandCollapsible('header');
    }
  };

  const [distributorActiveKey, setDistributorActiveKey] = useState<string | string[]>();
  const [distributorAddressDetail, setDistributorAddressDetail] =
    useState<BrandDistributorLocationAddress>();
  const [distributorCollapsible, setDistributorCollapsible] = useState<CollapsibleType>('disabled');
  const [distributorBottomLine, setDistributorBottomLine] = useState<boolean>(false);

  const onDistributorAddressSelected = (locationSelected: RadioValue) => {
    setDistributorAddressDetail(locationSelected?.label?.props);

    if (locationSelected?.value) {
      onChangeSpecifyingState({ distributor_location_id: String(locationSelected.value) });
      setDistributorCollapsible('header');
    }
  };

  const handleCollapse = (field: 'Brand' | 'Distributor', key: string | string[]) => {
    if (field === 'Brand') {
      setBrandBottomLine(!brandBottomLine);
      setDistributorBottomLine(false);
      setBrandActiveKey(key === '1' ? '' : key);
      setDistributorActiveKey('');
    } else if (field === 'Distributor') {
      setDistributorBottomLine(!distributorBottomLine);
      setBrandBottomLine(false);
      setDistributorActiveKey(key === '1' ? '' : key);
      setBrandActiveKey('');
    }
  };

  const BusinessAdressDetail: FC<{ addressDetail?: BrandDistributorLocationAddress }> = ({
    addressDetail,
  }) => {
    return (
      <BusinessDetail
        business={addressDetail?.business ?? ''}
        type={addressDetail?.type ?? ''}
        address={addressDetail?.address ?? ''}
        phone_code={addressDetail?.phone_code ?? ''}
        general_phone={addressDetail?.general_phone ?? ''}
        genernal_email={addressDetail?.genernal_email ?? ''}
        customClass={styles.businessDetail}
      />
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
        <div className={`${brandBottomLine ? styles.collapsed : styles.notCollapsed} `}>
          <div className={styles.address}>
            <CustomCollapse
              header={<RobotoBodyText level={5}>Brand Address</RobotoBodyText>}
              collapsible={brandCollapsible}
              onChange={(key) => handleCollapse('Brand', key)}
              activeKey={brandActiveKey}
            >
              <BusinessAdressDetail addressDetail={brandAddressDetail} />
            </CustomCollapse>

            <BrandContact
              brandId={'4e572577-93ca-4fe7-9c09-06ad65d717ea'}
              title="Brand"
              label={brandAddressDetail ? brandAddressDetail.country : 'selection location'}
              customClass={`
              ${styles.brandDistributor} ${brandCollapsible === 'header' ? styles.activeLabel : ''} 
              `}
              chosenValue={brandAddressDetail}
              setChosenValue={(chosenValue) => onBrandAddressSelected(chosenValue)}
            />
          </div>
        </div>

        {/* Distributor Address */}
        <div className={`${distributorBottomLine ? styles.collapsed : styles.notCollapsed} `}>
          <div className={styles.address}>
            <CustomCollapse
              header={<RobotoBodyText level={5}>Distributor Address</RobotoBodyText>}
              collapsible={distributorCollapsible}
              onChange={(key) => handleCollapse('Distributor', key)}
              activeKey={distributorActiveKey}
            >
              <BusinessAdressDetail addressDetail={distributorAddressDetail} />
            </CustomCollapse>

            <BrandContact
              productId={'c0a418b9-2476-4c05-a2e3-c31e31cc0843'}
              title="Distributor"
              label={
                distributorAddressDetail ? distributorAddressDetail.country : 'selection location'
              }
              customClass={`
              ${styles.brandDistributor} ${
                distributorCollapsible === 'header' ? styles.activeLabel : ''
              } 
              `}
              chosenValue={distributorAddressDetail}
              setChosenValue={(chosenValue) => onDistributorAddressSelected(chosenValue)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default VendorTab;

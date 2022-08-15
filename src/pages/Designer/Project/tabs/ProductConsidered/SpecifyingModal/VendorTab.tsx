// import { useState } from 'react';
import styles from './styles/vendor-tab.less';
import { RenderEntireProjectLabel } from '@/components/RenderHeaderLabel';
import { RobotoBodyText } from '@/components/Typography';
import BrandContact from '@/features/product/components/BrandContact';
import { FC, useState } from 'react';
import CustomCollapse from '@/components/Collapse';
import { RadioValue } from '@/components/CustomRadio/types';

interface VendorTabProps {
  productId: string;
  brandId: string;
}

const VendorTab: FC<VendorTabProps> = ({ productId, brandId }) => {
  console.log('productId', productId);
  console.log('brandId', brandId);

  const [chosenValue, setChosenValue] = useState<RadioValue>();

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
        <div className={styles.address}>
          <CustomCollapse header={<RobotoBodyText level={5}>Brand Address</RobotoBodyText>}>
            Brand textss
          </CustomCollapse>

          <BrandContact
            brandId={'4e572577-93ca-4fe7-9c09-06ad65d717ea'}
            title="Brand Address"
            // showTitle={false}
            label="selection location"
            customClass={styles.brandDistributor}
            chosenValue={chosenValue}
            setChosenValue={setChosenValue}
          />
        </div>

        <div className={styles.address}>
          <CustomCollapse header={<RobotoBodyText level={5}>Distributor Address</RobotoBodyText>}>
            Distributor Address
          </CustomCollapse>

          <BrandContact
            productId={productId}
            title="Distributor Address"
            // showTitle={false}
            label="selection location"
            customClass={styles.brandDistributor}
            chosenValue={chosenValue}
            setChosenValue={setChosenValue}
          />
        </div>
      </div>
    </div>
  );
};
export default VendorTab;

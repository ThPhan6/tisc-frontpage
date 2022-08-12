import { useState } from 'react';
import type { FC } from 'react';
import { CustomModal } from '@/components/Modal';
import CustomButton from '@/components/Button';
import { RobotoBodyText, MainTitle } from '@/components/Typography';
import { CustomTabs, CustomTabPane } from '@/components/Tabs';
import {
  ProjectSpecifyTabValue,
  ProjectSpecifyTabKeys,
  ProjectSpecifyTabs,
} from '../../../constants/tab';
import AllocationTab from './AllocationTab';
import VendorTab from './VendorTab';
import SpecificationTab from './SpecificationTab';
import CodeOrderTab from './CodeOrderTab';

import styles from './styles/specifying-modal.less';
import popoverStyles from '@/components/Modal/styles/Popover.less';
import { ProductItem } from '@/features/product/types';
import { showImageUrl } from '@/helper/utils';

interface SpecifyingModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  projectId: string;
  product: ProductItem;
}

export const SpecifyingModal: FC<SpecifyingModalProps> = ({ visible, setVisible, product }) => {
  const [selectedTab, setSelectedTab] = useState<ProjectSpecifyTabValue>(
    ProjectSpecifyTabKeys.specification,
  );
  console.log('product', product);
  return (
    <CustomModal
      className={`${popoverStyles.customPopover} ${styles.specifyingModal}`}
      visible={visible}
      onCancel={() => setVisible(false)}
      title={
        <MainTitle level={3} customClass="text-uppercase">
          Specifying
        </MainTitle>
      }
      centered
      // onCancel={onCancel}
      width={576}
      footer={
        <CustomButton
          size="small"
          variant="primary"
          properties="rounded"
          buttonClass="done-btn"
          // onClick={handleDone}
        >
          Done
        </CustomButton>
      }
    >
      <div className={styles.productInformationWrapper}>
        <div className={styles.productInformationContainer}>
          <img src={showImageUrl(product.image)} className={styles.productImage} />
          <div className={styles.productInformation}>
            <RobotoBodyText level={6}> {product.brand_name} </RobotoBodyText>
            <RobotoBodyText level={6}> {product.collection_name} </RobotoBodyText>
            <RobotoBodyText level={6}> {product.description} </RobotoBodyText>
          </div>
        </div>
        <div className={styles.brandLogo}>
          <img src="https://via.placeholder.com/24" />
        </div>
      </div>

      <CustomTabs
        listTab={ProjectSpecifyTabs}
        centered={true}
        tabPosition="top"
        tabDisplay="space"
        className={styles.projectTabInfo}
        onChange={(changedKey) => setSelectedTab(changedKey as ProjectSpecifyTabValue)}
        activeKey={selectedTab}
      />

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.specification}>
        <SpecificationTab />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.vendor}>
        <VendorTab />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.allocation}>
        <AllocationTab />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === ProjectSpecifyTabKeys.codeAndOrder}>
        <CodeOrderTab />
      </CustomTabPane>
    </CustomModal>
  );
};

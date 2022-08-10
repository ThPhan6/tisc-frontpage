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
interface SpecifyingModalProps {
  title?: string;
  visible?: boolean;
  setVisible?: (visible: boolean) => void;
}

const SpecifyingModal: FC<SpecifyingModalProps> = () => {
  const [selectedTab, setSelectedTab] = useState<ProjectSpecifyTabValue>(
    ProjectSpecifyTabKeys.specification,
  );
  return (
    <CustomModal
      className={`${popoverStyles.customPopover} ${styles.specifyingModal}`}
      visible={true}
      title={
        <MainTitle level={3} customClass="text-uppercase">
          specifiy
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
          <img src="https://via.placeholder.com/70" className={styles.productImage} />
          <div className={styles.productInformation}>
            <RobotoBodyText level={6}> Brand company name </RobotoBodyText>
            <RobotoBodyText level={6}> Collection/Series name </RobotoBodyText>
            <RobotoBodyText level={6}> Product/Item description </RobotoBodyText>
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
export default SpecifyingModal;

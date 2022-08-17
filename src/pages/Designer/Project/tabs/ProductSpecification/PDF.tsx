import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import { useState } from 'react';
import { ProductSpecifiedTabKeys, ProductSpecifiedTabs } from '../../constants/tab';
import styles from '../ProductSpecification/styles/index.less';
import IssuingInformation from './components/IssuingInformation';
import Standard from './components/Standard';
import PageTemplate from '@/assets/images/page.png';
import CustomButton from '@/components/Button';
import CustomPaginator from '@/components/Table/components/CustomPaginator';

const PDF = () => {
  const [selectedTab, setSelectedTab] = useState<ProductSpecifiedTabKeys>(
    ProductSpecifiedTabKeys.issuingInformation,
  );
  return (
    <div className={styles.content}>
      <div className={styles.content_left}>
        <CustomTabs
          listTab={ProductSpecifiedTabs}
          centered={true}
          tabPosition="top"
          tabDisplay="space"
          className={styles.projectTabInfo}
          onChange={(changedKey) => setSelectedTab(changedKey as ProductSpecifiedTabKeys)}
          activeKey={selectedTab}
        />
        <CustomTabPane active={selectedTab === ProductSpecifiedTabKeys.issuingInformation}>
          <IssuingInformation />
        </CustomTabPane>
        <CustomTabPane active={selectedTab === ProductSpecifiedTabKeys.standardSpecSheet}>
          <Standard />
        </CustomTabPane>
      </div>

      <div className={styles.content_right}>
        <div className={styles.pdf}>
          <img src={PageTemplate} />
        </div>
        <div className={styles.customPagination}>
          <CustomPaginator fetchData={() => {}} pagination={{}} dataLength={0} sorter={{}} />
          <div className={styles.action}>
            <CustomButton size="small" properties="rounded">
              Download
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDF;

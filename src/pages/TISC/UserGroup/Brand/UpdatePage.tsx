import { useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { BrandTabKeys } from './types';

import BrandAvailabilityDetail from './components/Availability';
import BrandDetailHeader from './components/BrandDetailHeader';
import BrandMenuSummary from './components/BrandMenuSummary';
import BrandDistributorDetail from './components/Distributor';
import BrandLocationDetail from './components/Location';
import BrandProfileDetail from './components/Profile';
import BrandTeamDetail from './components/Team';
import { CustomTabPane } from '@/components/Tabs';

const UpdateCreatePage = () => {
  const [selectedTab, setSelectedTab] = useState<BrandTabKeys>(BrandTabKeys.profile);

  return (
    <PageContainer pageHeaderRender={() => <BrandMenuSummary />}>
      <BrandDetailHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {/* profile */}
      <CustomTabPane active={selectedTab === BrandTabKeys.profile}>
        <BrandProfileDetail />
      </CustomTabPane>

      {/* location */}
      <CustomTabPane active={selectedTab === BrandTabKeys.locations}>
        <BrandLocationDetail />
      </CustomTabPane>

      {/* team */}
      <CustomTabPane active={selectedTab === BrandTabKeys.teams}>
        <BrandTeamDetail />
      </CustomTabPane>

      {/* distributors */}
      <CustomTabPane active={selectedTab === BrandTabKeys.distributors}>
        <BrandDistributorDetail />
      </CustomTabPane>

      {/* availability */}
      <CustomTabPane active={selectedTab === BrandTabKeys.availability}>
        <BrandAvailabilityDetail />
      </CustomTabPane>
    </PageContainer>
  );
};

export default UpdateCreatePage;

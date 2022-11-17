import { useEffect, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';

import { ReactComponent as ProfileIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as DistributorIcon } from '@/assets/icons/distributor-icon.svg';
import { ReactComponent as LocationIcon } from '@/assets/icons/location-icon.svg';
import { ReactComponent as AvailabilityIcon } from '@/assets/icons/market-availability-icon.svg';
import { ReactComponent as TeamIcon } from '@/assets/icons/team-profile-icon.svg';

import { getBrandById, getBrandStatuses } from '@/features/user-group/services';
import { useBoolean, useGetParamId } from '@/helper/hook';
import { updateBrandStatus } from '@/services/brand-profile';

import { TabItem } from '@/components/Tabs/types';
import {
  BrandDesignProfile,
  BrandTabKeys,
  DEFAULT_BRAND_DESIGN_PROFILE,
  TabKeys,
} from '@/features/user-group/types';
import { KeyValueData } from '@/types';

import { CustomTabPane } from '@/components/Tabs';
import BrandAvailabilityDetail from '@/features/user-group/components/AvailabilityDetail';
import BrandDistributorDetail from '@/features/user-group/components/DistributorDetail';
import { LocationDetail } from '@/features/user-group/components/LocationDetail';
import MenuHeaderSummary from '@/features/user-group/components/MenuHeaderSummary';
import { ProfileDetail } from '@/features/user-group/components/ProfileDetail';
import TabDetail from '@/features/user-group/components/TabDetail';
import TeamDetail from '@/features/user-group/components/TeamDetail';
import TooltipLabel from '@/features/user-group/components/TooltipLabel';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';
import styles from '@/features/user-group/styles/index.less';

const BrandTabs: TabItem[] = [
  { tab: BrandTabKeys.profile, key: BrandTabKeys.profile, icon: <ProfileIcon /> },
  { tab: BrandTabKeys.locations, key: BrandTabKeys.locations, icon: <LocationIcon /> },
  { tab: BrandTabKeys.teams, key: BrandTabKeys.teams, icon: <TeamIcon /> },
  { tab: BrandTabKeys.distributors, key: BrandTabKeys.distributors, icon: <DistributorIcon /> },
  { tab: BrandTabKeys.availability, key: BrandTabKeys.availability, icon: <AvailabilityIcon /> },
];

const UpdatePage = () => {
  const [selectedTab, setSelectedTab] = useState<TabKeys>(BrandTabKeys.profile);
  const buttonStatus = useBoolean();

  const [statuses, setStatuses] = useState<KeyValueData[]>([]);
  const [data, setData] = useState<BrandDesignProfile>(DEFAULT_BRAND_DESIGN_PROFILE);

  const brandId = useGetParamId();

  // get brand data
  useEffect(() => {
    getBrandById(brandId).then((brandData) => {
      if (brandData) {
        setData(brandData);
      }
    });
  }, []);

  // get statuses
  useEffect(() => {
    getBrandStatuses().then((statusesData) => {
      if (statusesData) {
        setStatuses(statusesData);
      }
    });
  }, []);

  const handleSaveButton = () => {
    showPageLoading();
    updateBrandStatus(brandId, { status: data.status }).then((isSuccess) => {
      hidePageLoading();
      if (isSuccess) {
        buttonStatus.setValue(true);
        setTimeout(() => {
          buttonStatus.setValue(false);
        }, 1000);
      }
    });
  };

  return (
    <div className={styles.userGroup}>
      <PageContainer pageHeaderRender={() => <MenuHeaderSummary type="brand" />}>
        <TabDetail
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          handleGoBackToTable={history.goBack}
          handleSaveButton={handleSaveButton}
          listTab={BrandTabs}
          data={data}
          setData={setData}
          buttonStatus={buttonStatus.value}
          statuses={statuses}
          toolTipTitle={
            <table className={styles.tooltip}>
              <TooltipLabel statusText="Pending" plainText="Waiting user activate" />
              <TooltipLabel statusText="Active" plainText="Full activated" />
              <TooltipLabel statusText="Inactive" plainText="Temporarily removed" />
            </table>
          }
        />

        {/* profile */}
        <CustomTabPane active={selectedTab === BrandTabKeys.profile} lazyLoad>
          <ProfileDetail type="brand" data={data} />
        </CustomTabPane>

        {/* location */}
        <CustomTabPane active={selectedTab === BrandTabKeys.locations} lazyLoad>
          <LocationDetail type="brand" id={brandId} />
        </CustomTabPane>

        {/* team */}
        <CustomTabPane active={selectedTab === BrandTabKeys.teams} lazyLoad>
          <TeamDetail type="brand" id={brandId} />
        </CustomTabPane>

        {/* distributors */}
        <CustomTabPane active={selectedTab === BrandTabKeys.distributors} lazyLoad>
          <BrandDistributorDetail id={brandId} />
        </CustomTabPane>

        {/* availability */}
        <CustomTabPane active={selectedTab === BrandTabKeys.availability} lazyLoad>
          <BrandAvailabilityDetail id={brandId} />
        </CustomTabPane>
      </PageContainer>
    </div>
  );
};

export default UpdatePage;

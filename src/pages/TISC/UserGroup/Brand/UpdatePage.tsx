import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';

import { ReactComponent as ProfileIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as DistributorIcon } from '@/assets/icons/distributor-icon.svg';
import { ReactComponent as LocationIcon } from '@/assets/icons/location-icon.svg';
import { ReactComponent as AvailabilityIcon } from '@/assets/icons/market-availability-icon.svg';
import { ReactComponent as TeamIcon } from '@/assets/icons/team-profile-icon.svg';

import { getBrandById, getBrandStatuses } from '@/features/user-group/services';
import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import { updateBrandStatus } from '@/services/brand-profile';

import { TabItem } from '@/components/Tabs/types';
import {
  BrandStatuses,
  BrandTabKeys,
  DEFAULT_BRAND_DESIGN_PROFILE,
  ProfileBrandDesign,
  TabKeys,
} from '@/features/user-group/types';

import { CustomTabPane } from '@/components/Tabs';
import BrandAvailabilityDetail from '@/features/user-group/components/Availability';
import BrandDistributorDetail from '@/features/user-group/components/Distributor';
import HeaderMenuSummary from '@/features/user-group/components/HeaderMenuSummary';
import LabelToolTip from '@/features/user-group/components/LabelToolTip';
import LocationDetail from '@/features/user-group/components/Location';
import ProfileDetail from '@/features/user-group/components/Profile';
import TabDetail from '@/features/user-group/components/TabDetail';
import TeamDetail from '@/features/user-group/components/Team';

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
  const isLoading = useBoolean();
  const [statuses, setStatuses] = useState<BrandStatuses[]>([]);
  const [data, setData] = useState<ProfileBrandDesign>(DEFAULT_BRAND_DESIGN_PROFILE);

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

  const goBackToBrandList = () => {
    pushTo(PATH.tiscUserGroupBrandList);
  };

  const handleSaveButton = () => {
    isLoading.setValue(true);
    updateBrandStatus(brandId, { status: data.status }).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        buttonStatus.setValue(true);
        setTimeout(() => {
          buttonStatus.setValue(false);
        }, 1000);
      }
    });
  };

  return (
    <PageContainer pageHeaderRender={() => <HeaderMenuSummary type="brand" />}>
      <TabDetail
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        handleGoBackToTable={goBackToBrandList}
        handleSaveButton={handleSaveButton}
        listTab={BrandTabs}
        data={data}
        setData={setData}
        buttonStatus={buttonStatus.value}
        isLoading={isLoading.value}
        statuses={statuses}
        toolTipTitle={
          <table className={styles.tooltip}>
            <LabelToolTip statusText="Pending" plainText="Waiting user activate" />
            <LabelToolTip statusText="Active" plainText="Full activated" />
            <LabelToolTip statusText="Inactive" plainText="Temporarily removed" />
          </table>
        }
      />

      {/* profile */}
      <CustomTabPane active={selectedTab === BrandTabKeys.profile}>
        <ProfileDetail type="brand" data={data} />
      </CustomTabPane>

      {/* location */}
      <CustomTabPane active={selectedTab === BrandTabKeys.locations}>
        <LocationDetail type="brand" id={brandId} />
      </CustomTabPane>

      {/* team */}
      <CustomTabPane active={selectedTab === BrandTabKeys.teams}>
        <TeamDetail type="brand" id={brandId} />
      </CustomTabPane>

      {/* distributors */}
      <CustomTabPane active={selectedTab === BrandTabKeys.distributors}>
        <BrandDistributorDetail id={brandId} />
      </CustomTabPane>

      {/* availability */}
      <CustomTabPane active={selectedTab === BrandTabKeys.availability}>
        <BrandAvailabilityDetail id={brandId} />
      </CustomTabPane>
    </PageContainer>
  );
};

export default UpdatePage;

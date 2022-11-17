import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { PageContainer } from '@ant-design/pro-layout';

import { ReactComponent as CustomIcon } from '@/assets/icons/custom-icon.svg';
import { ReactComponent as ProfileIcon } from '@/assets/icons/design-firm-icon.svg';
import { ReactComponent as LocationIcon } from '@/assets/icons/location-icon.svg';
import { ReactComponent as MaterialIcon } from '@/assets/icons/material-product-code-icon.svg';
import { ReactComponent as ProjectIcon } from '@/assets/icons/project-icon.svg';
import { ReactComponent as TeamIcon } from '@/assets/icons/team-profile-icon.svg';

import {
  getDesignStatuses,
  getOneDesignFirm,
  updateStatusDesignFirm,
} from '@/features/user-group/services';
import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';

import { TabItem } from '@/components/Tabs/types';
import {
  BrandDesignProfile,
  DEFAULT_BRAND_DESIGN_PROFILE,
  DesignTabKeys,
  TabKeys,
} from '@/features/user-group/types';
import { KeyValueData } from '@/types';

import { CustomTabPane } from '@/components/Tabs';
import CustomDesign from '@/features/user-group/components/CustomDesign';
import { LocationDetail } from '@/features/user-group/components/LocationDetail';
import MaterialCode from '@/features/user-group/components/MaterialCode';
import MenuHeaderSummary from '@/features/user-group/components/MenuHeaderSummary';
import { ProfileDetail } from '@/features/user-group/components/ProfileDetail';
import ProjectDesign from '@/features/user-group/components/ProjectDesign';
import TabDetail from '@/features/user-group/components/TabDetail';
import TeamDetail from '@/features/user-group/components/TeamDetail';
import LabelToolTip from '@/features/user-group/components/TooltipLabel';

import styles from './index.less';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

const DesignTabs: TabItem[] = [
  { tab: DesignTabKeys.profile, key: DesignTabKeys.profile, icon: <ProfileIcon /> },
  { tab: DesignTabKeys.locations, key: DesignTabKeys.locations, icon: <LocationIcon /> },
  { tab: DesignTabKeys.teams, key: DesignTabKeys.teams, icon: <TeamIcon /> },
  { tab: DesignTabKeys.materialCode, key: DesignTabKeys.materialCode, icon: <MaterialIcon /> },
  { tab: DesignTabKeys.projects, key: DesignTabKeys.projects, icon: <ProjectIcon /> },
  { tab: DesignTabKeys.custom, key: DesignTabKeys.custom, icon: <CustomIcon /> },
];

const DesignFirmUpdatePage = () => {
  const designId = useGetParamId();
  const [selectedTab, setSelectedTab] = useState<TabKeys>(DesignTabKeys.profile);
  const buttonStatus = useBoolean(false);
  const [statuses, setStatuses] = useState<KeyValueData[]>([]);
  const [data, setData] = useState<BrandDesignProfile>(DEFAULT_BRAND_DESIGN_PROFILE);

  // get statuses
  useEffect(() => {
    getDesignStatuses().then((statusesData) => {
      if (statusesData) {
        setStatuses(statusesData);
      }
    });
  }, []);

  useEffect(() => {
    getOneDesignFirm(designId).then((designFirmData) => {
      if (designFirmData) {
        setData(designFirmData);
      }
    });
  }, []);

  const goBackToDesignerList = () => {
    pushTo(PATH.tiscUserGroupDesignerList);
  };

  const handleSaveButton = () => {
    showPageLoading();
    updateStatusDesignFirm(designId, { status: data.status }).then((isSuccess) => {
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
      <PageContainer pageHeaderRender={() => <MenuHeaderSummary type="design" />}>
        <TabDetail
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          listTab={DesignTabs}
          handleGoBackToTable={goBackToDesignerList}
          handleSaveButton={handleSaveButton}
          data={data}
          setData={setData}
          buttonStatus={buttonStatus.value}
          statuses={statuses}
          toolTipTitle={
            <table className={styles.tooltip}>
              <LabelToolTip statusText="Active" plainText="Fully activated" />
              <LabelToolTip statusText="Inactive" plainText="Removed & archived" />
            </table>
          }
        />

        {/* profile */}
        <CustomTabPane active={selectedTab === DesignTabKeys.profile} lazyLoad>
          <ProfileDetail type="design" data={data} />
        </CustomTabPane>

        {/* locations */}
        <CustomTabPane active={selectedTab === DesignTabKeys.locations} lazyLoad>
          <LocationDetail type="design" id={designId} />
        </CustomTabPane>

        {/* teams */}
        <CustomTabPane active={selectedTab === DesignTabKeys.teams} lazyLoad>
          <TeamDetail type="design" id={designId} />
        </CustomTabPane>

        {/* material code */}
        <CustomTabPane active={selectedTab === DesignTabKeys.materialCode} lazyLoad>
          <MaterialCode id={designId} />
        </CustomTabPane>

        {/* project */}
        <CustomTabPane active={selectedTab === DesignTabKeys.projects} lazyLoad>
          <ProjectDesign id={designId} />
        </CustomTabPane>

        {/* custom */}
        <CustomTabPane active={selectedTab === DesignTabKeys.custom} lazyLoad>
          <CustomDesign />
        </CustomTabPane>
      </PageContainer>
    </div>
  );
};
export default DesignFirmUpdatePage;

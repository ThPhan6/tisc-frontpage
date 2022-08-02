import { MainTitle, Title } from '@/components/Typography';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { MenuSummary } from '@/components/MenuSummary';
import { dataMenuFirm } from '@/constants/util';
import styles from '../DesignFirm/styles/index.less';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import { TabItem } from '@/components/Tabs/types';
import { ReactComponent as ProfileIcon } from '@/assets/icons/design-firm-icon.svg';
import { ReactComponent as LocationIcon } from '@/assets/icons/location-icon.svg';
import { ReactComponent as TeamIcon } from '@/assets/icons/team-profile-icon.svg';
import { ReactComponent as ProjectIcon } from '@/assets/icons/project-icon.svg';
import { ReactComponent as MaterialIcon } from '@/assets/icons/material-product-code-icon.svg';
import CustomButton from '@/components/Button';
import { Tooltip } from 'antd';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';
import { MESSAGE_TOOLTIP } from '@/constants/message';
import { CustomRadio } from '@/components/CustomRadio';
import ProfileDesign from './components/ProfileDesign';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import LocationDesign from './components/LocationDesign';
import { useState } from 'react';

export enum DesignTabKeys {
  profile = 'profile',
  locations = 'locations',
  teams = 'teams',
  materialCode = 'material',
  projects = 'projects',
}

const LIST_MENU_DESIGN_FIRM: TabItem[] = [
  { tab: 'Profile', key: DesignTabKeys.profile, icon: <ProfileIcon /> },
  { tab: 'Locations', key: DesignTabKeys.locations, icon: <LocationIcon /> },
  { tab: 'Teams', key: DesignTabKeys.teams, icon: <TeamIcon /> },
  { tab: 'Material Code', key: DesignTabKeys.materialCode, icon: <MaterialIcon /> },
  { tab: 'Projects', key: DesignTabKeys.projects, icon: <ProjectIcon /> },
];

const optionStatus = [
  { label: 'Active', value: 1 },
  { label: 'Inactive', value: 2 },
];

const ViewDesignFirmPage = () => {
  const [selectedTab, setSelectedTab] = useState<DesignTabKeys>(DesignTabKeys.profile);
  // const [data, setData] = useState();
  const [status, setStatus] = useState(false);

  const handleOnChangeStatus = (radioValue: boolean) => {
    setStatus(radioValue);
  };

  return (
    <>
      <div className={styles.menuSummary}>
        <MenuSummary
          typeMenu="subscription"
          menuSummaryData={dataMenuFirm.leftData}
          containerClass={styles.customMenuSummary}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <Title level={7}>Design Firms</Title>
          <CloseIcon
            onClick={() => pushTo(PATH.tiscUserGroupDesignerList)}
            className={styles.closeIcon}
          />
        </div>
        <div className={styles.bottomHeader}>
          <CustomTabs
            listTab={LIST_MENU_DESIGN_FIRM}
            onChange={(changedKey) => setSelectedTab(changedKey as DesignTabKeys)}
            activeKey={selectedTab}
          />
          <div className={styles.rightHeader}>
            <div className={styles.status}>
              <div className={styles.status}>
                <MainTitle level={4} customClass={styles.textStatus}>
                  Status:
                </MainTitle>
                <Tooltip
                  placement="bottomLeft"
                  title={MESSAGE_TOOLTIP.STATUS_DESING_FIRMS}
                  align={{
                    offset: [-14, -9],
                  }}
                  overlayInnerStyle={{
                    width: '188px',
                    height: 'auto',
                    padding: '6px 12px',
                    fontWeight: '300',
                    fontSize: '14px',
                    lineHeight: '21px',
                    letterSpacing: '0.24px',
                  }}
                >
                  <WarningIcon />
                </Tooltip>
              </div>
              <CustomRadio
                options={optionStatus}
                containerClass={styles.listStatus}
                onChange={(radioValue) => handleOnChangeStatus(radioValue.value as boolean)}
                value={status}
              />
            </div>
            <CustomButton buttonClass={styles.action} size="small">
              Save
            </CustomButton>
          </div>
        </div>
      </div>
      <div>
        {/* profile */}
        <CustomTabPane active={selectedTab === DesignTabKeys.profile}>
          <ProfileDesign />
        </CustomTabPane>

        {/* locations */}
        <CustomTabPane active={selectedTab === DesignTabKeys.locations}>
          <LocationDesign />
        </CustomTabPane>
      </div>
    </>
  );
};
export default ViewDesignFirmPage;

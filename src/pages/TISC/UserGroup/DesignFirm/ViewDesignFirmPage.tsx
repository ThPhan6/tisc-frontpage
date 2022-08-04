import { BodyText, MainTitle, Title } from '@/components/Typography';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import styles from '../DesignFirm/styles/index.less';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import { TabItem } from '@/components/Tabs/types';
import { ReactComponent as ProfileIcon } from '@/assets/icons/design-firm-icon.svg';
import { ReactComponent as LocationIcon } from '@/assets/icons/location-icon.svg';
import { ReactComponent as TeamIcon } from '@/assets/icons/team-profile-icon.svg';
import { ReactComponent as ProjectIcon } from '@/assets/icons/project-icon.svg';
import { ReactComponent as MaterialIcon } from '@/assets/icons/material-product-code-icon.svg';
import CustomButton from '@/components/Button';
import { ReactComponent as CustomIcon } from '@/assets/icons/custom-icon.svg';
import { Tooltip } from 'antd';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';
import { CustomRadio } from '@/components/CustomRadio';
import ProfileDesign from './components/ProfileDesign';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import LocationDesign from './components/LocationDesign';
import { FC, useEffect, useState } from 'react';
import { DesignFirmDetail, LocationsDesignFirm, TeamsDesignFirm } from '@/types';
import { getLocationsByDesignFirm, getOneDesignFirm, getTeamsByDesignFirm } from '@/services';
import { useParams } from 'umi';
import TeamsDesign from './components/TeamsDesign';
import MaterialCode from './components/MaterialCode';
import ProjectDesign from './components/ProjectDesign';
import CustomDesign from './components/CustomDesign';
import DesignFirmSummary from './components/DesignFirmSummary';
import { useBoolean } from '@/helper/hook';
import LoadingPageCustomize from '@/components/LoadingPage';

export enum DesignTabKeys {
  profile = 'profile',
  locations = 'locations',
  teams = 'teams',
  materialCode = 'material',
  projects = 'projects',
  custom = 'custom',
}

const LIST_MENU_DESIGN_FIRM: TabItem[] = [
  { tab: 'Profile', key: DesignTabKeys.profile, icon: <ProfileIcon /> },
  { tab: 'Locations', key: DesignTabKeys.locations, icon: <LocationIcon /> },
  { tab: 'Teams', key: DesignTabKeys.teams, icon: <TeamIcon /> },
  { tab: 'Material Code', key: DesignTabKeys.materialCode, icon: <MaterialIcon /> },
  { tab: 'Projects', key: DesignTabKeys.projects, icon: <ProjectIcon /> },
  { tab: 'Custom', key: DesignTabKeys.custom, icon: <CustomIcon /> },
];

const optionStatus = [
  { label: 'Active', value: 1 },
  { label: 'Inactive', value: 2 },
];

const ViewDesignFirmPage = () => {
  const [selectedTab, setSelectedTab] = useState<DesignTabKeys>(DesignTabKeys.profile);
  const isLoading = useBoolean();
  const params = useParams<{
    id: string;
  }>();
  const designId = params?.id || '';
  const [loadedData, setLoadedData] = useState(false);
  const [data, setData] = useState<DesignFirmDetail>({
    id: '',
    name: '',
    parent_company: '',
    logo: '',
    slogan: '',
    profile_n_philosophy: '',
    official_website: '',
    design_capabilities: '',
    team_profile_ids: [],
    location_ids: [],
    material_code_ids: [],
    project_ids: [],
    status: 1,
  });

  const [locationData, setLocationData] = useState<LocationsDesignFirm[]>([]);
  const [teamData, setTeamData] = useState<TeamsDesignFirm[]>([]);

  const handleOnChangeStatus = (radioValue: number) => {
    setData({ ...data, status: radioValue });
  };

  const viewDesignFirm = () => {
    isLoading.setValue(true);
    getOneDesignFirm(designId).then((res) => {
      if (res) {
        setData({
          id: res.id,
          name: res.name,
          parent_company: res.parent_company,
          logo: res.logo,
          slogan: res.slogan,
          profile_n_philosophy: res.profile_n_philosophy,
          official_website: res.official_website,
          design_capabilities: res.design_capabilities,
          team_profile_ids: res.team_profile_ids,
          location_ids: res.location_ids,
          material_code_ids: res.material_code_ids,
          project_ids: res.project_ids,
          status: res.status,
        });
        setLoadedData(true);
        isLoading.setValue(false);
      }
    });
  };

  const getLocations = () => {
    getLocationsByDesignFirm(designId).then((res) => {
      if (res) {
        setLocationData(res);
        setLoadedData(true);
      }
    });
  };

  const getTeams = () => {
    getTeamsByDesignFirm(designId).then((res) => {
      if (res) {
        setTeamData(res);
        setLoadedData(true);
      }
    });
  };

  useEffect(() => {
    viewDesignFirm();
    getLocations();
    getTeams();
  }, []);

  const handleUpdateStatus = () => {
    alert('Coming soon!');
  };

  if (!loadedData) {
    return null;
  }

  const RenderLabelToolTip: FC<{ statusText: string; plainText: string }> = ({
    statusText,
    plainText,
  }) => {
    return (
      <tr>
        <td>
          <BodyText level={4} style={{ marginRight: '4px' }}>{`${statusText}:`}</BodyText>
        </td>
        <td>
          <BodyText level={6} fontFamily="Roboto">
            {plainText}
          </BodyText>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className={styles.menuSummary}>
        <DesignFirmSummary />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <Title level={7}>{data.name}</Title>
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
              <div className={styles.status_item}>
                <MainTitle level={4} customClass={styles.textStatus}>
                  Status:
                </MainTitle>
                <Tooltip
                  placement="bottomLeft"
                  title={
                    <table className={styles.tooltip}>
                      <RenderLabelToolTip statusText="Active" plainText="Fully activated." />
                      <RenderLabelToolTip statusText="Inactive" plainText="Removed & archived" />
                    </table>
                  }
                  align={{
                    offset: [-14, -9],
                  }}
                >
                  <WarningIcon />
                </Tooltip>
              </div>
              <CustomRadio
                options={optionStatus}
                containerClass={styles.listStatus}
                onChange={(radioValue) => handleOnChangeStatus(radioValue.value as number)}
                value={data.status}
              />
            </div>
            <CustomButton buttonClass={styles.action} size="small" onClick={handleUpdateStatus}>
              Save
            </CustomButton>
          </div>
        </div>
      </div>
      <div>
        {/* profile */}
        <CustomTabPane active={selectedTab === DesignTabKeys.profile}>
          <ProfileDesign data={data} />
        </CustomTabPane>

        {/* locations */}
        <CustomTabPane active={selectedTab === DesignTabKeys.locations}>
          <LocationDesign locationData={locationData} />
        </CustomTabPane>

        {/* teams */}
        <CustomTabPane active={selectedTab === DesignTabKeys.teams}>
          <TeamsDesign teamData={teamData} />
        </CustomTabPane>

        {/* material code */}
        <CustomTabPane active={selectedTab === DesignTabKeys.materialCode}>
          <MaterialCode />
        </CustomTabPane>

        {/* project */}
        <CustomTabPane active={selectedTab === DesignTabKeys.projects}>
          <ProjectDesign />
        </CustomTabPane>

        {/* custom */}
        <CustomTabPane active={selectedTab === DesignTabKeys.custom}>
          <CustomDesign />
        </CustomTabPane>
      </div>
      {isLoading.value && <LoadingPageCustomize />}
    </>
  );
};
export default ViewDesignFirmPage;

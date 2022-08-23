import { FC, useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { Tooltip } from 'antd';

import { ReactComponent as CustomIcon } from '@/assets/icons/custom-icon.svg';
import { ReactComponent as ProfileIcon } from '@/assets/icons/design-firm-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { ReactComponent as LocationIcon } from '@/assets/icons/location-icon.svg';
import { ReactComponent as MaterialIcon } from '@/assets/icons/material-product-code-icon.svg';
import { ReactComponent as ProjectIcon } from '@/assets/icons/project-icon.svg';
import { ReactComponent as TeamIcon } from '@/assets/icons/team-profile-icon.svg';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import {
  getLocationsByDesignFirm,
  getMaterialCodeByDesignFirm,
  getOneDesignFirm,
  getProjectsByDesignFirm,
  getTeamsByDesignFirm,
  updateStatusDesignFirm,
} from '@/services';

import { TabItem } from '@/components/Tabs/types';
import { ProjectsDesignFirm } from '@/features/project/types';
import {
  DesignFirmDetail,
  LocationGroupedByCountry,
  MaterialCodeDesignFirm,
  TeamsDesignFirm,
} from '@/types';

import CustomDesign from './components/CustomDesign';
import DesignFirmSummary from './components/DesignFirmSummary';
import LocationDesign from './components/LocationDesign';
import MaterialCode from './components/MaterialCode';
import ProfileDesign from './components/ProfileDesign';
import ProjectDesign from './components/ProjectDesign';
import TeamsDesign from './components/TeamsDesign';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { CustomRadio } from '@/components/CustomRadio';
import LoadingPageCustomize from '@/components/LoadingPage';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import { BodyText, MainTitle, Title } from '@/components/Typography';

import styles from '../DesignFirm/styles/index.less';

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
  const designId = useGetParamId();
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

  const [locationData, setLocationData] = useState<LocationGroupedByCountry[]>([]);
  const [teamData, setTeamData] = useState<TeamsDesignFirm[]>([]);
  const [projectData, setProjectData] = useState<ProjectsDesignFirm[]>([]);
  const [materialCodeData, setMaterialCodeData] = useState<MaterialCodeDesignFirm[]>([]);
  const submitButtonStatus = useBoolean(false);

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
      }
    });
    getLocationsByDesignFirm(designId).then((res) => {
      if (res) {
        setLocationData(res);
      }
    });
    getTeamsByDesignFirm(designId).then((res) => {
      if (res) {
        setTeamData(res);
      }
    });
    getProjectsByDesignFirm(designId).then((res) => {
      if (res) {
        setProjectData(res);
      }
    });
    getMaterialCodeByDesignFirm(designId).then((res) => {
      if (res) {
        setMaterialCodeData(res);
        setLoadedData(true);
        isLoading.setValue(false);
      }
    });
  };

  useEffect(() => {
    viewDesignFirm();
  }, []);

  const handleUpdateStatus = () => {
    isLoading.setValue(true);
    updateStatusDesignFirm(designId, { status: data.status }).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 2000);
      }
    });
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
            customClass={styles.tab}
            widthItem="auto"
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
                  }}>
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
            <div className={styles.action}>
              <CustomSaveButton isSuccess={submitButtonStatus.value} onClick={handleUpdateStatus} />
            </div>
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
          <MaterialCode materialCodeData={materialCodeData} />
        </CustomTabPane>

        {/* project */}
        <CustomTabPane active={selectedTab === DesignTabKeys.projects}>
          <ProjectDesign projectData={projectData} />
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

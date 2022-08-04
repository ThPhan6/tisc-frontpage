import { TableHeader } from '@/components/Table/TableHeader';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/info-icon.svg';
import { ReactComponent as ProfileIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as LocationIcon } from '@/assets/icons/location-icon.svg';
import { ReactComponent as TeamIcon } from '@/assets/icons/team-profile-icon.svg';
import { ReactComponent as DistributorIcon } from '@/assets/icons/distributor-icon.svg';
import { ReactComponent as AvailabilityIcon } from '@/assets/icons/market-availability-icon.svg';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import styles from '../styles/index.less';
import { CustomTabs } from '@/components/Tabs';
import { BrandTabKeys } from '../types';
import { FC, useEffect, useState } from 'react';
import { BodyText, MainTitle } from '@/components/Typography';
import { CustomRadio } from '@/components/CustomRadio';
import { getBrandById, getBrandStatuses } from '@/services';
import { BrandDetail, BrandStatuses } from '@/types';
import { useParams } from 'umi';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { useBoolean } from '@/helper/hook';
import LoadingPageCustomize from '@/components/LoadingPage';
import { Tooltip } from 'antd';
import { TabItem } from '@/components/Tabs/types';
// import ScrollBar from '@/components/ScrollBar';

export const BrandTabs: TabItem[] = [
  { tab: 'PROFILE', key: BrandTabKeys.profile, icon: <ProfileIcon /> },
  { tab: 'LOCATIONS', key: BrandTabKeys.locations, icon: <LocationIcon /> },
  { tab: 'TEAMS', key: BrandTabKeys.teams, icon: <TeamIcon /> },
  { tab: 'DISTRIBUTORS', key: BrandTabKeys.distributors, icon: <DistributorIcon /> },
  { tab: 'AVAILABILITY', key: BrandTabKeys.availability, icon: <AvailabilityIcon /> },
];

interface BrandDetailHeaderProps {
  selectedTab: BrandTabKeys;
  setSelectedTab: (selectedTab: BrandTabKeys) => void;
}

const BrandDetailHeader: FC<BrandDetailHeaderProps> = ({ selectedTab, setSelectedTab }) => {
  const params = useParams<{ id: string }>();
  const brandId = params?.id || '';
  const [statuses, setStatuses] = useState<BrandStatuses[]>([]);
  const buttonStatus = useBoolean();
  const isLoading = useBoolean();
  const [data, setData] = useState<BrandDetail>({
    id: '',
    name: '',
    parent_company: null,
    logo: '',
    slogan: '',
    mission_n_vision: '',
    official_websites: [],
    team_profile_ids: [],
    location_ids: [],
    status: 1,
    created_at: '',
    updated_at: null,
    is_deleted: false,
  });

  const goBackToBrandList = () => {
    pushTo(PATH.tiscUserGroupBrandList);
  };

  // get data
  useEffect(() => {
    getBrandById(brandId).then((brandData) => {
      if (brandData) {
        console.log('brand Data', brandData);

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
    isLoading.setValue(false);
  };

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
    <div>
      <TableHeader
        title="BRANDS"
        rightAction={<CloseIcon onClick={goBackToBrandList} style={{ cursor: 'pointer' }} />}
      />
      <div className={styles.menuTab}>
        {/* <ScrollBar> */}
        <div className={styles.tabs}>
          <CustomTabs
            listTab={BrandTabs}
            tabPosition="top"
            tabDisplay="start"
            onChange={(changedKey) => setSelectedTab(changedKey as BrandTabKeys)}
            activeKey={selectedTab}
            widthItem={'125px'}
            customClass={styles.tabs_items}
          />
          <div className={styles.basicToolbarForm}>
            <MainTitle level={3}>Status:</MainTitle>
            <Tooltip
              placement="bottom"
              align={{
                offset: [0, -2],
              }}
              title={
                <table className={styles.tooltip}>
                  <RenderLabelToolTip statusText="Pending" plainText="Waiting user activate" />
                  <RenderLabelToolTip statusText="Active" plainText="Full activated" />
                  <RenderLabelToolTip statusText="Inactive" plainText="Temporarily removed" />
                </table>
              }
            >
              <InfoIcon className={styles.info_icon} />
            </Tooltip>
            <CustomRadio
              options={statuses.map((status) => {
                return {
                  label: (
                    <BodyText level={6} fontFamily="Roboto" customClass={styles.projectStatusLabel}>
                      {status.key}
                    </BodyText>
                  ),
                  value: status.value,
                };
              })}
              value={data.status}
              onChange={(selectedValue) =>
                setData({
                  ...data,
                  status: selectedValue.value as number,
                })
              }
            />
            <CustomSaveButton onClick={handleSaveButton} isSuccess={buttonStatus.value} />
          </div>
        </div>
        {/* </ScrollBar> */}
      </div>

      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default BrandDetailHeader;

import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/info-icon.svg';
import CustomButton from '@/components/Button';
import { CustomRadio } from '@/components/CustomRadio';
import { FormGroup } from '@/components/Form';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import { BodyText } from '@/components/Typography';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { PageContainer } from '@ant-design/pro-layout';
import { FC, useState } from 'react';
import { BrandAccessLevelDataRole } from '../../Adminstration/TeamProfiles/constants/role';
import BrandAvailabilityDetail from './components/Availability';
import BrandMenuSummary from './components/BrandMenuSummary';
import BrandDistributorDetail from './components/Distributor';
import BrandLocationDetail from './components/Location';
import BrandProfileDetail from './components/Profile';
import BrandTeamDetail from './components/Team';
import styles from './styles/index.less';
import { BrandTabKeys, BrandTabs } from './types';

const UpdateCreatePage = () => {
  //   const submitButtonStatus = useBoolean(false);

  const [selectedTab, setSelectedTab] = useState<BrandTabKeys>(BrandTabKeys.profile);

  // for detail page
  const [data, setData] = useState([]);

  console.log(data);

  const goBackToBrandList = () => {
    pushTo(PATH.tiscUserGroupBrandList);
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
    <PageContainer pageHeaderRender={() => <BrandMenuSummary />}>
      <TableHeader title="BRANDS" rightAction={<CloseIcon onClick={goBackToBrandList} />} />
      <div className={styles.tabs}>
        <CustomTabs
          listTab={BrandTabs}
          tabPosition="top"
          tabDisplay="start"
          onChange={(changedKey) => setSelectedTab(changedKey as BrandTabKeys)}
          activeKey={selectedTab}
          widthItem={'125px'}
        />

        <div className={styles.tabs_right}>
          <FormGroup
            label="Status:"
            iconTooltip={<InfoIcon className={styles.info_icon} />}
            formClass={styles.status}
            layout="horizontal"
            tooltip={
              <table className={styles.tooltip}>
                <RenderLabelToolTip statusText="Pending" plainText="Waiting user activate" />
                <RenderLabelToolTip statusText="Active" plainText="Full activated" />
                <RenderLabelToolTip statusText="Inactive" plainText="Temporarily removed" />
              </table>
            }
            placement="bottom"
            placementBottomWidth="auto"
          >
            <CustomRadio
              options={BrandAccessLevelDataRole}
              //   value={data.role_id}
              onChange={(radioValue) =>
                setData((prevState) => ({ ...prevState, role_id: radioValue.value as string }))
              }
            />
          </FormGroup>
          <CustomButton buttonClass={styles.actionBtn} size="small" onClick={() => {}}>
            Save
          </CustomButton>
        </div>
      </div>

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

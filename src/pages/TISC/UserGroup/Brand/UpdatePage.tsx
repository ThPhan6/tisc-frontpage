import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/info-icon.svg';
import { CustomRadio } from '@/components/CustomRadio';
import { FormGroup } from '@/components/Form';
import { MenuSummary } from '@/components/MenuSummary';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import { BodyText, MainTitle } from '@/components/Typography';
import { PATH } from '@/constants/path';
import { dataMenuSummary } from '@/constants/util';
import { pushTo } from '@/helper/history';
import { PageContainer } from '@ant-design/pro-layout';
import { FC, useState } from 'react';
import { BrandAccessLevelDataRole } from '../../Adminstration/TeamProfiles/constants/role';
import BrandLocationDetail from './components/Location';
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
    <PageContainer
      pageHeaderRender={() => (
        <MenuSummary
          containerClass={styles.customMenuSummary}
          menuSummaryData={dataMenuSummary.leftData}
          typeMenu="brand"
        />
      )}
    >
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
          <MainTitle level={4}>Status:</MainTitle>
          <FormGroup
            // label={<MainTitle level={4}>Status</MainTitle>}
            label={''}
            iconTooltip={<InfoIcon />}
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
          <div></div>
        </div>
      </div>

      {/* <BrandViewDetail
        onCancel={handleCancel}
        // onSubmit={handleCreateData}
        submitButtonStatus={submitButtonStatus.value}
        activeTab={activeTab}
      /> */}

      {/* location */}
      <CustomTabPane active={selectedTab === BrandTabKeys.locations}>
        <BrandLocationDetail />
      </CustomTabPane>

      {/* team */}
      <CustomTabPane active={selectedTab === BrandTabKeys.teams}>
        <BrandTeamDetail />
      </CustomTabPane>
    </PageContainer>
  );
};

export default UpdateCreatePage;

import { TableHeader } from '@/components/Table/TableHeader';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/info-icon.svg';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import styles from '../styles/index.less';
import { CustomTabs } from '@/components/Tabs';
import { BrandTabKeys, BrandTabs } from '../types';
import { FC, useEffect, useState } from 'react';
import { FormGroup } from '@/components/Form';
import { BodyText } from '@/components/Typography';
import { CustomRadio } from '@/components/CustomRadio';
import CustomButton from '@/components/Button';
import { getBrandById, getBrandStatuses } from '@/services';
import { BrandDetail, BrandStatuses } from '@/types';
import { useParams } from 'umi';

interface BrandDetailHeaderProps {
  selectedTab: BrandTabKeys;
  setSelectedTab: (selectedTab: BrandTabKeys) => void;
}

const BrandDetailHeader: FC<BrandDetailHeaderProps> = ({ selectedTab, setSelectedTab }) => {
  const params = useParams<{ id: string }>();
  const brandId = params?.id || '';
  const [statuses, setStatuses] = useState<BrandStatuses[]>([]);
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

  const onSubmit = () => {};

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
              options={statuses?.map((status) => ({
                label: status.key,
                value: status.value,
              }))}
              value={data.status}
              onChange={(radioValue) =>
                setData((prevState) => ({ ...prevState, status: radioValue.value as number }))
              }
            />
          </FormGroup>
          <CustomButton buttonClass={styles.actionBtn} size="small" onClick={onSubmit}>
            Save
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default BrandDetailHeader;

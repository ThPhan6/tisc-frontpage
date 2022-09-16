import { FC } from 'react';

import { Tooltip } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/info-icon.svg';

import { BrandDesignProfile, TabKeys } from '../types';
import { TabItem } from '@/components/Tabs/types';
import { KeyValueData } from '@/types';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { CustomRadio } from '@/components/CustomRadio';
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabs } from '@/components/Tabs';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from '../styles/brand.less';

interface TabDetailProps {
  selectedTab: TabKeys;
  setSelectedTab: (selectedTab: TabKeys) => void;
  listTab: TabItem[];
  handleGoBackToTable: () => void;
  handleSaveButton: () => void;
  data: BrandDesignProfile;
  setData: (data: BrandDesignProfile) => void;
  buttonStatus: boolean;
  isLoading: boolean;
  statuses: KeyValueData[];
  toolTipTitle: string | React.ReactNode;
}

const TabDetail: FC<TabDetailProps> = ({
  selectedTab,
  setSelectedTab,
  handleGoBackToTable,
  handleSaveButton,
  data,
  setData,
  buttonStatus,
  statuses,
  isLoading,
  toolTipTitle,
  listTab,
}) => {
  return (
    <div>
      <TableHeader
        title={data.name}
        rightAction={<CloseIcon onClick={handleGoBackToTable} style={{ cursor: 'pointer' }} />}
      />
      <div className={styles.menuTab}>
        <div className={styles.tabs}>
          <CustomTabs
            listTab={listTab}
            widthItem="auto"
            onChange={(changedKey) => setSelectedTab(changedKey as TabKeys)}
            activeKey={String(selectedTab)}
          />
          <div className={styles.basicToolbarForm}>
            <MainTitle level={3}>Status:</MainTitle>
            <Tooltip
              placement="bottom"
              align={{
                offset: [0, -2],
              }}
              title={toolTipTitle}>
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
            <CustomSaveButton onClick={handleSaveButton} isSuccess={buttonStatus} />
          </div>
        </div>
      </div>

      {isLoading ? <LoadingPageCustomize /> : null}
    </div>
  );
};

export default TabDetail;

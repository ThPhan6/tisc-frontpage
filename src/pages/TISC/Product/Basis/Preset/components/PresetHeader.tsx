import { FC } from 'react';

import { PATH } from '@/constants/path';
import { useHistory } from 'umi';

import { useCheckPresetActiveTab } from '../hook';
import { pushTo } from '@/helper/history';

import { TabItem } from '@/components/Tabs/types';

import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { CustomTabs } from '@/components/Tabs';

import styles from './PresetItem.less';

export enum PresetTabKey {
  generalPresets = 'general',
  featurePresets = 'feature',
}

interface PresetHeaderProps {}

export const PresetHeader: FC<PresetHeaderProps> = () => {
  const history = useHistory();

  const { isActiveTab, selectedTab, setSelectedTab } = useCheckPresetActiveTab();

  const listTab: TabItem[] = [
    {
      tab: 'Genernal Presets',
      tabletTabTitle: 'Genernal Presets',
      key: PresetTabKey.generalPresets,
      disable: !isActiveTab,
    },
    {
      tab: 'Feature Presets',
      tabletTabTitle: 'Feature Presets',
      key: PresetTabKey.featurePresets,
      disable: !isActiveTab,
    },
  ];

  const handleChangeTab = (activeKey: string) => {
    location.hash = '#' + activeKey;
    history.push(location);

    setSelectedTab?.(activeKey as PresetTabKey);
  };

  const handlePushTo = () => {
    pushTo(`${PATH.createPresets}#${selectedTab}`);

    /* can using like this */
    // location.hash = '#' + selectedTab;
    // history.push(location);
    // pushTo(`${PATH.createPresets}`);

    /* don't push to like this when using hash on url.
     * * * When using hashes in URLs, it's important to note that changing only the hash portion of the URL does not trigger a page reload or a navigation event. This means that the browser history remains unchanged, and pressing the back button will not revert the hash changes.

    *** pushTo(`${PATH.createPresets}`);
     */
  };

  return (
    <div>
      <TableHeader title="PRESET" customClass={styles.presetHeader} />

      <CustomTabs
        listTab={listTab}
        centered
        tabPosition="top"
        tabDisplay="start"
        widthItem="auto"
        className={`${styles.presetHeaderTab} ${
          !isActiveTab ? styles.presetHeaderTabDisabled : ''
        }`}
        onChange={handleChangeTab}
        activeKey={selectedTab}
      />

      <CustomPlusButton
        onClick={handlePushTo}
        style={{ position: 'absolute', top: 50, right: 16 }}
        disabled={!isActiveTab}
      />
    </div>
  );
};

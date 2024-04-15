import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { PATH } from '@/constants/path';
import { useHistory, useLocation } from 'umi';

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

export const PresetHeader = forwardRef((props: PresetHeaderProps, ref: any) => {
  const history = useHistory();

  const location = useLocation();

  const isActiveTab = location.pathname === PATH.presets;

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

  const [selectedTab, setSelectedTab] = useState<PresetTabKey>();

  useEffect(() => {
    if (!location?.hash) {
      location.hash = '#' + PresetTabKey.generalPresets;
      history.push(location);

      setSelectedTab(PresetTabKey.generalPresets);
      return;
    }

    setSelectedTab(location.hash.split('#')[1] as PresetTabKey);
  }, [location.hash]);

  useImperativeHandle(ref, () => ({ tab: selectedTab }), [selectedTab]);

  const handleChangeTab = (activeKey: string) => {
    setSelectedTab(activeKey as PresetTabKey);

    location.hash = '#' + activeKey;
    history.push(location);
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
      <TableHeader title="PRESET" />

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

      {/* {activeTab ? (
        <>
          <CustomTabPane active={selectedTab === PresetTabKey.generalPresets} lazyLoad>
            <div>General</div>
          </CustomTabPane>

          <CustomTabPane active={selectedTab === PresetTabKey.featurePresets} lazyLoad>
            <div>Feature</div>
          </CustomTabPane>
        </>
      ) : null} */}
    </div>
  );
});

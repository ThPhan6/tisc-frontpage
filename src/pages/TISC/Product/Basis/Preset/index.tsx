import React from 'react';

import { useCheckPresetActiveTab } from './hook';

import { PresetHeader, PresetTabKey } from './components/PresetHeader';
import { CustomTabPane } from '@/components/Tabs';

import BasisFeaturePresetList from './FeaturePreset';
import BasisGeneralPresetList from './GeneralPreset';

const BasisPresetList: React.FC = () => {
  const { selectedTab } = useCheckPresetActiveTab();

  return (
    <>
      <PresetHeader />

      <CustomTabPane active={selectedTab === PresetTabKey.generalPresets} lazyLoad forceReload>
        <BasisGeneralPresetList />
      </CustomTabPane>

      <CustomTabPane active={selectedTab === PresetTabKey.featurePresets} lazyLoad forceReload>
        <BasisFeaturePresetList />
      </CustomTabPane>
    </>
  );
};

export default BasisPresetList;

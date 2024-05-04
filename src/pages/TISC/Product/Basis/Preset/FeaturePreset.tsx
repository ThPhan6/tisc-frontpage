import React from 'react';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';

import { PresetTabKey } from './components/PresetHeader';
import PresetTable from './components/PresetTable';

interface BasisPresetListProps {}

const BasisFeaturePresetList: React.FC<BasisPresetListProps> = () => {
  useAutoExpandNestedTableColumn(3, [6]);

  return <PresetTable type={PresetTabKey.featurePresets} />;
};

export default BasisFeaturePresetList;

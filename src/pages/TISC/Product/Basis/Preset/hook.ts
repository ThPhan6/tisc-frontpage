import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { useHistory, useLocation } from 'umi';

import { PresetTabKey } from './components/PresetHeader';

export const useCheckPresetActiveTab = () => {
  const history = useHistory();
  const location = useLocation();

  const isActiveTab = location.pathname === PATH.presets;

  const [selectedTab, setSelectedTab] = useState<PresetTabKey>();

  useEffect(() => {
    if (!location?.hash) {
      location.hash = '#' + PresetTabKey.generalPresets;
      history.push(location);
    }

    setSelectedTab(location.hash.split('#')[1] as PresetTabKey);
  }, [location.hash]);

  return { isActiveTab, selectedTab, setSelectedTab };
};

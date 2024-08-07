import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { useHistory, useLocation } from 'umi';

import { PartnerTabKey } from '@/pages/Brand/Adminstration/Partners';

export const useCheckPartnerActiveTab = () => {
  const history = useHistory();
  const location = useLocation();

  const isActiveTab = location.pathname === PATH.partners;

  const [selectedTab, setSelectedTab] = useState<PartnerTabKey>();

  const activePath =
    selectedTab === PartnerTabKey.companyParnets
      ? `${PATH.partners}#${PartnerTabKey.companyParnets}`
      : `${PATH.partners}#${PartnerTabKey.contactPartners}`;

  useEffect(() => {
    if (!location?.hash && isActiveTab) {
      location.hash = '#' + PartnerTabKey.companyParnets;
      history.push(location);
    }

    setSelectedTab(location.hash.split('#')[1] as PartnerTabKey);
  }, [location.hash]);

  return { isActiveTab, activePath, selectedTab, setSelectedTab };
};

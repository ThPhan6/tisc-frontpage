import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { PATH } from '@/constants/path';
import { useLocation, useParams } from 'umi';

import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { useAttributeLocation } from '../Attribute/hooks/location';
import { useCheckBranchAttributeTab, useCheckBrandAttributePath } from './hook';
import { pushTo } from '@/helper/history';

import { BrandAttributeParamProps } from './types';
import { TabItem } from '@/components/Tabs/types';

import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { CustomTabs } from '@/components/Tabs';

import styles from './Branch.less';

export enum BranchTabKey {
  component = 'component',
  general = 'general',
  feature = 'feature',
  specification = 'specification',
}

interface PresetHeaderProps {}

export const BranchHeader = forwardRef((props: PresetHeaderProps, ref: any) => {
  const location = useLocation();

  const param = useParams<BrandAttributeParamProps>();

  const { activePath, attributeLocation } = useAttributeLocation();

  const activeTab = useCheckBranchAttributeTab();

  const {
    componentPath,
    componentCreatePath,
    featureAttributePath,
    generalAttributePath,
    specificationAttributePath,
  } = useCheckBrandAttributePath();

  const [selectedTab, setSelectedTab] = useState<BranchTabKey>();

  const listTab: TabItem[] = [
    {
      tab: 'Component',
      tabletTabTitle: 'Component',
      key: BranchTabKey.component,
      disable: !activeTab,
    },
    {
      tab: 'Genernal Attribute',
      tabletTabTitle: 'Genernal Attribute',
      key: BranchTabKey.general,
      disable: !activeTab,
    },
    {
      tab: 'Feature Attribute',
      tabletTabTitle: 'Feature Attribute',
      key: BranchTabKey.feature,
      disable: !activeTab,
    },
    {
      tab: 'Specification',
      tabletTabTitle: 'Specification',
      key: BranchTabKey.specification,
      disable: !activeTab,
    },
  ];

  useEffect(() => {
    if (location.pathname === componentPath) {
      setSelectedTab(BranchTabKey.component);
      return;
    }

    if (location.pathname === generalAttributePath) {
      setSelectedTab(BranchTabKey.general);
      return;
    }

    if (location.pathname === featureAttributePath) {
      setSelectedTab(BranchTabKey.feature);
      return;
    }

    if (location.pathname === specificationAttributePath) {
      setSelectedTab(BranchTabKey.specification);
      return;
    }
  }, [location.pathname]);

  useImperativeHandle(ref, () => ({ tab: selectedTab }), [selectedTab]);

  const handleChangePath = (activeKey: BranchTabKey) => {
    if (activeKey === BranchTabKey.component) {
      pushTo(componentPath);

      return;
    }

    if (activeKey === BranchTabKey.general) {
      pushTo(generalAttributePath);

      return;
    }

    if (activeKey === BranchTabKey.feature) {
      pushTo(featureAttributePath);

      return;
    }

    if (activeKey === BranchTabKey.specification) {
      pushTo(specificationAttributePath);

      return;
    }
  };

  const handleChangeTab = (activeKey: string) => {
    handleChangePath(activeKey as BranchTabKey);

    setSelectedTab(activeKey as BranchTabKey);
  };

  const handlePushTo = () => {
    if (selectedTab === BranchTabKey.component) {
      pushTo(componentCreatePath);
      return;
    }

    pushTo(`${activePath}/create`);
  };

  const handleBack = () => {
    if (!activeTab) {
      return;
    }

    pushTo(PATH.attribute);
  };

  return (
    <div>
      <TableHeader
        title={param.brandName}
        customClass={styles.branchHeader}
        rightAction={
          <CloseIcon
            onClick={handleBack}
            color={activeTab ? '#000' : '#808080'}
            cursor={activeTab ? 'pointer' : 'default'}
          />
        }
      />

      <CustomTabs
        listTab={listTab}
        centered
        tabPosition="top"
        tabDisplay="start"
        widthItem="auto"
        className={`${styles.branchHeaderTab} ${!activeTab ? styles.branchHeaderTabDisabled : ''}`}
        onChange={handleChangeTab}
        activeKey={selectedTab}
      />

      <CustomPlusButton
        onClick={handlePushTo}
        style={{ position: 'absolute', top: 50, right: 16 }}
        disabled={!activeTab}
      />
    </div>
  );
});

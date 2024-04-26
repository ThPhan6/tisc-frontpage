import { CSSProperties, forwardRef, useImperativeHandle } from 'react';

import { PATH } from '@/constants/path';
import { message } from 'antd';
import { useParams } from 'umi';

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

interface PresetHeaderProps {
  containerStyle?: CSSProperties;
  groupId?: string;
  groupName?: string;
}

export const BranchHeader = forwardRef((props: PresetHeaderProps, ref: any) => {
  const { containerStyle, groupId, groupName } = props;

  const param = useParams<BrandAttributeParamProps>();

  const { activePath } = useAttributeLocation();

  const { activeTab, currentTab } = useCheckBranchAttributeTab();

  const {
    componentPath,
    componentCreatePath,
    generalAttributePath,
    featureAttributePath,
    specificationAttributePath,
  } = useCheckBrandAttributePath();

  const listTab: TabItem[] = [
    {
      tab: 'Components',
      tabletTabTitle: 'Component',
      key: BranchTabKey.component,
      disable: !activeTab,
    },
    {
      tab: 'Genernal Attributes',
      tabletTabTitle: 'Genernal Attribute',
      key: BranchTabKey.general,
      disable: !activeTab,
    },
    {
      tab: 'Feature Attributes',
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

  useImperativeHandle(ref, () => ({ tab: currentTab }), [currentTab]);

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
  };

  const handlePushTo = () => {
    if (currentTab === BranchTabKey.component) {
      if (!groupId || !groupName) {
        message.error('Group not found');
        return;
      }

      pushTo(componentCreatePath.replace(':groupId', groupId).replace(':groupName', groupName));
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
    <div style={containerStyle}>
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
        activeKey={currentTab}
      />

      <CustomPlusButton
        onClick={handlePushTo}
        style={{ position: 'absolute', top: 50, right: 16 }}
        disabled={!activeTab}
      />
    </div>
  );
});

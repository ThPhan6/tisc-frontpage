import React from 'react';

import { ProjectTabKeys } from '../../constants/tab';
import { useAccess, useHistory } from 'umi';

import { ReactComponent as CloseIcon } from '@/assets/icons/action-close-open-icon.svg';

import { TabItem } from '@/components/Tabs/types';
import { ProjectDetailProps } from '@/features/project/types';

//
import { CustomTabs } from '@/components/Tabs';
import { BodyText, Title } from '@/components/Typography';

import styles from '../../styles/project-detail-header.less';

interface ProductDataTitleProps {
  name?: string;
  code?: string;
}

const EmptyProductDataTitle: React.FC = () => {
  return (
    <BodyText level={4} fontFamily="Roboto" customClass={styles.emptyTitle}>
      enter project code & name below
    </BodyText>
  );
};

const ProductDataTitle: React.FC<ProductDataTitleProps> = (props) => {
  const { name = '', code = '' } = props;
  return (
    <div className={styles.productInfoTitle}>
      <BodyText level={4} fontFamily="Roboto" customClass="code-name">
        Code {code}
      </BodyText>
      <Title level={7}>{name}</Title>
    </div>
  );
};

interface ProjectDetailHeaderProps {
  activeKey: ProjectTabKeys;
  onChangeTab: (activeKey: ProjectTabKeys) => void;
  project?: ProjectDetailProps;
  activeOnlyGeneral?: boolean;
}

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({
  activeKey,
  onChangeTab,
  project,
  activeOnlyGeneral,
}) => {
  const accessPermission = useAccess();
  const history = useHistory();

  const ProjectTabs: TabItem[] = [
    {
      tab: 'basic information',
      key: ProjectTabKeys.basicInformation,
      disable: !accessPermission.design_project_basic_information,
    },
    {
      tab: 'zones/areas/rooms',
      key: ProjectTabKeys.zoneAreaRoom,
      disable: !accessPermission.design_project_zone_area_zoom,
    },
    {
      tab: 'product considered',
      key: ProjectTabKeys.productConsidered,
      disable: !accessPermission.design_project_product_considered,
    },
    {
      tab: 'product specified',
      key: ProjectTabKeys.productSpecified,
      disable: !accessPermission.design_project_product_specified,
    },
  ];

  const listTab = activeOnlyGeneral
    ? ProjectTabs.map((el) => ({
        ...el,
        disable: el.key === ProjectTabKeys.basicInformation ? undefined : true,
      }))
    : ProjectTabs;

  return (
    <div className={styles.projectDetaiHeaderWrapper}>
      <div className={styles.projectDetailTitle}>
        {project ? (
          <ProductDataTitle name={project.name} code={project.code} />
        ) : (
          <EmptyProductDataTitle />
        )}

        <CloseIcon onClick={history.goBack} />
      </div>
      <CustomTabs
        listTab={listTab}
        centered={true}
        tabPosition="top"
        tabDisplay="space"
        className={styles.projectTabInfo}
        onChange={(changedKey) => onChangeTab(changedKey as ProjectTabKeys)}
        activeKey={activeKey}
      />
    </div>
  );
};
export default ProjectDetailHeader;

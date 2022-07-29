import React from 'react';
import { BodyText, Title } from '@/components/Typography';
import { ReactComponent as CloseIcon } from '@/assets/icons/action-close-open-icon.svg';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { ProjectTabKeys, ProjectTabs } from '../../constants/tab';
//
import { CustomTabs } from '@/components/Tabs';
import { ProjectDetailProps } from '@/types';

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
}

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({
  activeKey,
  onChangeTab,
  project,
}) => {
  const goBackToProjectList = () => {
    pushTo(PATH.designerProject);
  };

  return (
    <div className={styles.projectDetaiHeaderWrapper}>
      <div className={styles.projectDetailTitle}>
        {project ? (
          <ProductDataTitle name={project.name} code={project.code} />
        ) : (
          <EmptyProductDataTitle />
        )}

        <CloseIcon onClick={goBackToProjectList} />
      </div>
      <CustomTabs
        listTab={ProjectTabs}
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

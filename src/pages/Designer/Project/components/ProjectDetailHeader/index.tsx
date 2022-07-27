import React, { useState } from 'react';
import { BodyText, Title } from '@/components/Typography';
import { ReactComponent as CloseIcon } from '@/assets/icons/action-close-open-icon.svg';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { ProjectTabKeys, ProjectTabs, ProjectTabValue } from '../../constants/tab';
//
import { CustomTabs } from '@/components/Tabs';
//

import styles from '../../styles/project-detail-header.less';

interface ProductDataTitleProps {
  name?: string;
  code?: string;
}

// const EmptyProductDataTitle: React.FC = () => {
//   return (
//     <BodyText level={4} fontFamily="Roboto" customClass={styles.emptyTitle}>
//       enter project code & name below
//     </BodyText>
//   );
// }

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

const ProjectDetailHeader: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<ProjectTabValue>(ProjectTabKeys.basicInformation);

  const goBackToProjectList = () => {
    pushTo(PATH.designerProject);
  };

  return (
    <div className={styles.projectDetaiHeaderWrapper}>
      <div className={styles.projectDetailTitle}>
        <ProductDataTitle name="Project Enable" code="0000" />
        <CloseIcon onClick={goBackToProjectList} />
      </div>
      <CustomTabs
        listTab={ProjectTabs}
        centered={true}
        tabPosition="top"
        tabDisplay="space"
        className={styles.projectTabInfo}
        onChange={(changedKey) => setSelectedTab(changedKey as ProjectTabValue)}
        activeKey={selectedTab}
      />
    </div>
  );
};
export default ProjectDetailHeader;

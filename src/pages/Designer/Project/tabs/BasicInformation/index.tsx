import React, { useEffect, useState } from 'react';

import { ProjectStatuses } from '../../constants/filter';
import { DefaultProjectRequest } from '../../constants/form';
import { PATH } from '@/constants/path';
import { Col, Row } from 'antd';
import { useHistory } from 'umi';

import { createProject, updateProject } from '@/features/project/services';
import { useScreen } from '@/helper/common';
import { useBoolean } from '@/helper/hook';

import type { ProjectBodyRequest, ProjectDetailProps } from '@/features/project/types';

import ProjectTabContentHeader from '../../components/ProjectTabContentHeader';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { CustomRadio } from '@/components/CustomRadio';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from '../../styles/basic-information.less';
import { EntryForm } from './EntryForm';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

interface GeneralInformationProps {
  project?: ProjectDetailProps;
  setProject?: (project: ProjectDetailProps) => void;
}

const GeneralInformation: React.FC<GeneralInformationProps> = ({ project, setProject }) => {
  const isMobile = useScreen().isMobile;

  const [data, setData] = useState<ProjectBodyRequest>(DefaultProjectRequest);
  const buttonStatus = useBoolean();
  const [projectId, setProjectId] = useState<string>();
  const history = useHistory();

  const handleSubmitForm = () => {
    showPageLoading();
    if (projectId) {
      /// update project
      updateProject(projectId, data).then((isSuccess) => {
        hidePageLoading();
        if (isSuccess) {
          buttonStatus.setValue(true);
          setTimeout(() => {
            buttonStatus.setValue(false);
          }, 1000);
          if (setProject && project) {
            setProject({
              ...project,
              ...data,
            });
          }
        }
      });
    } else {
      /// create
      createProject(data).then((newProjectId) => {
        hidePageLoading();
        if (newProjectId) {
          buttonStatus.setValue(true);
          setTimeout(() => {
            history.replace(PATH.designerUpdateProject.replace(':id', newProjectId));
          }, 1000);
        }
      });
    }
  };

  const onChangeData = (newData: Partial<ProjectBodyRequest>) => {
    setData((prevState) => ({
      ...prevState,
      ...newData,
    }));
  };

  useEffect(() => {
    if (project) {
      setProjectId(project.id);
      setData(project);
    }
  }, [project]);

  return (
    <>
      <ProjectTabContentHeader>
        <div className={styles.basicToolbarForm}>
          {isMobile ? null : <MainTitle level={3}>Project Status:</MainTitle>}
          <CustomRadio
            options={ProjectStatuses.map((projectStatus) => {
              return {
                label: (
                  <BodyText level={6} fontFamily="Roboto" customClass={styles.projectStatusLabel}>
                    {isMobile ? '' : projectStatus.name} {projectStatus.icon}
                  </BodyText>
                ),
                value: projectStatus.id,
              };
            })}
            value={data.status}
            onChange={(selectedValue) =>
              setData({
                ...data,
                status: selectedValue.value as number,
              })
            }
            containerClass={styles.projectStatusRadio}
          />

          <CustomSaveButton onClick={handleSubmitForm} isSuccess={buttonStatus.value} />
        </div>
      </ProjectTabContentHeader>

      <Row className={styles.basicInformationWrapper}>
        <Col span={isMobile ? 24 : 12}>
          <EntryForm data={data} onChangeData={onChangeData} />
        </Col>
      </Row>
    </>
  );
};

export default GeneralInformation;

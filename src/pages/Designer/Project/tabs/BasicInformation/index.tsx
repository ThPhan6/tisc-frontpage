import React, { useEffect, useState } from 'react';

import { ProjectStatuses } from '../../constants/filter';
import { DefaultProjectRequest } from '../../constants/form';
import { PATH } from '@/constants/path';
import { Row, message } from 'antd';
import { useHistory } from 'umi';

import { createProject, updateProject } from '@/features/project/services';
import { useScreen } from '@/helper/common';
import { useBoolean } from '@/helper/hook';

import type { ProjectBodyRequest, ProjectDetailProps } from '@/features/project/types';

import ProjectTabContentHeader from '../../components/ProjectTabContentHeader';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { CustomRadio } from '@/components/CustomRadio';
import { ResponsiveCol } from '@/components/Layout';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from '../../styles/basic-information.less';
import { EntryForm } from './EntryForm';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

interface GeneralInformationProps {
  project?: ProjectDetailProps;
  setProject?: (project: ProjectDetailProps) => void;
}

const GeneralInformation: React.FC<GeneralInformationProps> = ({ project, setProject }) => {
  const isTablet = useScreen().isTablet;

  const [data, setData] = useState<ProjectBodyRequest>(DefaultProjectRequest);
  const buttonStatus = useBoolean();
  const [projectId, setProjectId] = useState<string>();
  const history = useHistory();

  const handleSubmitForm = () => {
    showPageLoading();
    if (data.construction_start <= data.design_due) {
      hidePageLoading();
      return message.error('Construction Start date should be after the Design Due');
    }
    if (projectId) {
      /// update project
      updateProject(projectId, data).then((isSuccess) => {
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
          {isTablet ? null : <MainTitle level={3}>Project Status:</MainTitle>}
          <CustomRadio
            options={ProjectStatuses.map((projectStatus) => {
              return {
                label: (
                  <BodyText level={6} fontFamily="Roboto" customClass={styles.projectStatusLabel}>
                    {isTablet ? '' : projectStatus.name} {projectStatus.icon}
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
        <ResponsiveCol>
          <EntryForm data={data} onChangeData={onChangeData} />
        </ResponsiveCol>
      </Row>
    </>
  );
};

export default GeneralInformation;

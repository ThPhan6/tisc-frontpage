import React, { useState, useEffect } from 'react';
import ProjectTabContentHeader from '../../components/ProjectTabContentHeader';
import EntryForm from './EntryForm';
import { DefaultProjectRequest } from '../../constants/form';
import { Row, Col } from 'antd';
import type { ProjectBodyRequest, ProjectDetailProps } from '@/types';
import { createProject, updateProject } from '@/services';
import { useBoolean } from '@/helper/hook';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { ProjectStatuses } from '../../constants/filter';
import { CustomRadio } from '@/components/CustomRadio';
import { MainTitle, BodyText } from '@/components/Typography';
import LoadingPageCustomize from '@/components/LoadingPage';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import styles from '../../styles/basic-information.less';

interface GeneralInformationProps {
  project?: ProjectDetailProps;
}

const GeneralInformation: React.FC<GeneralInformationProps> = ({ project }) => {
  const [data, setData] = useState<ProjectBodyRequest>(DefaultProjectRequest);
  const buttonStatus = useBoolean();
  const isLoading = useBoolean();
  const [projectId, setProjectId] = useState<string>();
  const handleDoneButton = () => {
    isLoading.setValue(true);
    if (projectId) {
      /// update project
      updateProject(projectId, data).then((isSuccess) => {
        isLoading.setValue(false);
        if (isSuccess) {
          buttonStatus.setValue(true);
          setTimeout(() => {
            buttonStatus.setValue(false);
          }, 1000);
        }
      });
    } else {
      /// create
      createProject(data).then((isSuccess) => {
        isLoading.setValue(false);
        if (isSuccess) {
          buttonStatus.setValue(true);
          setTimeout(() => {
            pushTo(PATH.designerProject);
          }, 1000);
        }
      });
    }
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
          <MainTitle level={3}>Project Status:</MainTitle>
          <CustomRadio
            options={ProjectStatuses.map((projectStatus) => {
              return {
                label: (
                  <BodyText level={6} fontFamily="Roboto" customClass={styles.projectStatusLabel}>
                    {projectStatus.name} {projectStatus.icon}
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
          />
          <CustomSaveButton onClick={handleDoneButton} isSuccess={buttonStatus.value}>
            Done
          </CustomSaveButton>
        </div>
      </ProjectTabContentHeader>
      <Row className={styles.basicInformationWrapper}>
        <Col span={12}>
          <EntryForm data={data} setData={setData} />
        </Col>
      </Row>
      {isLoading.value && <LoadingPageCustomize />}
    </>
  );
};

export default GeneralInformation;

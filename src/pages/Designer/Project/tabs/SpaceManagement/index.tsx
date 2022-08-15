import React, { useState } from 'react';
import ProjectTabContentHeader from '../../components/ProjectTabContentHeader';
import SpaceList from './SpaceList';
import SpaceEntryForm from './SpaceEntryForm';
import { MainTitle } from '@/components/Typography';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { DefaultProjectZone } from '../../constants/form';
import { useBoolean } from '@/helper/hook';
import LoadingPageCustomize from '@/components/LoadingPage';
import { createProjectSpace, updateProjectSpace } from '@/features/project/services';
import type { ProjectSpaceZone } from '@/features/project/types';
import styles from '../../styles/space-management.less';

interface SpaceManagementProps {
  projectId?: string;
}

const SpaceManagement: React.FC<SpaceManagementProps> = ({ projectId }) => {
  const [space, setSpace] = useState<ProjectSpaceZone>();
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean();
  const displaySpaceForm = (spaceData: ProjectSpaceZone = DefaultProjectZone) => {
    setSpace(spaceData);
  };

  const hideSpaceForm = () => {
    setSpace(undefined);
  };

  const handleSubmitSpaceForm = () => {
    if (!space) {
      return false;
    }
    isLoading.setValue(true);
    space.project_id = projectId;
    if (space.id) {
      return updateProjectSpace(space.id, space).then((data) => {
        isLoading.setValue(false);
        if (data) {
          setSpace(data);
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            submitButtonStatus.setValue(false);
          }, 1000);
        }
      });
    }
    return createProjectSpace(space).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
          hideSpaceForm();
        }, 1000);
      }
    });
  };

  return (
    <>
      <ProjectTabContentHeader>
        <div
          className={`${styles.createSpaceButton} ${space ? 'disabled' : ''}`}
          onClick={() => displaySpaceForm()}
        >
          <MainTitle level={3} customClass="button-name">
            {' '}
            Create Space{' '}
          </MainTitle>
          <CustomPlusButton size={18} disabled={space !== undefined} />
        </div>
      </ProjectTabContentHeader>
      {space ? (
        <SpaceEntryForm
          data={space}
          setData={setSpace}
          handleCancel={hideSpaceForm}
          handleSubmit={handleSubmitSpaceForm}
          submitButtonStatus={submitButtonStatus.value}
        />
      ) : projectId ? (
        <SpaceList handleUpdateSpace={(record) => displaySpaceForm(record)} projectId={projectId} />
      ) : null}
      {isLoading.value && <LoadingPageCustomize />}
    </>
  );
};

export default SpaceManagement;

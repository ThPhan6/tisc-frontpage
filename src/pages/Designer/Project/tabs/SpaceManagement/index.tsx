import React, { useState } from 'react';

import { DefaultProjectZone } from '../../constants/form';

import { createProjectSpace, updateProjectSpace } from '@/features/project/services';
import { useBoolean } from '@/helper/hook';

import type { ProjectSpaceZone } from '@/features/project/types';

import ProjectTabContentHeader from '../../components/ProjectTabContentHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { MainTitle } from '@/components/Typography';

import styles from '../../styles/space-management.less';
import SpaceEntryForm from './SpaceEntryForm';
import SpaceList from './SpaceList';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

interface SpaceManagementProps {
  projectId?: string;
}

const SpaceManagement: React.FC<SpaceManagementProps> = ({ projectId }) => {
  const [space, setSpace] = useState<ProjectSpaceZone>();
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
    showPageLoading();
    space.project_id = projectId;
    if (space.id) {
      return updateProjectSpace(space.id, space).then((data) => {
        hidePageLoading();
        if (data) {
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            submitButtonStatus.setValue(false);
          }, 1000);
        }
      });
    }
    return createProjectSpace(space).then((isSuccess) => {
      hidePageLoading();
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
          hideSpaceForm();
        }, 1000);
      }
    });
  };

  const renderSpaceContent = () => {
    if (space) {
      return (
        <SpaceEntryForm
          data={space}
          setData={setSpace}
          handleCancel={hideSpaceForm}
          handleSubmit={handleSubmitSpaceForm}
          submitButtonStatus={submitButtonStatus.value}
        />
      );
    }
    return projectId ? (
      <SpaceList handleUpdateSpace={(record) => displaySpaceForm(record)} projectId={projectId} />
    ) : null;
  };

  return (
    <>
      <ProjectTabContentHeader>
        <div
          className={`${styles.createSpaceButton} ${space ? 'disabled' : ''}`}
          onClick={() => (space ? undefined : displaySpaceForm())}
        >
          <MainTitle level={3} customClass="button-name">
            Create Space
          </MainTitle>
          <CustomPlusButton size={18} disabled={space !== undefined} />
        </div>
      </ProjectTabContentHeader>
      {renderSpaceContent()}
    </>
  );
};

export default SpaceManagement;

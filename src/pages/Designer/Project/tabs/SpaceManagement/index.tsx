import React, { useState } from 'react';
import ProjectTabContentHeader from '../../components/ProjectTabContentHeader';
import SpaceList from './SpaceList';
import SpaceEntryForm from './SpaceEntryForm';
import { MainTitle } from '@/components/Typography';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { DefaultProjectZone } from '../../constants/form';
import { useBoolean } from '@/helper/hook';
import LoadingPageCustomize from '@/components/LoadingPage';

import type { ProjectSpaceZone } from '@/types';
import styles from '../../styles/space-management.less';

const SpaceManagement: React.FC = () => {
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
    console.log('space', space);
    isLoading.setValue(true);
    submitButtonStatus.setValue(true);
    setTimeout(() => {
      submitButtonStatus.setValue(false);
      isLoading.setValue(false);
      hideSpaceForm();
    }, 1000);
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
      ) : (
        <SpaceList handleUpdateSpace={(record) => displaySpaceForm(record)} />
      )}
      {isLoading.value && <LoadingPageCustomize />}
    </>
  );
};

export default SpaceManagement;

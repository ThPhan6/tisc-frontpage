import { useState } from 'react';

import { PATH } from '@/constants/path';
import { DEFAULT_TEAMPROFILE } from '@/features/team-profiles/constants/entryForm';
import { BrandAccessLevelDataRole } from '@/features/team-profiles/constants/role';

import { createTeamProfile, inviteUser } from '@/features/team-profiles/services/api';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';

import { TeamProfileDetailProps, TeamProfileRequestBody } from '@/types';

import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TeamProfilesEntryForm } from '@/features/team-profiles/components/TeamProfilesEntryForm';

const CreateTeamProfilesPage = () => {
  const submitButtonStatus = useBoolean(false);
  const isLoading = useBoolean(false);
  // for entry form
  const [data, setData] = useState<TeamProfileDetailProps>(DEFAULT_TEAMPROFILE);

  const handleCancel = () => {
    pushTo(PATH.brandTeamProfile);
  };

  const handleCreateData = (
    submitData: TeamProfileRequestBody,
    callBack?: (userId: string) => void,
  ) => {
    isLoading.setValue(true);
    createTeamProfile(submitData).then((teamProfile) => {
      isLoading.setValue(false);
      if (teamProfile) {
        submitButtonStatus.setValue(true);
        if (callBack) {
          callBack(teamProfile.id ?? '');
        } else {
          pushTo(PATH.brandTeamProfile);
        }
      }
    });
  };

  const handleInvite = (userId: string) => {
    inviteUser(userId);
    pushTo(PATH.brandTeamProfile);
  };

  return (
    <div>
      <TableHeader title="TEAM PROFILES" rightAction={<CustomPlusButton disabled />} />
      <TeamProfilesEntryForm
        data={data}
        setData={setData}
        onCancel={handleCancel}
        onSubmit={handleCreateData}
        handleInvite={handleInvite}
        submitButtonStatus={submitButtonStatus.value}
        AccessLevelDataRole={BrandAccessLevelDataRole}
        role="BRAND"
      />
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default CreateTeamProfilesPage;

import { useEffect, useState } from 'react';

import { BrandAccessLevelDataRole } from './constants/role';
import { DEFAULT_TEAMPROFILE } from '@/components/TeamProfile/constants/entryForm';
import { PATH } from '@/constants/path';
import { useParams } from 'umi';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { getOneTeamProfile, inviteUser, updateTeamProfile } from '@/services';

import { TeamProfileDetailProps, TeamProfileRequestBody } from '@/types';

import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TeamProfilesEntryForm } from '@/components/TeamProfile/components/TeamProfilesEntryForm';

const UpdateTeamProfilesPage = () => {
  const submitButtonStatus = useBoolean(false);
  const isLoading = useBoolean(false);
  const [loadedData, setLoadedData] = useState(false);
  const params = useParams<{
    id: string;
  }>();
  const userId = params?.id || '';

  // for entry form
  const [data, setData] = useState<TeamProfileDetailProps>(DEFAULT_TEAMPROFILE);

  const handleCancel = () => {
    pushTo(PATH.brandTeamProfile);
  };

  const handleUpdateData = (submitData: TeamProfileRequestBody) => {
    isLoading.setValue(true);
    updateTeamProfile(userId, submitData).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 1000);
      }
    });
  };

  useEffect(() => {
    getOneTeamProfile(userId).then((res) => {
      if (res) {
        setData(res);
        setLoadedData(true);
      }
    });
  }, []);

  if (!loadedData) {
    return null;
  }

  const handleInvite = () => {
    inviteUser(userId);
  };

  return (
    <div>
      <TableHeader title="TEAM PROFILES" rightAction={<CustomPlusButton disabled />} />
      <TeamProfilesEntryForm
        data={data}
        setData={setData}
        userId={userId}
        onCancel={handleCancel}
        onSubmit={handleUpdateData}
        submitButtonStatus={submitButtonStatus.value}
        handleInvite={handleInvite}
        AccessLevelDataRole={BrandAccessLevelDataRole}
        role="BRAND"
      />
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default UpdateTeamProfilesPage;

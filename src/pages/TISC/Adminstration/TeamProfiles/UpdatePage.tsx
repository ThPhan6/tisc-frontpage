import LoadingPageCustomize from '@/components/LoadingPage';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TableHeader } from '@/components/Table/TableHeader';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { getDepartmentList, getOneTeamProfile, updateTeamProfile } from '@/services';
import { IDepartmentForm, ITeamProfilesProps, TeamProfilesSubmitData } from '@/types';
import { useEffect, useState } from 'react';
import { useParams } from 'umi';
import { TeamProfilesEntryForm } from './components/TeamProfilesEntryForm';

const DEFAULT_TEAMPROFILE = {
  firstname: '',
  lastname: '',
  position: '',
  email: '',
  location: { value: '', label: '' },
  gender: { value: '', label: '' },
  department: { value: '', label: '' },
  access_level: { value: '', label: '' },
  phone: { zoneCode: '', phoneNumber: '' },
  mobile: { zoneCode: '', phoneNumber: '' },
  status: false,
};

const UpdateTeamProfilesPage = () => {
  const submitButtonStatus = useBoolean(false);
  const isLoading = useBoolean(false);
  const params = useParams<{ id: string }>();
  const teamProfileId = params?.id || '';

  // for entry form
  const [entryFormValue, setEntryFormValue] = useState<ITeamProfilesProps>(DEFAULT_TEAMPROFILE);
  /// for department
  const [departmentList, setDepartmentList] = useState<IDepartmentForm[]>([]);

  const handleCancel = () => {
    pushTo(PATH.teamProfile);
  };

  const handleUpdateData = (data: TeamProfilesSubmitData) => {
    updateTeamProfile(teamProfileId, data).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(PATH.teamProfile);
        }, 1000);
      }
    });
  };

  /// get department list
  useEffect(() => {
    getDepartmentList().then((isSuccess) => {
      if (isSuccess) {
        setDepartmentList(isSuccess);
      }
    });
  }, []);

  /// get one team profile
  useEffect(() => {
    getOneTeamProfile(teamProfileId).then((data) => {
      if (data) {
        console.log(data);

        setEntryFormValue({
          firstname: data.firstname,
          lastname: data.lastname,
          position: data.position,
          email: data.email,
          location: { value: data.location_id, label: data.work_location },
          gender: { label: 'Male', value: '1' },
          department: { value: '', label: '' },
          access_level: { label: 'TISC Admin', value: '111' },
          phone: { zoneCode: data.phone_code, phoneNumber: data.phone },
          mobile: { zoneCode: data.phone_code, phoneNumber: data.mobile },
          status: true,
        });
      }
    });
  }, []);

  return (
    <div>
      <TableHeader title="TEAM PROFILES" rightAction={<CustomPlusButton disabled />} />
      <TeamProfilesEntryForm
        value={entryFormValue}
        onChange={setEntryFormValue}
        onCancel={handleCancel}
        onSubmit={handleUpdateData}
        submitButtonStatus={submitButtonStatus.value}
        departmentList={departmentList}
      />
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default UpdateTeamProfilesPage;

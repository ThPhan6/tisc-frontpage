import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TeamProfilesEntryForm } from './components/TeamProfilesEntryForm';
import { useBoolean } from '@/helper/hook';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { createTeamProfile, getDepartmentList } from '@/services';
import { IDepartmentForm, ITeamProfilesProps } from '@/types';
import { useEffect, useState } from 'react';
import LoadingPageCustomize from '@/components/LoadingPage';

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

const CreateTeamProfilesPage = () => {
  const submitButtonStatus = useBoolean(false);
  const isLoading = useBoolean(false);

  // for entry form
  const [entryFormValue, setEntryFormValue] = useState<ITeamProfilesProps>(DEFAULT_TEAMPROFILE);
  /// for department
  const [departmentList, setDepartmentList] = useState<IDepartmentForm[]>([]);

  const handleCancel = () => {
    pushTo(PATH.teamProfile);
  };

  const handleCreateData = () => {
    isLoading.setValue(true);
    createTeamProfile().then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(PATH.teamProfile);
        }, 1000);
      }
    });
  };

  useEffect(() => {
    /// get department list
    getDepartmentList().then((isSuccess) => {
      if (isSuccess) {
        setDepartmentList(isSuccess);
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
        onSubmit={handleCreateData}
        submitButtonStatus={submitButtonStatus.value}
        departmentList={departmentList}
      />
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default CreateTeamProfilesPage;

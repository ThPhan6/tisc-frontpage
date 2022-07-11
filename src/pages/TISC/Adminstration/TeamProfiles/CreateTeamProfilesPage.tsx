import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TeamProfilesEntryForm } from './components/TeamProfilesEntryForm';
import { useState } from 'react';
import { TeamProfilesProps } from '@/types/index';

const DEFAULT_TEAMPROFILEENTRYFORM_VALUE = {
  firstname: '',
  lastname: '',
  position: '',
  email: '',
  location_id: '',
  gender: { value: '', label: '' },
  department: { value: '', label: '' },
  access_level: { value: '', label: '' },
  phone: { zoneCode: '', phoneNumber: '' },
  mobile: { zoneCode: '', phoneNumber: '' },
  status: false,
};

const CreateTeamProfilesPage = () => {
  const [entryFormValue, setEntryFormValue] = useState<TeamProfilesProps>(
    DEFAULT_TEAMPROFILEENTRYFORM_VALUE,
  );

  const handleOnChangeTeamProfilesEntryForm = (newEntryFormValue: TeamProfilesProps) => {
    setEntryFormValue(newEntryFormValue);
  };

  console.log(entryFormValue);

  return (
    <div>
      <TableHeader title="TEAM PROFILES" rightAction={<CustomPlusButton disabled />} />
      <TeamProfilesEntryForm
        value={entryFormValue}
        onChange={handleOnChangeTeamProfilesEntryForm}
      />
    </div>
  );
};

export default CreateTeamProfilesPage;

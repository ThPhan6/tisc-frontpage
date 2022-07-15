import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TeamProfilesEntryForm } from './components/TeamProfilesEntryForm';
// import { useState } from 'react';
// import { TeamProfilesProps } from '@/types/index';

const CreateTeamProfilesPage = () => {
  return (
    <div>
      <TableHeader title="TEAM PROFILES" rightAction={<CustomPlusButton disabled />} />
      <TeamProfilesEntryForm />
    </div>
  );
};

export default CreateTeamProfilesPage;

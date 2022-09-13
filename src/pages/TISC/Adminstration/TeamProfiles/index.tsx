import { PATH } from '@/constants/path';

import TeamProfilesTable from '@/features/team-profiles/components/TeamProfileTable';

const TISCTeamProfile = () => (
  <TeamProfilesTable
    createLink={PATH.tiscCreateTeamProfile}
    updateLink={PATH.tiscUpdateTeamProfile}
  />
);

export default TISCTeamProfile;

import { PATH } from '@/constants/path';

import TeamProfilesTable from '@/features/team-profiles/components/TeamProfileTable';

const BrandTeamProfile = () => (
  <TeamProfilesTable
    createLink={PATH.brandCreateTeamProfile}
    updateLink={PATH.brandUpdateTeamProfile}
  />
);

export default BrandTeamProfile;

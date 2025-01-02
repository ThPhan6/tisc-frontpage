import { PATH } from '@/constants/path';

import { UserType } from '@/pages/LandingPage/types';

export const UserHomePagePaths = {
  [UserType.TISC]: PATH.tiscHomePage,
  [UserType.Brand]: PATH.brandHomePage,
  [UserType.Designer]: PATH.designerHomePage,
  [UserType.Partner]: PATH.partnerProduct,
};

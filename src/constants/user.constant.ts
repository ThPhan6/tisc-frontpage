import { PATH } from '@/constants/path';

export const UserType = {
  tisc: 1,
  brand: 2,
  designer: 3,
};
export const UserHomePagePaths = {
  [UserType.tisc]: PATH.tiscHomePage,
  [UserType.brand]: PATH.brandHomePage,
  [UserType.designer]: PATH.designerHomePage,
};

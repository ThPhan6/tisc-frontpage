import { PATH } from '@/constants/path';
import { USER_ROLE } from '@/constants/userRoles';

export const gotoProductDetailPage = (userRole: any, id?: string) => {
  if (!id) {
    return '';
  }

  if (userRole === USER_ROLE.brand) {
    return PATH.updateProductBrand.replace(':id', id);
  } else if (userRole === USER_ROLE.tisc) {
    return PATH.productConfigurationUpdate.replace(':id', id);
  }
};

import { PATH } from '@/constants/path';
import { USER_ROLE } from '@/constants/userRoles';
// import { pushTo } from '@/helper/history';

export const gotoProductDetailPage = (userRole: any, productId?: string) => {
  if (!productId) {
    return '';
  }

  let path = '';
  switch (userRole) {
    case USER_ROLE.tisc:
      path = PATH.productConfigurationUpdate.replace(':id', productId);
      // path = PATH.productConfigurationUpdate;
      break;
    case USER_ROLE.brand:
      path = PATH.updateProductBrand.replace(':id', productId);
      // path = PATH.updateProductBrand;
      break;
    case USER_ROLE.design:
      path = PATH.designerBrandProductDetail.replace(':id', productId);
      // path = PATH.designerBrandProductDetail;
      break;
  }
  // if (path) {
  //   pushTo(path.replace(':id', productId));
  // }

  return path;
};

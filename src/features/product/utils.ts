import { PATH } from '@/constants/path';
import { USER_ROLE } from '@/constants/userRoles';

export const getProductDetailPathname = (
  userRole: string,
  productId: string,
  signature?: string,
  isCustomProduct?: boolean,
) => {
  if (!productId) {
    return '';
  }

  let path = '';
  switch (userRole) {
    case USER_ROLE.tisc:
      path = PATH.productConfigurationUpdate.replace(':id', productId);
      break;
    case USER_ROLE.brand:
      path = PATH.updateProductBrand.replace(':id', productId);
      break;
    case USER_ROLE.design:
      if (isCustomProduct) {
        path = PATH.designerCustomProductDetail.replace(':id', productId);
      } else {
        path = PATH.designerBrandProductDetail.replace(':id', productId);
      }
      break;
    default:
      const publicPage = PATH.sharedProduct.replace(':id', productId);
      path = `${publicPage}${signature}`;
  }

  return path;
};

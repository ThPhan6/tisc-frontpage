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
      const productConfigurationPage = PATH.productConfigurationUpdate.replace(':id', productId);
      path = `${productConfigurationPage}${signature}`;
      break;
    case USER_ROLE.brand:
      const productPage = PATH.updateProductBrand.replace(':id', productId);
      path = `${productPage}${signature}`;
      break;
    case USER_ROLE.design:
      let productDetail = '';
      if (isCustomProduct) {
        productDetail = PATH.designerCustomProductDetail.replace(':id', productId);
      } else {
        productDetail = PATH.designerBrandProductDetail.replace(':id', productId);
      }
      path = `${productDetail}${signature}`;
      break;
    default:
      const publicPage = PATH.sharedProduct.replace(':id', productId);
      path = `${publicPage}${signature}`;
  }

  return path;
};

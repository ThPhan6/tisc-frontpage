import { FC, memo } from 'react';

import { USER_ROLE } from '@/constants/userRoles';
import { useHistory } from 'umi';

import SampleProductImage from '@/assets/images/sample-product-img.png';

import { useGetUserRoleFromPathname } from '@/helper/hook';
import { getMaxLengthText, showImageUrl } from '@/helper/utils';

import { useAppSelector } from '@/reducers';

import { EmptyOne } from '@/components/Empty';

import { getProductDetailPathname } from '../../utils';

const ProductPlaceHolder = () => {
  return (
    <div className="relative-product-item">
      <div className="relative-product">
        <img src={SampleProductImage} />
        <div className="placeholder-text">Product Label</div>
      </div>
    </div>
  );
};

export const ProductCollection: FC = memo(() => {
  const relatedProduct = useAppSelector((state) => state.product.relatedProduct);
  const userRole = useGetUserRoleFromPathname();

  const signature = useHistory().location.search || '';

  if (relatedProduct.length === 0) {
    return <EmptyOne customClass="product-collection" />;
  }

  const renderRelatedProduct = () => {
    if (relatedProduct.length) {
      return relatedProduct.map((item, key) => (
        <a
          className="relative-product-item"
          key={key}
          target="_blank"
          rel="noreferrer"
          href={getProductDetailPathname(userRole, item.id, signature)}>
          <div className="relative-product">
            <img src={item.images?.[0] ? showImageUrl(item.images[0]) : SampleProductImage} />
            <div className="placeholder-text">
              <span>{getMaxLengthText(item.name, 40)}</span>
            </div>
          </div>
        </a>
      ));
    }

    return userRole === USER_ROLE.tisc ? <ProductPlaceHolder /> : null;
  };

  return (
    <div className="relative-product-wrapper">
      <div className="relative-product-list">{renderRelatedProduct()}</div>
    </div>
  );
});

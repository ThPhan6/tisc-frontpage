import { FC, memo } from 'react';

import { USER_ROLE } from '@/constants/userRoles';

import SampleProductImage from '@/assets/images/sample-product-img.png';

import { useGetUserRoleFromPathname } from '@/helper/hook';
import { getMaxLengthText, getValueByCondition, showImageUrl } from '@/helper/utils';

import { useAppSelector } from '@/reducers';

import { EmptyOne } from '@/components/Empty';

import { getProductDetailPathname } from '../../utils';

export const ProductCollection: FC = memo(() => {
  const relatedProduct = useAppSelector((state) => state.product.relatedProduct);
  const userRole = useGetUserRoleFromPathname();

  if (relatedProduct.length === 0 && userRole !== USER_ROLE.tisc) {
    return <EmptyOne customClass="product-collection" />;
  }

  const renderRelatedProduct = () =>
    getValueByCondition(
      [
        [
          relatedProduct.length,
          relatedProduct.map((item, key) => (
            <a
              className="relative-product-item"
              key={key}
              target="_blank"
              rel="noreferrer"
              href={getProductDetailPathname(userRole, item.id)}>
              <div className="relative-product">
                <img src={item.images?.[0] ? showImageUrl(item.images[0]) : SampleProductImage} />
                <div className="placeholder-text">
                  <span>{getMaxLengthText(item.name, 40)}</span>
                </div>
              </div>
            </a>
          )),
        ],
        [
          userRole === USER_ROLE.tisc,
          /// product placeholder
          <div className="relative-product-item">
            <div className="relative-product">
              <img src={SampleProductImage} />
              <div className="placeholder-text">Product Label</div>
            </div>
          </div>,
        ],
      ],
      null,
    );

  return (
    <div className="relative-product-wrapper">
      <div className="relative-product-list">{renderRelatedProduct()}</div>
    </div>
  );
});

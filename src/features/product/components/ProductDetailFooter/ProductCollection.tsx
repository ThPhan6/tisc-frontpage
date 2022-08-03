import { FC, memo } from 'react';
import SampleProductImage from '@/assets/images/sample-product-img.png';
import { getMaxLengthText, showImageUrl } from '@/helper/utils';
import { useAppSelector } from '@/reducers';
import { useGetUserRoleFromPathname } from '@/helper/hook';
import { getProductDetailPathname } from '../../utils';

export const ProductCollection: FC = memo(() => {
  const relatedProduct = useAppSelector((state) => state.product.relatedProduct);
  const userRole = useGetUserRoleFromPathname();

  return (
    <div className="relative-product-wrapper">
      <div className="relative-product-list">
        {relatedProduct.length > 0 ? (
          relatedProduct.map((item, key) => (
            <a
              className="relative-product-item"
              key={key}
              target="_blank"
              rel="noreferrer"
              href={getProductDetailPathname(userRole, item.id)}
            >
              <div className="relative-product">
                <img src={item.images?.[0] ? showImageUrl(item.images[0]) : SampleProductImage} />
                <div className="placeholder-text">
                  <span>{getMaxLengthText(item.name, 40)}</span>
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="relative-product-item">
            <div className="relative-product">
              <img src={SampleProductImage} />
              <div className="placeholder-text">Product Label</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

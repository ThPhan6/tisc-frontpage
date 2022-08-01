import { gotoProductDetailPage } from './utils';
import SampleProductImage from '@/assets/images/sample-product-img.png';
import { getMaxLengthText, showImageUrl } from '@/helper/utils';
import { FC } from 'react';
import { useAppSelector } from '@/reducers';
import { useGetUserRoleFromPathname } from '@/helper/hook';

export const ProductCollection: FC = () => {
  const { relatedProduct } = useAppSelector((state) => state.product);
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
              href={gotoProductDetailPage(userRole, item.id)}
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
};

import { FC, memo, useState } from 'react';

import { USER_ROLE } from '@/constants/userRoles';
import { useHistory } from 'umi';

import SampleProductImage from '@/assets/images/sample-product-img.png';

import { useGetUserRoleFromPathname } from '@/helper/hook';
import { getMaxLengthText, showImageUrl } from '@/helper/utils';

import { onCheckRelatedProduct } from '../../reducers';
import { RelatedCollection } from '../../types';
import store, { useAppSelector } from '@/reducers';
import { GeneralData } from '@/types';

import CustomButton from '@/components/Button';
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
  const { relatedProduct, details, relatedProductOnView } = useAppSelector(
    (state) => state.product,
  );
  const [relatedProducts, setRelatedProducts] = useState<RelatedCollection[]>([]);

  const userRole = useGetUserRoleFromPathname();

  const signature = `${useHistory().location.search || ''}${'?new_tab=true'}`;

  if (relatedProduct.length === 0) {
    return <EmptyOne customClass="product-collection" />;
  }

  const openCollectionRelatedProduct = (collection: GeneralData) => () => {
    const newRelatedProduct = relatedProduct.filter((el) =>
      el.collection_ids.includes(collection.id),
    );

    setRelatedProducts(newRelatedProduct);

    store.dispatch(
      onCheckRelatedProduct({
        id: collection.id,
        name: collection.name,
        relatedProductData: newRelatedProduct,
      } as any),
    );
  };

  const renderRelatedProduct = () => {
    if (relatedProductOnView?.id && relatedProducts?.length) {
      return (
        <div className="flex-start">
          {relatedProducts.map((item, key) => (
            <a
              key={key}
              className="relative-product-item"
              target="_blank"
              rel="noreferrer"
              href={getProductDetailPathname(userRole, item.id, signature)}
            >
              <div className="relative-product">
                <img src={item.images?.[0] ? showImageUrl(item.images[0]) : SampleProductImage} />
                <div className="placeholder-text">
                  <span>{getMaxLengthText(item.name, 40)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      );
    }

    if (details.collections?.length >= 2) {
      return details.collections.map((el, index) => (
        <CustomButton
          key={index}
          style={{ margin: '0 8px' }}
          onClick={openCollectionRelatedProduct(el)}
        >
          {el.name}
        </CustomButton>
      ));
    }

    if (relatedProduct.length) {
      return relatedProduct.map((item, key) => (
        <a
          className="relative-product-item"
          key={key}
          target="_blank"
          rel="noreferrer"
          href={getProductDetailPathname(userRole, item.id, signature)}
        >
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

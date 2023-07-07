import { FC, memo, useEffect, useState } from 'react';

import { USER_ROLE } from '@/constants/userRoles';
import { useHistory } from 'umi';

import { ReactComponent as ActionLeftIcon } from '@/assets/icons/align-left-icon.svg';
import SampleProductImage from '@/assets/images/sample-product-img.png';

import { useGetUserRoleFromPathname } from '@/helper/hook';
import { getMaxLengthText, showImageUrl } from '@/helper/utils';

import {
  onShowRelatedProductByCollection,
  setProductSummary,
  setRelatedProduct,
} from '../../reducers';
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
  const { relatedProduct /* origin product related data */, details, relatedProductOnView } =
    useAppSelector((state) => state.product);

  const [collectionData, setCollectionData] = useState<GeneralData[]>([]);

  /// show product related by collection
  const [relatedProducts, setRelatedProducts] = useState<RelatedCollection[]>([]);

  const userRole = useGetUserRoleFromPathname();

  const signature = `${useHistory().location.search || ''}${'?new_tab=true'}`;

  useEffect(() => {
    if (details?.collections && relatedProduct?.length) {
      const collectionIds: string[] = [];

      relatedProduct.forEach((el) => {
        el.collection_ids.forEach((item) => {
          collectionIds.push(item);
        });
      });

      const newCollectionIds = collectionIds.filter((el, pos, self) => self.indexOf(el) === pos);

      const newCollectionData = details.collections.filter((el) =>
        newCollectionIds.includes(el.id),
      );

      setCollectionData(newCollectionData);
    }
  }, [relatedProduct]);

  const openCollectionRelatedProduct = (collection: GeneralData) => () => {
    const newRelatedProduct = relatedProduct.filter((el) =>
      el.collection_ids.includes(collection.id),
    );

    setRelatedProducts(newRelatedProduct);

    store.dispatch(
      onShowRelatedProductByCollection({
        id: collection.id,
        name: collection.name,
        relatedProductData: newRelatedProduct,
      } as any),
    );
  };

  const renderRelatedProduct = () => {
    if (relatedProductOnView?.id && relatedProducts?.length) {
      return (
        <div className="flex-start" style={{ marginLeft: 24 }}>
          <div className="flex-start" style={{ background: '#E6E6E6', height: 72 }}>
            <div
              title="Back to collection"
              style={{ marginRight: 24, cursor: 'pointer', width: 20, height: 20 }}
              onClick={(e) => {
                e.stopPropagation();
                store.dispatch(onShowRelatedProductByCollection({} as any));
              }}
            >
              <ActionLeftIcon />
            </div>
          </div>
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

    if (details.collections?.length >= 2 && collectionData.length >= 2) {
      return collectionData.map((el, index) => (
        <CustomButton
          key={index}
          style={{ margin: '0 8px', background: '#fff', color: '#000', borderRadius: 8 }}
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

  if (relatedProduct.length === 0) {
    return <EmptyOne customClass="product-collection" />;
  }

  return (
    <div className="relative-product-wrapper">
      <div className="relative-product-list">{renderRelatedProduct()}</div>
    </div>
  );
});

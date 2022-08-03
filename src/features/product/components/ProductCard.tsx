import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as LikeIcon } from '@/assets/icons/action-like-icon.svg';
import { ReactComponent as LikedIcon } from '@/assets/icons/action-liked-icon.svg';
import { ReactComponent as ShareViaEmailIcon } from '@/assets/icons/ic-share.svg';
import { ReactComponent as TabIcon } from '@/assets/icons/tabs-icon.svg';
// import { ReactComponent as AssignIcon } from '@/assets/icons/ic-assign.svg';
import SampleProductImage from '@/assets/images/sample-product-img.png';
import { BodyText } from '@/components/Typography';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { showImageUrl } from '@/helper/utils';
import { useAppSelector } from '@/reducers';
import {
  deleteProductById,
  duplicateProductById,
  getProductListByBrandId,
  getProductSummary,
  likeProductById,
} from '@/features/product/services';
import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { useCheckPermission, useGetUserRoleFromPathname } from '@/helper/hook';
import styles from './ProductCard.less';
import ShareViaEmail from '@/components/ShareViaEmail';
import { getProductDetailPathname } from '../utils';
import CustomCollapse from '@/components/Collapse';
import { truncate, capitalize } from 'lodash';
import { ProductGetListParameter, ProductItem } from '../types';

interface ProductCardProps {
  product: ProductItem;
  hasBorder?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, hasBorder }) => {
  const filter = useAppSelector((state) => state.product.list.filter);
  const [liked, setLiked] = useState(product.is_liked);

  const [visible, setVisible] = useState<boolean>(false);

  // check user role to redirect
  const userRole = useGetUserRoleFromPathname();
  const hanldeRedirectURL = () => {
    const path = getProductDetailPathname(userRole, product.id!);
    pushTo(path);
  };

  // check user permission to action
  const showShareEmail = useCheckPermission(['Brand Admin', 'Design Admin']);
  const showDuplicateAndDelete = useCheckPermission('TISC Admin');
  // const isDesignerUser = useCheckPermission('Design Admin');

  const reloadProductInformation = () => {
    if (filter && product.brand?.id) {
      getProductSummary(product.brand.id).then(() => {
        const params = {
          brand_id: product.brand?.id,
        } as ProductGetListParameter;
        if (filter.name === 'category_id' && filter.value !== 'all') {
          params.category_id = filter.value;
        }
        if (filter.name === 'collection_id' && filter.value !== 'all') {
          params.collection_id = filter.value;
        }
        getProductListByBrandId(params);
      });
    }
  };

  const handleDeleteProduct = () => {
    if (showDuplicateAndDelete) {
      confirmDelete(() => {
        deleteProductById(product.id ?? '').then((isSuccess) => {
          if (isSuccess && filter && product.brand && product.brand.id) {
            reloadProductInformation();
          }
        });
      });
    }
  };

  const duplicateProduct = () => {
    if (showDuplicateAndDelete) {
      duplicateProductById(product.id ?? '').then((isSuccess) => {
        if (isSuccess) {
          reloadProductInformation();
        }
      });
    }
  };

  const likeProduct = () => {
    likeProductById(product.id ?? '').then((isSuccess) => {
      if (isSuccess) {
        setLiked(!liked);
      }
    });
  };

  const likeCount = (product.favorites ?? 0) + (liked ? 1 : 0);

  return (
    <div className={`${styles.productCardItem} ${hasBorder ? styles.border : ''}`}>
      <div className={styles.imageWrapper} onClick={hanldeRedirectURL}>
        <img src={product.images?.[0] ? showImageUrl(product.images[0]) : SampleProductImage} />
        <div className={styles.imagePlaceholder}>
          <BodyText level={5} fontFamily="Roboto">
            {product.description}
          </BodyText>
        </div>
      </div>
      <div className={styles.productInfo} onClick={hanldeRedirectURL}>
        <BodyText level={6} fontFamily="Roboto" customClass="product-description">
          {product.name}
        </BodyText>
        <BodyText level={7} fontFamily="Roboto" customClass="text-uppercase">
          {product.brand?.name ?? 'N/A'}
        </BodyText>
      </div>
      <div className={styles.productAction}>
        <Tooltip placement="bottom" title="Favourite">
          <BodyText level={6} fontFamily="Roboto" customClass="action-like">
            {liked ? <LikedIcon onClick={likeProduct} /> : <LikeIcon onClick={likeProduct} />}
            {`${likeCount.toLocaleString('en-us')} ${likeCount <= 1 ? 'like' : 'likes'}`}
          </BodyText>
        </Tooltip>

        {/* for role tisc */}
        {showDuplicateAndDelete && (
          <BodyText customClass="action-other">
            <Tooltip placement="bottom" title="Duplicate">
              <TabIcon onClick={duplicateProduct} />
            </Tooltip>
            <Tooltip placement="bottom" title="Delete">
              <DeleteIcon onClick={handleDeleteProduct} />
            </Tooltip>
          </BodyText>
        )}

        {/* {isDesignerUser && <AssignIcon onClick={() => {}} />} */}

        {/* for role brand */}
        {showShareEmail && (
          <div className={styles.shareEmail}>
            <ShareViaEmailIcon className={styles.shareEmailIcon} onClick={() => setVisible(true)} />
            <ShareViaEmail visible={visible} setVisible={setVisible} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

export const CollapseProductList: React.FC = ({}) => {
  const list = useAppSelector((state) => state.product.list);

  // console.log('product', product);
  // if (!product.list.data.length) {
  //   return <EmptyDataMessage message={EMPTY_DATA_MESSAGE.product} />;
  // }

  return (
    <>
      {list.data.map((group, index) => (
        <CustomCollapse
          className={styles.productCardCollapse}
          customHeaderClass={styles.productCardHeaderCollapse}
          key={index}
          header={
            <div className="header-text">
              <BodyText level={5} fontFamily="Roboto">
                {truncate(capitalize(group.name), { length: 40 })}
                <span className="product-count">({group.count})</span>
              </BodyText>
            </div>
          }
        >
          <div className={styles.productCardContainer}>
            {group.products.map((productItem, productKey) => (
              <div className={styles.productCardItemWrapper} key={productKey}>
                <ProductCard product={productItem} />
              </div>
            ))}
          </div>
        </CustomCollapse>
      ))}
    </>
  );
};

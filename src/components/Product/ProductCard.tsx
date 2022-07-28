import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as LikeIcon } from '@/assets/icons/action-like-icon.svg';
import { ReactComponent as LikedIcon } from '@/assets/icons/action-liked-icon.svg';
import { ReactComponent as ShareViaEmailIcon } from '@/assets/icons/share-via-email.svg';
import { ReactComponent as TabIcon } from '@/assets/icons/tabs-icon.svg';
import SampleProductImage from '@/assets/images/sample-product-img.png';
import { BodyText } from '@/components/Typography';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useCheckPermission, useCheckUserRole } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import { useAppSelector } from '@/reducers';
import {
  deleteProductById,
  duplicateProductById,
  getProductListByBrandId,
  getProductSummary,
  likeProductById,
} from '@/services';
import { ProductGetListParameter, ProductItem } from '@/types';
import { Tooltip } from 'antd';
import React, { useState } from 'react';
import ShareViaEmail from '../ShareViaEmail';
import styles from './styles/cardList.less';
import { gotoProductDetailPage } from './utils';

interface ProductCardProps {
  product: ProductItem;
  hasBorder?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, hasBorder }) => {
  const { filter } = useAppSelector((state) => state.product.list);
  const [liked, setLiked] = useState(product.is_liked);

  const [visible, setVisible] = useState<boolean>(false);

  // check user permission to action
  const showShareEmail = useCheckPermission('Brand Admin');
  const showDuplicateAndDelete = useCheckPermission('TISC Admin');

  // check user role to redirect
  const userRole = useCheckUserRole();
  const handleRedirectRoute = () => {
    const path = gotoProductDetailPage(userRole, product.id);
    if (path) {
      pushTo(path);
    }
  };

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
      <div className={styles.imageWrapper} onClick={handleRedirectRoute}>
        <img src={product.images?.[0] ? showImageUrl(product.images[0]) : SampleProductImage} />
        <div className={styles.imagePlaceholder}>
          <BodyText level={5} fontFamily="Roboto">
            {product.description}
          </BodyText>
        </div>
      </div>
      <div className={styles.productInfo} onClick={handleRedirectRoute}>
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

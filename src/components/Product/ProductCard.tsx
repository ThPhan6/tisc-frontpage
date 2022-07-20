import React, { useState } from 'react';
import SampleProductImage from '@/assets/images/sample-product-img.png';
import { ReactComponent as LikeIcon } from '@/assets/icons/action-like-icon.svg';
import { ReactComponent as LikedIcon } from '@/assets/icons/action-liked-icon.svg';
import { ReactComponent as TabIcon } from '@/assets/icons/tabs-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { BodyText } from '@/components/Typography';
import { showImageUrl } from '@/helper/utils';
import { Tooltip } from 'antd';
import { confirmDelete } from '@/helper/common';
import { useAppSelector } from '@/reducers';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import {
  deleteProductById,
  getProductListByBrandId,
  getProductSummary,
  duplicateProductById,
  likeProductById,
} from '@/services';
import { ProductItem, ProductGetListParameter } from '@/types';
import styles from './styles/cardList.less';

interface ProductCardProps {
  product: ProductItem;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { filter } = useAppSelector((state) => state.product.list);
  const [liked, setLiked] = useState(product.is_liked);
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
    confirmDelete(() => {
      deleteProductById(product.id ?? '').then((isSuccess) => {
        if (isSuccess && filter && product.brand && product.brand.id) {
          reloadProductInformation();
        }
      });
    });
  };

  const duplicateProduct = () => {
    duplicateProductById(product.id ?? '').then((isSuccess) => {
      if (isSuccess) {
        reloadProductInformation();
      }
    });
  };
  const likeProduct = () => {
    likeProductById(product.id ?? '').then((isSuccess) => {
      if (isSuccess) {
        setLiked(!liked);
      }
    });
  };

  const gotoProductDetailPage = () => {
    if (product.id) {
      pushTo(PATH.productConfigurationUpdate.replace(':id', product.id));
    }
  };

  const likeCount = (product.favorites ?? 0) + (liked ? 1 : 0);

  return (
    <div className={styles.productCardItem}>
      <div className={styles.imageWrapper} onClick={gotoProductDetailPage}>
        <img src={product.images[0] ? showImageUrl(product.images[0]) : SampleProductImage} />
        <div className={styles.imagePlaceholder}>
          <BodyText level={5} fontFamily="Roboto">
            {product.description}
          </BodyText>
        </div>
      </div>
      <div className={styles.productInfo}>
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
            {`${likeCount.toLocaleString('en-us')} ${likeCount > 1 ? 'like' : 'likes'}`}
          </BodyText>
        </Tooltip>
        <BodyText customClass="action-other">
          <Tooltip placement="bottom" title="Duplicate">
            <TabIcon onClick={duplicateProduct} />
          </Tooltip>
          <Tooltip placement="bottom" title="Delete">
            <DeleteIcon onClick={handleDeleteProduct} />
          </Tooltip>
        </BodyText>
      </div>
    </div>
  );
};

export default ProductCard;

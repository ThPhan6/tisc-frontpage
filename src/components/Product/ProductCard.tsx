import React from 'react';
import SampleProductImage from '@/assets/images/sample-product-img.png';
import { ReactComponent as LikeIcon } from '@/assets/icons/action-like-icon.svg';
import { ReactComponent as TabIcon } from '@/assets/icons/tabs-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { BodyText } from '@/components/Typography';
import { showImageUrl } from '@/helper/utils';
// import { useDispatch } from 'react-redux';
// import { useAppSelector } from '@/reducers';
// import { setBrand } from '@/reducers/product';
import { IProductDetail } from '@/types';
import styles from './styles/cardList.less';

interface IProductCard {
  product: IProductDetail;
}

const ProductCard: React.FC<IProductCard> = ({ product }) => {
  return (
    <div className={styles.productCardItem}>
      <div className={styles.imageWrapper}>
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
        <BodyText level={6} fontFamily="Roboto" customClass="action-like">
          <LikeIcon />
          {product.favorites ?? 0} likes
        </BodyText>
        <BodyText customClass="action-other">
          <TabIcon />
          <DeleteIcon />
        </BodyText>
      </div>
    </div>
  );
};

export default ProductCard;

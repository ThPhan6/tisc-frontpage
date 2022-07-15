import React from 'react';
import SampleProductImage from '@/assets/images/sample-product-img.png';
import { ReactComponent as LikeIcon } from '@/assets/icons/action-like-icon.svg';
import { ReactComponent as TabIcon } from '@/assets/icons/tabs-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { BodyText } from '@/components/Typography';
// import {showImageUrl} from '@/helper/utils';
// import { useDispatch } from 'react-redux';
// import { useAppSelector } from '@/reducers';
// import { setBrand } from '@/reducers/product';
import styles from './styles/cardList.less';

interface IProductCard {
  onItemClick: () => void;
}

const ProductCard: React.FC<IProductCard> = (props) => {
  const { onItemClick } = props;
  return (
    <div className={styles.productCardItem}>
      <div className={styles.imageWrapper}>
        <img src={SampleProductImage} />
        <div className={styles.imagePlaceholder} onClick={onItemClick}>
          <BodyText level={5} fontFamily="Roboto">
            produt/items dea asd asd asd asd asd ascription
          </BodyText>
        </div>
      </div>
      <div className={styles.productInfo}>
        <BodyText level={6} fontFamily="Roboto" customClass="product-description">
          produt/items dea asd asd asd asd asd ascription
        </BodyText>
        <BodyText level={7} fontFamily="Roboto" customClass="text-uppercase">
          Silestone
        </BodyText>
      </div>
      <div className={styles.productAction}>
        <BodyText level={6} fontFamily="Roboto" customClass="action-like">
          <LikeIcon />0 likes
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

import React from 'react';
import ProductCard from './Card';
// import {showImageUrl} from '@/helper/utils';
// import { useDispatch } from 'react-redux';
// import { useAppSelector } from '@/reducers';
// import { setBrand } from '@/reducers/product';
// import classnames from 'classnames';
import styles from './styles/cardList.less';

interface IProductCardList {
  onItemClick: () => void;
}

const CardList: React.FC<IProductCardList> = (props) => {
  const { onItemClick } = props;
  return (
    <div className={styles.productCardContainer}>
      <div className={styles.productCardItemWrapper}>
        <ProductCard onItemClick={onItemClick} />
      </div>
    </div>
  );
};

export default CardList;

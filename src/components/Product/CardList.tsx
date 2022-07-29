import React from 'react';
import ProductCard from './ProductCard';
import CustomCollapse from '@/components/Collapse';
import { BodyText } from '@/components/Typography';
// import {showImageUrl} from '@/helper/utils';
// import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
// import { setBrand } from '@/reducers/product';
import styles from './styles/cardList.less';
import { truncate, capitalize } from 'lodash';

const CardList: React.FC = ({}) => {
  const product = useAppSelector((state) => state.product);

  // console.log('product', product);
  // if (!product.list.data.length) {
  //   return <EmptyDataMessage message={EMPTY_DATA_MESSAGE.product} />;
  // }

  return (
    <>
      {product.list.data.map((group, index) => (
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

export default CardList;

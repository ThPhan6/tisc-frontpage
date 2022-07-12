import classNames from 'classnames';
import { FC } from 'react';
import { Title } from '@/components/Typography';
import CustomButton from '@/components/Button';
import styles from '../styles/header.less';

interface ProductHeaderProps {
  title: string;
  customClass?: string;
}

const ProductHeader: FC<ProductHeaderProps> = ({ title, customClass }) => {
  return (
    <div className={classNames(styles.productHeader, customClass)}>
      <div className={styles.leftAction}>
        <Title level={7}>{title}</Title>
        <CustomButton variant="text" buttonClass="select-category-btn">
          select
        </CustomButton>
      </div>
      <div className={styles.iconWrapper}>
        <CustomButton size="small" variant="primary" properties="rounded" buttonClass="save-btn">
          Save
        </CustomButton>
        <CustomButton size="small" variant="primary" properties="rounded" buttonClass="cancel-btn">
          Cancel
        </CustomButton>
      </div>
    </div>
  );
};
export default ProductHeader;

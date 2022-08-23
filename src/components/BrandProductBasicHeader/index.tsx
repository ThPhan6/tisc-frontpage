import { FC } from 'react';

import { showImageUrl } from '@/helper/utils';

import { RobotoBodyText } from '../Typography';
import ProductPlaceHolderImage from '@/assets/images/product-placeholder.png';

import styles from './index.less';

interface BrandProductBasicHeaderProps {
  image?: string;
  logo?: string;
  text_1?: string;
  text_2?: string;
  text_3?: string;
  customClass?: string;
}

const BrandProductBasicHeader: FC<BrandProductBasicHeaderProps> = ({
  image,
  logo,
  text_1 = '',
  text_2 = '',
  text_3 = '',
  customClass = '',
}) => {
  return (
    <div className={`${styles.productInformationWrapper} ${customClass}`}>
      <div className={styles.productInformationContainer}>
        <img src={showImageUrl(image) || ProductPlaceHolderImage} className={styles.productImage} />
        <div className={styles.productInformation}>
          <RobotoBodyText level={6}> {text_1} </RobotoBodyText>
          <RobotoBodyText level={6}> {text_2} </RobotoBodyText>
          <RobotoBodyText level={6}> {text_3} </RobotoBodyText>
        </div>
      </div>
      <div className={styles.brandLogo}>
        <img src={showImageUrl(logo) || ProductPlaceHolderImage} />
      </div>
    </div>
  );
};

export default BrandProductBasicHeader;

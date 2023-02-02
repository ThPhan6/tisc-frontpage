import { FC } from 'react';

import ProductPlaceHolderImage from '@/assets/images/product-placeholder.png';

import { showImageUrl } from '@/helper/utils';

import { RobotoBodyText } from '../Typography';
import styles from './index.less';

interface BrandProductBasicHeaderProps {
  image?: string;
  logo?: string;
  text_1?: string;
  text_2?: string;
  text_3?: string | React.ReactNode;
  text_4?: string;
  hasBoxShadow?: boolean;
  customClass?: string;
}

const BrandProductBasicHeader: FC<BrandProductBasicHeaderProps> = ({
  image,
  logo,
  text_1 = '',
  text_2 = '',
  text_3 = '',
  text_4,
  hasBoxShadow = false,
  customClass = '',
}) => {
  return (
    <div
      className={`${styles.productInformationWrapper} ${
        hasBoxShadow ? styles.boxShadow : ''
      } ${customClass}`}>
      <div className={styles.productInformationContainer}>
        <img src={showImageUrl(image) || ProductPlaceHolderImage} className={styles.productImage} />
        <div className={styles.productInformation}>
          {text_1 ? <RobotoBodyText level={6}>{text_1}</RobotoBodyText> : null}
          {text_2 ? <RobotoBodyText level={6}>{text_2}</RobotoBodyText> : null}
          {text_3 ? <RobotoBodyText level={6}>{text_3}</RobotoBodyText> : null}
          {text_4 ? <RobotoBodyText level={6}>{text_4}</RobotoBodyText> : null}
        </div>
      </div>
      {logo ? (
        <div className={styles.brandLogo}>
          <img src={showImageUrl(logo) || ProductPlaceHolderImage} />
        </div>
      ) : null}
    </div>
  );
};

export default BrandProductBasicHeader;

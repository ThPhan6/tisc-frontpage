import { BodyText } from '../Typography';
import { ReactComponent as DownloadIconV2 } from '@/assets/icons/download-2-icon.svg';
import ProductVendor from './ProductVendor';
import styles from './styles/download.less';
import { useAppSelector } from '@/reducers';
import { useEffect } from 'react';
import { getProductDownloadByProductID } from '@/services';
import { useParams } from 'umi';
import { isValidURL } from '@/helper/utils';

const DownloadContent = () => {
  const params = useParams<{ id: string }>();
  const productId = params?.id || '';
  const { contents } = useAppSelector((state) => state.product.download);

  useEffect(() => {
    if (productId) {
      getProductDownloadByProductID(productId);
    }
  }, [productId]);

  const handleDownload = (url: string) => {
    if (!url) {
      return;
    }
    const validURL = isValidURL(url);
    if (validURL) {
      console.log('valid');

      window.open(url, '_blank');
    }
  };

  return (
    <ProductVendor>
      <div className={styles.download}>
        {contents.map((content, index) => {
          return (
            <div className={styles.download_content} key={content.id || index}>
              <BodyText level={6} fontFamily="Roboto">
                {content.title}
              </BodyText>
              <DownloadIconV2
                className={styles.download_icon}
                onClick={() => handleDownload(content.url)}
              />
            </div>
          );
        })}
      </div>
    </ProductVendor>
  );
};

export default DownloadContent;

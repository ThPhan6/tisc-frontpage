import { useEffect } from 'react';
import { useParams } from 'umi';
import { useAppSelector } from '@/reducers';
import styles from './DownloadContent.less';
import { isValidURL } from '@/helper/utils';
import { getProductDownloadByProductID } from '@/features/product/services';
import { BodyText } from '@/components/Typography';
import { ReactComponent as DownloadIconV2 } from '@/assets/icons/download-2-icon.svg';

export const DownloadContent = () => {
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
      window.open(url, '_blank');
    }
  };

  return (
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
  );
};

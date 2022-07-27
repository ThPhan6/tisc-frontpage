import { BodyText } from '../Typography';
import { ReactComponent as DownloadIconV2 } from '@/assets/icons/download-2-icon.svg';
import ProductVendor from './ProductVendor';
import styles from './styles/download.less';

const DownloadContent = () => {
  const handleDownload = () => {
    alert('comming soon');
  };

  return (
    <ProductVendor>
      <div className={styles.download}>
        <BodyText level={6} fontFamily="Roboto"></BodyText>
        <DownloadIconV2 className={styles.download_icon} onClick={handleDownload} />
      </div>
    </ProductVendor>
  );
};

export default DownloadContent;

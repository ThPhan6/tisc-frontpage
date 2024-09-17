import { ReactComponent as DownloadIconV2 } from '@/assets/icons/download-2-icon.svg';

import { useAppSelector } from '@/reducers';

import { EmptyOne } from '@/components/Empty';
import { BodyText } from '@/components/Typography';

import styles from './CatelogueDownload.less';

export const CatelogueDownload = () => {
  const catelogue_downloads = useAppSelector((state) => state.product.details.catelogue_downloads);

  if (!catelogue_downloads || catelogue_downloads.length === 0) {
    return <EmptyOne customClass={styles.emptyOne} />;
  }

  return (
    <div className={styles.download}>
      {catelogue_downloads.map((content, index) => {
        return (
          <div className={styles.download_content} key={content.id || index}>
            <BodyText style={{ padding: '4px 16px' }} level={6} fontFamily="Roboto">
              {content.title}
            </BodyText>
            <a href={content.url} download target="_blank" rel="noopener noreferrer">
              <DownloadIconV2 className={styles.download_icon} />
            </a>
          </div>
        );
      })}
    </div>
  );
};

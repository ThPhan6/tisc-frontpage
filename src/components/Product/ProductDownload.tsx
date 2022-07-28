import { useAppSelector } from '@/reducers';
import { FC } from 'react';
import { USER_ROLE } from '@/constants/userRoles';
import DownloadAddContent from './DownLoadAddContent';
import { ReactComponent as DownloadIconV2 } from '@/assets/icons/download-2-icon.svg';
import { BodyText } from '../Typography';
import styles from './styles/productDownload.less';
import { isValidURL } from '@/helper/utils';

const ProductDownload: FC<{ userRole: string }> = ({ userRole }): any => {
  const { download } = useAppSelector((state) => state.product);
  const handleDownload = (url: string) => {
    if (!url) {
      return;
    }
    const validURL = isValidURL(url);
    if (validURL) {
      window.open(url, '_blank');
    }
  };

  switch (userRole) {
    case USER_ROLE.tisc:
      return <DownloadAddContent />;
    case USER_ROLE.brand:
      return (
        <div className={styles.downloadFooter}>
          <table>
            {download.contents.map((content, index) => {
              return (
                <tr key={content.id || index}>
                  <td className={styles.title}>
                    <BodyText level={4} customClass={styles.content_title}>
                      {content.title}
                    </BodyText>
                  </td>
                  <td className={styles.url}>
                    <BodyText level={6} customClass={styles.content_text} fontFamily="Roboto">
                      {content.url}
                    </BodyText>
                  </td>
                  <td className={styles.icon}>
                    <DownloadIconV2
                      className={styles.downloadIcon}
                      onClick={() => handleDownload(content.url)}
                    />
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      );

    default:
      return;
  }
};

export default ProductDownload;

import { useAppSelector } from '@/reducers';
import { FC } from 'react';
import { USER_ROLE } from '@/constants/userRoles';
import { ReactComponent as DownloadIconV2 } from '@/assets/icons/download-2-icon.svg';
import styles from './ProductDownloadFooter.less';
import { isValidURL } from '@/helper/utils';
import { useDispatch } from 'react-redux';
import { setProductDownload } from '@/features/product/reducers';
import DynamicFormInput from '@/components/EntryForm/DynamicFormInput';
import { BodyText } from '@/components/Typography';

const ProductDownloadFooter: FC<{ userRole: USER_ROLE }> = ({ userRole }) => {
  const download = useAppSelector((state) => state.product.download);
  const dispatch = useDispatch();

  switch (userRole) {
    case USER_ROLE.tisc:
      return (
        <DynamicFormInput
          data={download.contents.map((item) => {
            return {
              title: item.title,
              value: item.url,
            };
          })}
          setData={(data) => {
            dispatch(
              setProductDownload({
                ...download,
                contents: data.map((item, index) => {
                  return {
                    ...download.contents[index],
                    title: item.title,
                    url: item.value,
                  };
                }),
              }),
            );
          }}
          titlePlaceholder="type file name here"
          valuePlaceholder="paste file URL link here"
        />
      );

    case USER_ROLE.brand || USER_ROLE.design:
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
      return null;
  }
};

export default ProductDownloadFooter;

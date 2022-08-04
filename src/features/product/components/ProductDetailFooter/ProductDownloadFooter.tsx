import { useAppSelector } from '@/reducers';
import { FC } from 'react';
import { ReactComponent as DownloadIconV2 } from '@/assets/icons/download-2-icon.svg';
import styles from './ProductDownloadFooter.less';
import { useDispatch } from 'react-redux';
import { setProductDownload } from '@/features/product/reducers';
import DynamicFormInput from '@/components/EntryForm/DynamicFormInput';
import { BodyText } from '@/components/Typography';
import { useCheckPermission } from '@/helper/hook';
import { EmptyOne } from '@/components/Empty';
import { isEmpty } from 'lodash';

const ProductDownloadFooter: FC = () => {
  const dispatch = useDispatch();

  const download = useAppSelector((state) => state.product.download);
  const isTiscAdmin = useCheckPermission('TISC Admin');

  if (isTiscAdmin) {
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
  }
  if (isEmpty(download.contents)) {
    return <EmptyOne />;
  }
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
                <a href={content.url} download>
                  <BodyText level={6} customClass={styles.content_text} fontFamily="Roboto">
                    {content.url}
                  </BodyText>
                </a>
              </td>
              <td className={styles.icon}>
                <a href={content.url} download>
                  <DownloadIconV2 className={styles.downloadIcon} />
                </a>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default ProductDownloadFooter;

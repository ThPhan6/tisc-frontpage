import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ReactComponent as DownloadIconV2 } from '@/assets/icons/download-2-icon.svg';

import { useCheckPermission } from '@/helper/hook';
import { isEmpty } from 'lodash';

import { setPartialProductDetail } from '@/features/product/reducers';
import { useAppSelector } from '@/reducers';

import { EmptyOne } from '@/components/Empty';
import DynamicFormInput from '@/components/EntryForm/DynamicFormInput';
import { BodyText } from '@/components/Typography';

import styles from './ProductDownloadFooter.less';

const ProductDownloadFooter: FC = () => {
  const dispatch = useDispatch();

  const downloads = useAppSelector((state) => state.product.details.downloads);
  const isTiscAdmin = useCheckPermission('TISC Admin');

  if (isTiscAdmin) {
    return (
      <DynamicFormInput
        data={downloads.map((item) => {
          return {
            title: item.title,
            value: item.url,
          };
        })}
        setData={(data) => {
          dispatch(
            setPartialProductDetail({
              downloads: data.map((item, index) => {
                return {
                  ...downloads[index],
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
  if (isEmpty(downloads)) {
    return <EmptyOne />;
  }
  return (
    <div className={styles.downloadFooter}>
      <table>
        {downloads.map((content, index) => {
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

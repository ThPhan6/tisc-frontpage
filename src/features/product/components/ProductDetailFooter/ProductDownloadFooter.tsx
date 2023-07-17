import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ReactComponent as DownloadIconV2 } from '@/assets/icons/download-icon.svg';

import { useScreen } from '@/helper/common';
import { useCheckPermission } from '@/helper/hook';
import { isEmpty } from 'lodash';

import { setPartialProductDetail } from '@/features/product/reducers';
import { useAppSelector } from '@/reducers';

import { EmptyOne } from '@/components/Empty';
import DynamicFormInput from '@/components/EntryForm/DynamicFormInput';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { BodyText } from '@/components/Typography';

import styles from './ProductDownloadFooter.less';

const ProductDownloadFooter: FC = () => {
  const dispatch = useDispatch();

  const isTablet = useScreen().isTablet;
  const isTiscAdmin = useCheckPermission(['TISC Admin', 'Consultant Team']);
  const isEditable = isTiscAdmin && !isTablet;

  const downloads = useAppSelector((state) => state.product.details.downloads);

  if (isEditable) {
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
        titleStyles={{ paddingLeft: 16 }}
        valueStyles={{ paddingLeft: 32 }}
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
                <CustomTextArea value={content.title} autoResize disabled />
              </td>
              <td className={styles.url}>
                <BodyText level={6} customClass={styles.content_text} fontFamily="Roboto">
                  {content.url}
                </BodyText>
              </td>
              <td className={styles.icon}>
                <a href={content.url} target="_blank" download rel="noopener noreferrer">
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

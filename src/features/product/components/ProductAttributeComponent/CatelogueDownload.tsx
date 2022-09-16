import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useParams } from 'umi';

import { ReactComponent as DownloadIconV2 } from '@/assets/icons/download-2-icon.svg';

import { getProductCatelogueByProductID } from '@/features/product/services';
import { useCheckPermission } from '@/helper/hook';

import { setProductCatelogue } from '@/features/product/reducers';
import { useAppSelector } from '@/reducers';

import DynamicFormInput from '@/components/EntryForm/DynamicFormInput';
import { BodyText } from '@/components/Typography';

import styles from './CatelogueDownload.less';

const DownloadContent = () => {
  const contents = useAppSelector((state) => state.product.catelogue.contents);

  return (
    <div className={styles.download}>
      {contents.map((content, index) => {
        return (
          <div className={styles.download_content} key={content.id || index}>
            <BodyText level={6} fontFamily="Roboto">
              {content.title}
            </BodyText>
            <a href={content.url} download>
              <DownloadIconV2 className={styles.download_icon} />
            </a>
          </div>
        );
      })}
    </div>
  );
};

export const CatelogueDownload = () => {
  const params = useParams<{ id: string }>();
  const productId = params?.id || '';
  const catelogue = useAppSelector((state) => state.product.catelogue);
  const dispatch = useDispatch();
  const isTiscAdmin = useCheckPermission('TISC Admin');

  useEffect(() => {
    if (productId) {
      getProductCatelogueByProductID(productId);
    }
  }, [productId]);

  if (isTiscAdmin) {
    return (
      <DynamicFormInput
        data={catelogue.contents.map((item) => {
          return {
            title: item.title,
            value: item.url,
          };
        })}
        setData={(data) => {
          dispatch(
            setProductCatelogue({
              ...catelogue,
              contents: data.map((item, index) => {
                return {
                  ...catelogue.contents[index],
                  title: item.title,
                  url: item.value,
                };
              }),
            }),
          );
        }}
        titlePlaceholder="type catelogue name here"
        valuePlaceholder="paste file URL link here"
      />
    );
  }

  return <DownloadContent />;
};

import { useEffect } from 'react';
import { useParams } from 'umi';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setProductCatelogue } from '@/features/product/reducers';
import DynamicFormInput from '@/components/EntryForm/DynamicFormInput';
import { useCheckPermission } from '@/helper/hook';
import styles from './CatelogueDownload.less';
import { isValidURL } from '@/helper/utils';
import { getProductCatelogueByProductID } from '@/features/product/services';
import { BodyText } from '@/components/Typography';
import { ReactComponent as DownloadIconV2 } from '@/assets/icons/download-2-icon.svg';

const DownloadContent = () => {
  const params = useParams<{ id: string }>();
  const productId = params?.id || '';
  const contents = useAppSelector((state) => state.product.catelogue.contents);

  useEffect(() => {
    if (productId) {
      /// load product detail catelogues
      getProductCatelogueByProductID(productId);
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

export const CatelogueDownload = () => {
  const catelogue = useAppSelector((state) => state.product.catelogue);
  const dispatch = useDispatch();
  const isTiscAdmin = useCheckPermission('TISC Admin');

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

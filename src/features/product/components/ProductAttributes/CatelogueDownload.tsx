import { useDispatch } from 'react-redux';

import { ReactComponent as DownloadIconV2 } from '@/assets/icons/download-2-icon.svg';

import { useCheckPermission } from '@/helper/hook';

import { setPartialProductDetail } from '@/features/product/reducers';
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
  const catelogue_downloads = useAppSelector((state) => state.product.details.catelogue_downloads);
  const dispatch = useDispatch();
  const isTiscAdmin = useCheckPermission('TISC Admin');

  if (isTiscAdmin) {
    return (
      <DynamicFormInput
        data={catelogue_downloads.map((item) => {
          return {
            title: item.title,
            value: item.url,
          };
        })}
        setData={(data) => {
          dispatch(
            setPartialProductDetail({
              catelogue_downloads: data.map((item, index) => {
                return {
                  ...catelogue_downloads[index],
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

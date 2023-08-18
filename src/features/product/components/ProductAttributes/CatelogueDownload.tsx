import { useDispatch } from 'react-redux';

import { ReactComponent as DownloadIconV2 } from '@/assets/icons/download-icon.svg';

import { useScreen } from '@/helper/common';
import { useCheckPermission } from '@/helper/hook';

import { setPartialProductDetail } from '@/features/product/reducers';
import { useAppSelector } from '@/reducers';

import { EmptyOne } from '@/components/Empty';
import DynamicFormInput from '@/components/EntryForm/DynamicFormInput';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { BodyText } from '@/components/Typography';

import styles from './CatelogueDownload.less';

export const CatelogueDownload = () => {
  const isTablet = useScreen().isTablet;
  const isTiscAdmin = useCheckPermission(['TISC Admin', 'Consultant Team']);
  const isEditable = isTiscAdmin && !isTablet;

  const catelogue_downloads = useAppSelector((state) => state.product.details.catelogue_downloads);
  const dispatch = useDispatch();

  if (isEditable) {
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
        titleStyles={{ paddingLeft: 0 }}
        valueStyles={{ paddingLeft: 16 }}
      />
    );
  }

  if (!catelogue_downloads || catelogue_downloads.length === 0) {
    return <EmptyOne customClass={styles.paddingRounded} />;
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

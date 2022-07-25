import React from 'react';
import { BodyText } from '@/components/Typography';
import ProductPlaceHolderImage from '@/assets/images/product-placeholder.png';
import { ReactComponent as UploadIcon } from '@/assets/icons/action-upload-icon.svg';
import { ReactComponent as AddMoreIcon } from '@/assets/icons/circle-plus-48.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/trash-icon-12.svg';
import SmallIconButton from '@/components/Button/SmallIconButton';
import { CustomInput } from '@/components/Form/CustomInput';
import { Row, Col, message } from 'antd';
import { getBase64 } from '@/helper/utils';
import type { UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { Upload } from 'antd';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setPartialProductDetail, setProductDetailImage } from '@/reducers/product';
import { showImageUrl } from '@/helper/utils';
import { IMAGE_ACCEPT_TYPES } from '@/constants/util';
import type { ProductKeyword } from '@/types';

import styles from './styles/details.less';

const PhotoUpload: React.FC = () => {
  const product = useAppSelector((state) => state.product);
  const dispatch = useDispatch();
  const { images, keywords } = product.details;

  const handleLoadPhoto = async (file: UploadFile<any>, type: 'first' | 'last' = 'first') => {
    const imageBase64 = await getBase64(file.originFileObj);
    dispatch(
      setProductDetailImage({
        type,
        image: imageBase64,
      }),
    );
  };

  const primaryProps: UploadProps = {
    name: 'file',
    accept: IMAGE_ACCEPT_TYPES.image,
    multiple: true,
    onChange: async (info) => {
      const { file, event } = info;
      if (event?.percent === 100) {
        handleLoadPhoto(file);
      }
    },
    beforeUpload: (_file, fileList) => {
      if (images.length + fileList.length > 9) {
        message.error('Max photos is 9');
        return false;
      }
      return true;
    },
    showUploadList: false,
    className: styles.uploadZone,
  };

  const subProps: UploadProps = {
    ...primaryProps,
    onChange: async (info) => {
      const { file, event } = info;
      if (event?.percent === 100) {
        handleLoadPhoto(file, 'last');
      }
    },
    className: styles.addMoreSubPhotos,
  };

  const handleUploadPrimaryPhoto = (e: React.ChangeEvent<any>) => {
    e.stopPropagation();
    /// trigger file dialog of dropzone element
    e.target.parentElement.parentElement.parentElement.click();
  };

  const deletePhoto = (e: React.ChangeEvent<any>, index: number) => {
    e.stopPropagation();
    const newPhotos = images.filter((_photo, key) => {
      return index !== key;
    });
    dispatch(
      setPartialProductDetail({
        images: newPhotos,
      }),
    );
  };

  return (
    <Col span={12} className={styles.productContent}>
      <div className={styles.productImageWrapper}>
        <Upload.Dragger {...primaryProps}>
          <div className={styles.uploadZoneContent}>
            {images[0] ? (
              <img src={showImageUrl(images[0])} className={styles.primaryPhoto} />
            ) : (
              <div className={styles.dropzoneNote}>
                <BodyText level={3}>
                  Drag & drop the image into the frame
                  <br />
                  or click the upload button below
                </BodyText>
                <img src={ProductPlaceHolderImage} className={styles.placeholderPhoto} />
              </div>
            )}
            <div className={styles.primaryAction}>
              <SmallIconButton
                icon={<UploadIcon />}
                onClick={handleUploadPrimaryPhoto}
                className={styles.actionIcon}
              />
              <SmallIconButton
                icon={<DeleteIcon />}
                onClick={(e) => deletePhoto(e, 0)}
                className={styles.actionIcon}
              />
            </div>
          </div>
        </Upload.Dragger>

        <Row className={styles.photoList} gutter={8}>
          <Col span={18}>
            <Row gutter={8} className={styles.listWrapper}>
              {images
                .filter((_item, index) => index !== 0)
                .map((image, key) => (
                  <Col span={8} key={key}>
                    <div className={styles.fileItem}>
                      <div className={styles.filePreview}>
                        <img src={showImageUrl(image) ?? ProductPlaceHolderImage} />
                        <div className={styles.subPhotoAction}>
                          <SmallIconButton
                            icon={<DeleteIcon />}
                            onClick={(e) => deletePhoto(e, key + 1)}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
            </Row>
          </Col>
          <Col span={6}>
            <Upload {...subProps}>
              <div className={styles.addMorePhotocontent}>
                <BodyText level={6} fontFamily="Roboto">
                  Add more images
                </BodyText>
                <AddMoreIcon />
                <BodyText level={6} fontFamily="Roboto">
                  (min.3 and max.9)
                </BodyText>
              </div>
            </Upload>
          </Col>
        </Row>
        <div className={styles.photoKeyword}>
          <BodyText level={6} fontFamily="Roboto">
            {product.brand?.name ?? 'N/A'}
          </BodyText>
          {keywords.map((value, index) => (
            <CustomInput
              key={index}
              placeholder={`keyword${index + 1}`}
              autoWidth
              defaultWidth={55}
              value={value}
              onChange={(e) => {
                const newKeywords = [...keywords] as ProductKeyword;
                newKeywords[index] = e.target.value;
                dispatch(
                  setPartialProductDetail({
                    keywords: newKeywords,
                  }),
                );
              }}
            />
          ))}
        </div>
      </div>
    </Col>
  );
};

export default PhotoUpload;

import { ReactComponent as LikeIcon } from '@/assets/icons/action-like-icon.svg';
import { ReactComponent as LikedIcon } from '@/assets/icons/action-liked-icon.svg';
import { ReactComponent as ShareViaEmailIcon } from '@/assets/icons/ic-share.svg';
import { ReactComponent as AssignIcon } from '@/assets/icons/ic-assign-2.svg';
import ProductPlaceHolderImage from '@/assets/images/product-placeholder.png';
import { ReactComponent as UploadIcon } from '@/assets/icons/action-upload-icon.svg';
import { ReactComponent as AddMoreIcon } from '@/assets/icons/circle-plus-48.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/trash-icon-12.svg';
import { BodyText } from '@/components/Typography';
import { IMAGE_ACCEPT_TYPES } from '@/constants/util';
import { getBase64, showImageUrl } from '@/helper/utils';
import { useAppSelector } from '@/reducers';
import { Col, message, Row, Upload } from 'antd';
import type { UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { FC, ReactNode, useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './detail.less';
import ShareViaEmail from '@/components/ShareViaEmail/index';
import { useBoolean, useCheckPermission } from '@/helper/hook';
import { likeProductById } from '@/features/product/services';
import { setPartialProductDetail, setProductDetailImage } from '@/features/product/reducers';
import SmallIconButton from '@/components/Button/SmallIconButton';
import { CustomInput } from '@/components/Form/CustomInput';
import { ProductKeyword } from '../types';
import AssignProductModal from '../modals/AssignProductModal';

const ActionItem: FC<{ onClick: () => void; label: string; icon: ReactNode }> = ({
  icon,
  onClick,
  label,
}) => {
  return (
    <div className={styles.actionItem} onClick={onClick}>
      {icon}
      <BodyText level={6} fontFamily="Roboto">
        {label}
      </BodyText>
    </div>
  );
};

const ProductImagePreview: React.FC = () => {
  const dispatch = useDispatch();
  const { images, is_liked, id, favorites, keywords } = useAppSelector(
    (state) => state.product.details,
  );
  const showShareEmailModal = useBoolean();
  const showAssignProductModal = useBoolean();
  const isDesignerUser = useCheckPermission('Design Admin');
  const isTiscAdmin = useCheckPermission('TISC Admin');

  const [liked, setLiked] = useState(is_liked);
  const likeCount = (favorites ?? 0) + (liked ? 1 : 0);

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
    disabled: isTiscAdmin === false,
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

  const likeProduct = () => {
    likeProductById(id ?? '').then((isSuccess) => {
      if (isSuccess) {
        setLiked(!liked);
      }
    });
  };

  const renderBottomPreview = () => {
    if (isTiscAdmin) {
      return (
        <div className={styles.photoKeyword}>
          <BodyText level={4} customClass={styles.imageNaming}>
            Image naming:
          </BodyText>
          {keywords.map((value, index) => (
            <CustomInput
              key={index}
              placeholder={`keyword${index + 1}`}
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
      );
    }

    // For Brand & Designer role
    return (
      <div className={styles.productBrandAction}>
        <div className={styles.actionLeft}>
          {liked ? (
            <LikedIcon className={styles.actionIcon} onClick={likeProduct} />
          ) : (
            <LikeIcon className={styles.actionIcon} onClick={likeProduct} />
          )}
          <BodyText level={6} fontFamily="Roboto" customClass="action-like">
            {`${likeCount.toLocaleString('en-us')} ${likeCount <= 1 ? 'like' : 'likes'}`}
          </BodyText>
        </div>

        <div className={styles.actionRight}>
          {isDesignerUser && (
            <ActionItem
              label="Assign Product"
              icon={<AssignIcon />}
              onClick={() => showAssignProductModal.setValue(true)}
            />
          )}

          <ActionItem
            label="Share via Email"
            icon={<ShareViaEmailIcon />}
            onClick={() => showShareEmailModal.setValue(true)}
          />
        </div>
      </div>
    );
  };

  return (
    <Col span={12} className={styles.productContent}>
      <div className={styles.productImageWrapper}>
        <Upload.Dragger {...primaryProps}>
          <div className={styles.uploadZoneContent}>
            {images[0] ? (
              <img src={showImageUrl(images[0])} className={styles.primaryPhoto} />
            ) : isTiscAdmin ? (
              <div className={styles.dropzoneNote}>
                <BodyText level={3}>
                  Drag & drop the image into the frame
                  <br />
                  or click the upload button below
                </BodyText>
                <img src={ProductPlaceHolderImage} className={styles.placeholderPhoto} />
              </div>
            ) : (
              <div className={styles.dropzoneNote}>
                <img src={ProductPlaceHolderImage} className={styles.placeholderPhoto} />
              </div>
            )}

            {isTiscAdmin && (
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
            )}
          </div>
        </Upload.Dragger>

        <Row className={styles.photoList} gutter={8}>
          <Col span={isTiscAdmin ? 18 : 24}>
            <Row gutter={8} className={styles.listWrapper}>
              {images
                .filter((_item, index) => index !== 0)
                .map((image, key) => (
                  <Col span={8} key={key}>
                    <div className={styles.fileItem}>
                      <div className={styles.filePreview}>
                        <img src={showImageUrl(image) ?? ProductPlaceHolderImage} />
                        {isTiscAdmin && (
                          <div className={styles.subPhotoAction}>
                            <SmallIconButton
                              icon={<DeleteIcon />}
                              onClick={(e) => deletePhoto(e, key + 1)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
            </Row>
          </Col>

          {isTiscAdmin && (
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
          )}
        </Row>

        {renderBottomPreview()}

        <ShareViaEmail
          visible={showShareEmailModal.value}
          setVisible={showShareEmailModal.setValue}
          product={product}
        />

        {id && (
          <AssignProductModal
            visible={showAssignProductModal.value}
            setVisible={showAssignProductModal.setValue}
            productId={id}
          />
        )}
      </div>
    </Col>
  );
};

export default ProductImagePreview;

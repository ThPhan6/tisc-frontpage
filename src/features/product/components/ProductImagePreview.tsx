import React, { FC, ReactNode } from 'react';
import { useDispatch } from 'react-redux';

import { IMAGE_ACCEPT_TYPES } from '@/constants/util';
import { Col, Row, Upload, message } from 'antd';
import type { UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

import { ReactComponent as LikeIcon } from '@/assets/icons/action-like-icon.svg';
import { ReactComponent as LikedIcon } from '@/assets/icons/action-liked-icon.svg';
import { ReactComponent as UploadIcon } from '@/assets/icons/action-upload-icon.svg';
import { ReactComponent as AddMoreIcon } from '@/assets/icons/circle-plus-48.svg';
import { ReactComponent as AssignIcon } from '@/assets/icons/ic-assign-2.svg';
import { ReactComponent as CommentIcon } from '@/assets/icons/ic-comment.svg';
import { ReactComponent as ShareViaEmailIcon } from '@/assets/icons/ic-share.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/trash-icon-12.svg';
import ProductPlaceHolderImage from '@/assets/images/product-placeholder.png';

import { likeProductById } from '@/features/product/services';
import { useScreen } from '@/helper/common';
import { useCheckPermission, useQuery } from '@/helper/hook';
import { getBase64, showImageUrl } from '@/helper/utils';

import { ProductKeyword } from '../types';
import { setPartialProductDetail, setProductDetailImage } from '@/features/product/reducers';
import store, { useAppSelector } from '@/reducers';
import { openModal } from '@/reducers/modal';

import SmallIconButton from '@/components/Button/SmallIconButton';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';
import {
  setCustomProductDetail,
  setCustomProductDetailImage,
} from '@/pages/Designer/Products/CustomLibrary/slice';

import { assignProductModalTitle } from '../modals/AssignProductModal';
import styles from './detail.less';

interface ActionItemProps {
  onClick: () => void;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
}

const ActionItem: FC<ActionItemProps> = ({ icon, onClick, label, disabled }) => {
  const isMobile = useScreen().isMobile;
  return (
    <div
      className={styles.actionItem}
      onClick={onClick}
      style={{
        cursor: disabled ? 'default' : 'pointer',
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <div className={`flex-start ${disabled ? styles.disabled : ''}`}>
        {icon}
        {isMobile ? null : (
          <BodyText
            level={6}
            fontFamily="Roboto"
            color={disabled ? 'mono-color-medium' : 'mono-color'}
          >
            {label}
          </BodyText>
        )}
      </div>
    </div>
  );
};

interface ProductImagePreviewProps {
  hideInquiryRequest?: boolean;
  isCustomProduct?: boolean;
  viewOnly?: boolean;
  disabledAssignProduct?: boolean;
  disabledShareViaEmail?: boolean;
}

const ProductImagePreview: React.FC<ProductImagePreviewProps> = ({
  hideInquiryRequest,
  isCustomProduct,
  viewOnly,
  disabledAssignProduct,
  disabledShareViaEmail,
}) => {
  const dispatch = useDispatch();
  const normalProduct = useAppSelector((state) => state.product.details);

  const isDesignerUser = useCheckPermission(['Design Admin', 'Design Team']);
  const isTiscUser = useCheckPermission(['TISC Admin', 'Consultant Team']);

  const isEditable = isTiscUser || (isCustomProduct && viewOnly !== true); // currently, uploading image

  const customProduct = useAppSelector((state) => state.customProduct.details);

  const product = isCustomProduct ? customProduct : normalProduct;

  const liked = 'keywords' in product ? product.is_liked : false;
  const likeCount = 'favorites' in product ? product.favorites || 0 : 0;

  const signature = useQuery().get('signature');
  const isPublicPage = !!signature;

  const handleLoadPhoto = async (file: UploadFile<any>, type: 'first' | 'last' = 'first') => {
    const imageBase64 = await getBase64(file.originFileObj);

    if (isCustomProduct) {
      dispatch(
        setCustomProductDetailImage({
          type,
          image: imageBase64,
        }),
      );
    } else {
      dispatch(
        setProductDetailImage({
          type,
          image: imageBase64,
        }),
      );
    }
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
      const totalImageCount = product.images.length + fileList.length;
      const maxImageAllow = isCustomProduct ? 4 : 9;

      if (totalImageCount > maxImageAllow) {
        message.error(`Maximum ${maxImageAllow} images are allowed`);
        return false;
      }

      return true;
    },
    showUploadList: false,
    disabled: !isEditable,
    className: `${styles.uploadZone} ${isEditable ? '' : styles.noBorder} ${
      !isEditable && product.images.length < 2 ? styles.noPadding : ''
    }`,
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
    const newPhotos = product.images.filter((_photo, key) => {
      return index !== key;
    });

    if (isCustomProduct) {
      dispatch(
        setCustomProductDetail({
          images: newPhotos,
        }),
      );
    } else {
      dispatch(
        setPartialProductDetail({
          images: newPhotos,
        }),
      );
    }
  };

  const likeProduct = () => {
    likeProductById(product.id ?? '').then((isSuccess) => {
      if (isSuccess) {
        const newLiked = !liked;
        dispatch(
          setPartialProductDetail({
            ...product,
            is_liked: newLiked,
            favorites: likeCount + (newLiked ? 1 : -1),
          }),
        );
      }
    });
  };

  const renderBottomPreview = () => {
    if (isTiscUser) {
      return (
        <div className={styles.photoKeyword}>
          <BodyText level={4} customClass={styles.imageNaming}>
            Image naming:
          </BodyText>
          {'keywords' in product
            ? product.keywords.map((value, index) => (
                <CustomInput
                  key={index}
                  placeholder={`keyword${index + 1}`}
                  value={value}
                  onChange={(e) => {
                    const newKeywords = [...product.keywords] as ProductKeyword;
                    newKeywords[index] = e.target.value;
                    dispatch(
                      setPartialProductDetail({
                        keywords: newKeywords,
                      }),
                    );
                  }}
                />
              ))
            : null}
        </div>
      );
    }

    const renderActionLeft = () => {
      if (isPublicPage || isCustomProduct) return null;

      if (isDesignerUser) {
        return liked ? <LikedIcon onClick={likeProduct} /> : <LikeIcon onClick={likeProduct} />;
      }

      return (
        <div className="flex-start" onClick={likeProduct}>
          {liked ? <LikedIcon /> : <LikeIcon />}
          <BodyText level={6} fontFamily="Roboto" customClass="action-like">
            {likeCount.toLocaleString('en-us')} {likeCount <= 1 ? 'like' : 'likes'}
          </BodyText>
        </div>
      );
    };

    // For Brand & Designer role
    return (
      <div className={styles.productBrandAction}>
        <div className={styles.actionLeft}>{renderActionLeft()}</div>

        <div className={styles.actionRight}>
          {isDesignerUser && !hideInquiryRequest ? (
            <ActionItem
              label="Inquiry/Request"
              icon={<CommentIcon />}
              onClick={() =>
                store.dispatch(
                  openModal({
                    type: 'Inquiry Request',
                    title: 'Inquiry/Request',
                    props: {
                      shareViaEmail: { isCustomProduct, product },
                    },
                  }),
                )
              }
            />
          ) : null}
          {isDesignerUser ? (
            <ActionItem
              label="Assign Product"
              icon={<AssignIcon />}
              onClick={() =>
                store.dispatch(
                  openModal({
                    type: 'Assign Product',
                    title: assignProductModalTitle,
                    props: {
                      isCustomProduct,
                      productId: product.id,
                    },
                  }),
                )
              }
              disabled={disabledAssignProduct}
            />
          ) : null}

          {isPublicPage ? null : (
            <ActionItem
              label="Share via Email"
              icon={<ShareViaEmailIcon />}
              onClick={() =>
                store.dispatch(
                  openModal({
                    type: 'Share via email',
                    title: 'Share via email',
                    props: {
                      shareViaEmail: { isCustomProduct, product },
                    },
                  }),
                )
              }
              disabled={disabledShareViaEmail}
            />
          )}
        </div>
      </div>
    );
  };

  const renderMainImage = () => {
    if (product.images[0]) {
      return <img src={showImageUrl(product.images[0])} className={styles.primaryPhoto} />;
    }
    if (isEditable) {
      return (
        <div className={styles.dropzoneNote}>
          <BodyText level={3}>
            Drag & drop the image into the frame
            <br />
            or click the upload button below
          </BodyText>
          <img src={ProductPlaceHolderImage} className={styles.placeholderPhoto} />
        </div>
      );
    }

    return (
      <div className={styles.dropzoneNote}>
        <img src={ProductPlaceHolderImage} className={styles.placeholderPhoto} />
      </div>
    );
  };

  return (
    <div className={styles.productContent}>
      <div className={styles.productImageWrapper}>
        <Upload.Dragger {...primaryProps}>
          <div className={styles.uploadZoneContent}>
            {renderMainImage()}

            {isEditable ? (
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
            ) : null}
          </div>
        </Upload.Dragger>

        <Row
          className={styles.photoList}
          gutter={8}
          style={{
            height: viewOnly && product.images.length < 2 ? 0 : undefined,
            paddingTop: viewOnly && product.images.length < 2 ? '33.33333333%' : undefined,
          }}
        >
          <Col span={isEditable ? 18 : 24}>
            <Row gutter={8} className={styles.listWrapper}>
              {product.images.slice(1).map((image, key) => (
                <Col span={8} key={key}>
                  <div className={styles.fileItem}>
                    <div
                      className={`${styles.filePreview}  ${!isEditable ? styles.lightBorder : ''}`}
                    >
                      <img src={showImageUrl(image) ?? ProductPlaceHolderImage} />
                      {isEditable ? (
                        <div className={styles.subPhotoAction}>
                          <SmallIconButton
                            icon={<DeleteIcon />}
                            onClick={(e) => deletePhoto(e, key + 1)}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>

          {isEditable ? (
            <Col span={6}>
              <Upload {...subProps}>
                <div className={styles.addMorePhotocontent}>
                  <BodyText level={6} fontFamily="Roboto">
                    Add more images
                  </BodyText>
                  <AddMoreIcon />
                  <BodyText level={6} fontFamily="Roboto">
                    {isCustomProduct ? '(max.4 more images)' : '(min.3 and max.9)'}
                  </BodyText>
                </div>
              </Upload>
            </Col>
          ) : null}
        </Row>

        {renderBottomPreview()}
      </div>
    </div>
  );
};

export default ProductImagePreview;

import { ReactComponent as LikeIcon } from '@/assets/icons/action-like-icon.svg';
import { ReactComponent as LikedIcon } from '@/assets/icons/action-liked-icon.svg';
import { ReactComponent as ShareViaEmailIcon } from '@/assets/icons/share-via-email.svg';
import ProductPlaceHolderImage from '@/assets/images/product-placeholder.png';
import { BodyText } from '@/components/Typography';
import { IMAGE_ACCEPT_TYPES } from '@/constants/util';
import { getBase64, showImageUrl } from '@/helper/utils';
import { useAppSelector } from '@/reducers';
import { setProductDetailImage } from '@/reducers/product';
import { Col, Row, Upload } from 'antd';
import type { UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { likeProductById } from '@/services';
import styles from '@/components/Product/styles/details.less';
import ShareViaEmail from '@/components/ShareViaEmail/index';

const PhotoUpload: React.FC = () => {
  const product = useAppSelector((state) => state.product);
  const dispatch = useDispatch();
  const { images, is_liked, id, favorites } = product.details;
  const [liked, setLiked] = useState(is_liked);
  const likeCount = (favorites ?? 0) + (liked ? 1 : 0);
  const [visible, setVisible] = useState<boolean>(false);

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
    showUploadList: false,
    disabled: true,
    className: styles.uploadZone,
  };

  const likeProduct = () => {
    likeProductById(id ?? '').then((isSuccess) => {
      if (isSuccess) {
        setLiked(!liked);
      }
    });
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
                <img src={ProductPlaceHolderImage} className={styles.placeholderPhoto} />
              </div>
            )}
          </div>
        </Upload.Dragger>

        <Row className={styles.photoList} gutter={8}>
          <Col span={24}>
            <Row gutter={8} className={styles.listWrapper}>
              {images
                .filter((_item, index) => index !== 0)
                .map((image, key) => (
                  <Col span={8} key={key}>
                    <div className={styles.fileItem}>
                      <div className={styles.filePreview}>
                        <img src={showImageUrl(image) ?? ProductPlaceHolderImage} />
                      </div>
                    </div>
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>

        <div className={styles.productBrandAction}>
          <div className={styles.likeAction}>
            {liked ? (
              <LikedIcon className={styles.actionIcon} onClick={likeProduct} />
            ) : (
              <LikeIcon className={styles.actionIcon} onClick={likeProduct} />
            )}
            <BodyText level={6} fontFamily="Roboto" customClass="action-like">
              {`${likeCount.toLocaleString('en-us')} ${likeCount <= 1 ? 'like' : 'likes'}`}
            </BodyText>
          </div>
          <div className={styles.shareViaEmail} onClick={() => setVisible(true)}>
            <ShareViaEmailIcon className={`${styles.actionIcon} ${styles.shareViaEmail_icon}`} />
            <BodyText level={6} fontFamily="Roboto">
              Share via Email
            </BodyText>
          </div>
        </div>
        {visible && (
          <ShareViaEmail visible={visible} setVisible={setVisible} productData={product.brand} />
        )}
      </div>
    </Col>
  );
};

export default PhotoUpload;

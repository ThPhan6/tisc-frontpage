import React, { CSSProperties, useEffect, useState } from 'react';
import Lightbox from 'react-image-lightbox';

import { IMAGE_ACCEPT_TYPES } from '@/constants/util';
import { Col, Row, message } from 'antd';
import Upload, { UploadProps } from 'antd/lib/upload/Upload';
import { UploadFile } from 'antd/lib/upload/interface';

import { ReactComponent as UploadIcon } from '@/assets/icons/action-upload-icon.svg';
import { ReactComponent as AddMoreIcon } from '@/assets/icons/circle-plus-48.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/trash-icon-12.svg';

import { useScreen } from '@/helper/common';
import { useCheckPermission } from '@/helper/hook';
import { getBase64, showImageUrl } from '@/helper/utils';

import SmallIconButton from '@/components/Button/SmallIconButton';
import { BodyText } from '@/components/Typography';

import styles from './CollectionGallery.less';

type CollectionGalleryProps = {
  data: string[];
  onChangeImages: (images: any) => void;
  forceUpload?: boolean;
  containerStyles?: CSSProperties;
};
const CollectionGallery: React.FC<CollectionGalleryProps> = (props) => {
  const isTablet = useScreen().isTablet;
  const [images, setImages] = useState<string[]>([]);
  const [imageBox, setImageBox] = useState<{ index: number; isOpen: boolean }>({
    index: 0,
    isOpen: false,
  });

  useEffect(() => {
    if (props.data?.length) {
      setImages(props.data);
    }
  }, [JSON.stringify(props.data)]);

  useEffect(() => {
    props.onChangeImages(images);
  }, [images]);

  const isTiscUser = useCheckPermission(['TISC Admin', 'Consultant Team']);
  const isEditable = (!isTablet && isTiscUser) || props.forceUpload;
  const emptyImages = isEditable
    ? [null, null, null, null, null]
    : [null, null, null, null, null, null];
  const handleLoadPhoto = async (file: UploadFile<any>) => {
    const imageBase64 = await getBase64(file.originFileObj);
    setImages((pre: any) => pre.concat([imageBase64]));
  };
  useEffect(() => {
    props.onChangeImages(images);
  }, [images]);
  const uploadProps: UploadProps = {
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
      const totalImageCount = images.length + fileList.length;
      const maxImageAllow = 5;

      if (totalImageCount > maxImageAllow) {
        message.error(`Maximum ${maxImageAllow} images are allowed`);
        return false;
      }

      return true;
    },
    showUploadList: false,
    disabled: !isEditable,
    className: `${styles.uploadZone} ${isEditable ? '' : styles.noBorder} ${
      !isEditable && images?.length < 2 ? styles.noPadding : ''
    }`,
  };
  const toLargeImagePath = (smallPath: string) => {
    return smallPath.replace('-s.webp', '-l.webp');
  };
  const renderImageLightBox = () => {
    const curImages: string[] = images;

    return curImages[0] && imageBox.isOpen ? (
      <Lightbox
        mainSrc={showImageUrl(toLargeImagePath(curImages[imageBox.index]))}
        nextSrc={showImageUrl(toLargeImagePath(curImages[(imageBox.index + 1) % curImages.length]))}
        prevSrc={showImageUrl(
          toLargeImagePath(curImages[(imageBox.index + curImages.length - 1) % curImages.length]),
        )}
        onCloseRequest={() => setImageBox({ index: 0, isOpen: false })}
        animationDuration={200}
        onMovePrevRequest={() =>
          setImageBox((prevState) => ({
            ...prevState,
            index: (prevState.index + curImages.length - 1) % curImages.length,
          }))
        }
        onMoveNextRequest={() =>
          setImageBox((prevState) => ({
            ...prevState,
            index: (prevState.index + 1) % curImages.length,
          }))
        }
      />
    ) : null;
  };

  return (
    <div style={{ padding: isTiscUser || images[0] ? 16 : 0, ...props.containerStyles }}>
      <Row className={styles.imagesContainer} gutter={16}>
        {images.map((image: string, index: number) => (
          <Col span={4} key={index} className={`image-card-${index}`}>
            <div
              style={{
                width: '100%',
                position: 'relative',
                paddingTop: '100%',
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setImageBox({
                  index: index,
                  isOpen: true,
                });
              }}
            >
              <div
                className={`${styles.filePreview} file-preview${
                  !isEditable ? styles.lightBorder : ''
                }`}
              >
                <img
                  src={showImageUrl(image)}
                  onClick={() => {
                    setImageBox({
                      index: 0,
                      isOpen: true,
                    });
                  }}
                />
                {isEditable ? (
                  <div className={`${styles.subPhotoAction} sub-photo-action`}>
                    <SmallIconButton
                      icon={<DeleteIcon />}
                      className="delete-button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setImages((pre: any) =>
                          pre.filter((item: any, imageIndex: number) => imageIndex !== index),
                        );
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </Col>
        ))}

        {emptyImages.slice(0, emptyImages.length - images.length).map(() => {
          return <Col span={4} className="empty-image"></Col>;
        })}
        {isEditable && (
          <Col span={4}>
            <div
              style={{
                width: !props.forceUpload ? '100%' : '120px',
                height: !props.forceUpload ? '0' : '120px',
                position: 'relative',
                paddingTop: '100%',
              }}
            >
              <Upload {...uploadProps}>
                {props.forceUpload ? (
                  props.data.length > 0 ? (
                    <div></div>
                  ) : (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '7px',
                        right: '20px',
                        background: '#E6E6E6',
                        width: 120,
                        height: 120,
                      }}
                    >
                      <>
                        <BodyText
                          level={3}
                          style={{ textAlign: 'center', margin: '16px 0 44px 0' }}
                        >
                          Image
                        </BodyText>
                        <div
                          style={{
                            margin: '0 34px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                          }}
                        >
                          <SmallIconButton
                            className="bg-white"
                            icon={<UploadIcon />}
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          />
                          <SmallIconButton
                            className="bg-white"
                            icon={<DeleteIcon />}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          />
                        </div>
                      </>
                    </div>
                  )
                ) : (
                  <div className={styles.addMorePhotocontent}>
                    <BodyText level={6} fontFamily="Roboto" style={{ paddingBottom: 16 }}>
                      Add more images
                    </BodyText>
                    <AddMoreIcon />
                    <BodyText level={6} fontFamily="Roboto" style={{ paddingTop: 16 }}>
                      (max.5)
                    </BodyText>
                  </div>
                )}
              </Upload>
            </div>
          </Col>
        )}
      </Row>
      {renderImageLightBox()}
    </div>
  );
};

export default CollectionGallery;

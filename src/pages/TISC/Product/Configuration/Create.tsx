import React, { useState } from 'react';
import { TableHeader } from '@/components/Table/TableHeader';
import { BodyText } from '@/components/Typography';
import ProductPlaceHolderImage from '@/assets/images/product-placeholder.png';
import { ReactComponent as UploadIcon } from '@/assets/icons/action-upload-icon.svg';
import { ReactComponent as AddMoreIcon } from '@/assets/icons/circle-plus-48.svg';
import SmallIconButton from '@/components/Button/SmallIconButton';
import { CustomInput } from '@/components/Form/CustomInput';
import { Row, Col, message } from 'antd';
import { getBase64 } from '@/helper/utils';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { Upload } from 'antd';
import { map } from 'lodash';

import styles from './styles/details.less';

interface IPhotoData {
  base64?: string;
  file: RcFile;
}
const ProductConfigurationCreate: React.FC = () => {
  const [photos, setPhotos] = useState<IPhotoData[]>([]);
  const [photoNames, setPhotoNames] = useState({
    keyword1: '',
    keyword2: '',
    keyword3: '',
    keyword4: '',
  });

  const handleLoadPhoto = async (
    file: UploadFile<any>,
    type: 'primary' | 'secondary' = 'primary',
  ) => {
    const base64 = await getBase64(file.originFileObj);
    setPhotos((prevState) => {
      const uploadedFile = file.originFileObj as RcFile;
      if (type === 'primary') {
        return [
          {
            base64,
            file: uploadedFile,
          },
          ...prevState,
        ];
      }
      return [
        ...prevState,
        {
          base64,
          file: uploadedFile,
        },
      ];
    });
  };

  const primaryProps: UploadProps = {
    name: 'file',
    accept: '.png,.jpeg,.webp,.svg,.jpg',
    multiple: true,
    onChange: async (info) => {
      const { file, event } = info;
      if (event?.percent === 100) {
        handleLoadPhoto(file);
      }
    },
    beforeUpload: (_file, fileList) => {
      if (photos.length + fileList.length > 9) {
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
        handleLoadPhoto(file, 'secondary');
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
    const newPhotos = photos.filter((_photo, key) => {
      return index !== key;
    });
    setPhotos(newPhotos);
  };

  return (
    <Row gutter={8}>
      <Col span={24}>
        <TableHeader title={'CATEGORY'} />
      </Col>
      <Col span={12} className={styles.productContent}>
        <div className={styles.productImageWrapper}>
          <Upload.Dragger {...primaryProps}>
            <div className={styles.uploadZoneContent}>
              {photos[0]?.base64 ? (
                <img src={photos[0]?.base64} className={styles.primaryPhoto} />
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
                  icon={<UploadIcon />}
                  onClick={(e) => deletePhoto(e, 0)}
                  className={styles.actionIcon}
                />
              </div>
            </div>
          </Upload.Dragger>

          <Row className={styles.photoList} gutter={8}>
            <Col span={18}>
              <Row gutter={8} className={styles.listWrapper}>
                {photos
                  .filter((_item, index) => index !== 0)
                  .map((item, key) => (
                    <Col span={8} key={key}>
                      <div className={styles.fileItem}>
                        <div className={styles.filePreview}>
                          <img src={item.base64 ? item.base64 : ProductPlaceHolderImage} />
                          <div className={styles.subPhotoAction}>
                            <SmallIconButton
                              icon={<UploadIcon />}
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
              SileStone
            </BodyText>
            {map(photoNames, (value, name) => (
              <CustomInput
                key={name}
                placeholder={name}
                autoWidth
                defaultWidth={55}
                value={value}
                onChange={(e) =>
                  setPhotoNames({
                    ...photoNames,
                    [name]: e.target.value,
                  })
                }
              />
            ))}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ProductConfigurationCreate;

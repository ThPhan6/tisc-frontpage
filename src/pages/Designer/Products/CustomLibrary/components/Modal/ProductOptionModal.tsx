import { FC, useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { LOGO_SIZE_LIMIT } from '@/constants/util';
import { Checkbox, Modal, Upload, UploadProps, message } from 'antd';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove.svg';
import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';
import { ReactComponent as AddTagIcon } from '@/assets/icons/square-plus-icon.svg';
import PlaceHolderImage from '@/assets/images/product-placeholder.png';

import { useBoolean } from '@/helper/hook';
import { getBase64, showImageUrl } from '@/helper/utils';

import { ProductOptionContentProps, ProductOptionProps } from '../../types';

import CustomButton from '@/components/Button';
import { CustomInput } from '@/components/Form/CustomInput';
import { MainTitle, RobotoBodyText } from '@/components/Typography';

import styles from './ProductOptionModal.less';

const DEFAULT_CONTENT: ProductOptionContentProps = {
  id: '',
  description: '',
  product_id: '',
  image: '',
};

const DEFAULT_STATE: ProductOptionProps = {
  id: '',
  use_image: false,
  tag: '',
  contents: [],
};

type FieldName = keyof ProductOptionContentProps;

interface ProductOptionModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const ProductOptionModal: FC<ProductOptionModalProps> = ({ visible, setVisible }) => {
  const submitButtonStatus = useBoolean(false);
  const loadedData = useBoolean(false);

  const [data, setData] = useState<ProductOptionProps>(DEFAULT_STATE);

  const [showImage, setShowImage] = useState<boolean | undefined>(undefined);

  const [fileInput, setFileInput] = useState<any>();
  const [currentLogo, setCurrentLogo] = useState<string>(PlaceHolderImage);

  useEffect(() => {
    setData({
      id: '1',
      use_image: true,
      tag: 'tag 1',
      contents: [
        {
          id: '2',
          description: 'd1',
          product_id: 'p1',
          image: '',
        },
        { id: '3', description: 'd3', product_id: 'p3', image: '' },
      ],
    });
  }, []);

  useEffect(() => {
    if (showImage !== data.use_image) {
      setTimeout(() => {
        setShowImage(data.use_image);
        loadedData.setValue(true);
      }, 500);
    }
  }, []);

  const onChangeContentData = (filedName: FieldName, fieldValue: any) => {
    setData((prevState) => ({
      ...prevState,
      [filedName]: fieldValue,
    }));
  };

  const handleAddOption = () => {
    setData((prevState) => ({
      ...prevState,
      content: [...data.contents, DEFAULT_CONTENT],
    }));
  };

  const handleShowImage = () => {
    setShowImage(!showImage);
    setData((prevState) => ({
      ...prevState,
      use_image: showImage ?? false,
    }));
  };

  const handleDelete = (id: number | string) => {
    const newContent = data.contents.filter((content) => content.id !== id);
    setData((prevState) => ({
      ...prevState,
      contents: newContent,
    }));
  };

  const handleCancel = () => {
    setData(DEFAULT_STATE);
    setVisible(false);
  };

  const handleSave = () => {};

  const handleUpdateLogo = () => {
    const formData: any = new FormData();
    formData.append('logo', fileInput);
  };
  const props: UploadProps = {
    beforeUpload: (file) => {
      if (file.size > LOGO_SIZE_LIMIT) {
        message.error(MESSAGE_ERROR.reachLogoSizeLimit);
        return false;
      }
      setFileInput(file);
      getBase64(file)
        .then((base64Image) => {
          setCurrentLogo(base64Image); // only set to show, haven't added to data
        })
        .catch(() => {
          message.error('Upload Failed');
        });
      return true;
    },
  };
  useEffect(() => {
    if (fileInput) {
      handleUpdateLogo();
    }
  }, [fileInput]);

  const renderFooterButton = () => {
    return (
      <div className="flex-end">
        <CustomButton
          size="small"
          variant="primary"
          properties="rounded"
          buttonClass="done-btn"
          onClick={handleCancel}>
          Cancel
        </CustomButton>
        {submitButtonStatus.value ? (
          <CustomButton
            size="small"
            variant="primary"
            properties="rounded"
            buttonClass={styles.submitButton}
            icon={<CheckSuccessIcon />}
          />
        ) : (
          <CustomButton
            size="small"
            variant="primary"
            properties="rounded"
            buttonClass="done-btn"
            onClick={handleSave}>
            Save
          </CustomButton>
        )}
      </div>
    );
  };

  if (!loadedData.value) {
    return null;
  }

  return (
    <Modal
      title="ENTRY FORM"
      visible={visible}
      onCancel={() => setVisible(false)}
      className={styles.modalContainer}
      centered
      width={576}
      footer={renderFooterButton()}>
      <div className="flex-between">
        <div className={`flex-start ${styles.optionHeader}`}>
          <MainTitle level={3}>Add Option</MainTitle>
          <Checkbox className={styles.imageBtn} checked={showImage} onChange={handleShowImage}>
            <RobotoBodyText level={6}>Image</RobotoBodyText>
          </Checkbox>
          <RobotoBodyText level={6}>TAG</RobotoBodyText>
          <CustomInput
            placeholder="type tag"
            value={data.tag}
            onChange={(e) => {
              setData((prevState) => ({ ...prevState, tag: e.target.value }));
            }}
          />
        </div>
        <AddTagIcon className="cursor-pointer" onClick={handleAddOption} />
      </div>

      {data.contents.map((content, index) => (
        <div className={styles.optionContent} key={content.id || index}>
          <div className={`flex-start ${styles.flexSpace}`}>
            {showImage ? (
              <div className={styles.image}>
                <Upload maxCount={1} showUploadList={false} {...props} accept=".png">
                  <img
                    src={showImageUrl(content.image || currentLogo)}
                    onClick={handleUpdateLogo}
                  />
                </Upload>
              </div>
            ) : null}
            <CustomInput
              containerClass={styles.paddingLeftNone}
              placeholder="type option description"
              value={content.description}
              onChange={(e) => onChangeContentData('description', e.target.value)}
            />
          </div>
          <div className="flex-start">
            <RobotoBodyText level={6}>Product ID:</RobotoBodyText>
            <div className="flex-between">
              <CustomInput
                placeholder="type here"
                value={content.product_id}
                onChange={(e) => onChangeContentData('product_id', e.target.value)}
              />
              <DeleteIcon className={styles.deleteIcon} onClick={() => handleDelete(content.id)} />
            </div>
          </div>
        </div>
      ))}
    </Modal>
  );
};

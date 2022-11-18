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
import { uniqueId } from 'lodash';

import { ProductOptionContentProps, ProductOptionProps } from '../../types';
import store, { useAppSelector } from '@/reducers';

import CustomButton from '@/components/Button';
import { CustomInput } from '@/components/Form/CustomInput';
import { MainTitle, RobotoBodyText } from '@/components/Typography';

import { setCustomProductDetail } from '../../slice';
import styles from './ProductOptionModal.less';

const DEFAULT_CONTENT: ProductOptionContentProps = {
  id: '',
  description: '',
  product_id: '',
  image: '',
};

type FieldName = keyof ProductOptionContentProps;

interface ProductOptionModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  data: ProductOptionProps;
  optionIndex: number;
}

export const ProductOptionModal: FC<ProductOptionModalProps> = ({
  visible,
  setVisible,
  data,
  optionIndex,
}) => {
  const options = useAppSelector((state) => state.customProduct.details.options);
  const submitButtonStatus = useBoolean(false);

  const [fileInput, setFileInput] = useState<any>();
  const [currentLogo, setCurrentLogo] = useState<string>(PlaceHolderImage);

  console.log('data', data);

  // useEffect(() => {
  //   if (showImage !== data.use_image) {
  //     setTimeout(() => {
  //       setShowImage(data.use_image);
  //       loadedData.setValue(true);
  //     }, 500);
  //   }
  // }, []);

  const onChangeTagContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOption = [...options];
    newOption[optionIndex] = { ...newOption[optionIndex], tag: e.target.value };

    store.dispatch(
      setCustomProductDetail({
        options: newOption,
      }),
    );
  };

  const onChangeContentItem =
    (filedName: FieldName, itemIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newOption = [...options];
      const newItems = [...newOption[optionIndex].items];

      newItems[itemIndex] = {
        ...newItems[itemIndex],
        [filedName]: e.target.value,
      };

      newOption[optionIndex] = { ...newOption[optionIndex], items: [...newItems] };

      store.dispatch(
        setCustomProductDetail({
          options: newOption,
        }),
      );
    };

  const handleAddOption = () => {
    const randomID = uniqueId();
    const newOption = [...options];
    const newItem = [...data.items, { ...DEFAULT_CONTENT, id: randomID }];
    newOption[optionIndex] = { ...newOption[optionIndex], items: newItem };

    store.dispatch(
      setCustomProductDetail({
        options: newOption,
      }),
    );
  };

  const handleShowImage = (checked: boolean) => {
    const newOption = [...options];
    newOption[optionIndex] = { ...newOption[optionIndex], use_image: checked };

    store.dispatch(
      setCustomProductDetail({
        options: newOption,
      }),
    );
  };

  const handleDelete = (id: number | string) => {
    const newOption = [...options];
    const newContent = data.items.filter((item) => item.id !== id);
    newOption[optionIndex] = { ...newOption[optionIndex], items: newContent };

    store.dispatch(
      setCustomProductDetail({
        options: newOption,
      }),
    );
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSave = () => {
    const newOption = [...options];

    console.log('newOption', newOption);

    // const newContent = data.items.filter((item) => item.id !== id);
    // newOption[optionIndex] = { ...newOption[optionIndex], items: newContent };

    store.dispatch(
      setCustomProductDetail({
        options: newOption,
      }),
    );
  };

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
      return false;
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
          <Checkbox
            className={styles.imageBtn}
            checked={data.use_image}
            onChange={(e) => handleShowImage(e.target.checked)}>
            <RobotoBodyText level={6}>Image</RobotoBodyText>
          </Checkbox>
          <RobotoBodyText level={6}>TAG</RobotoBodyText>
          <CustomInput placeholder="type tag" value={data.tag} onChange={onChangeTagContent} />
        </div>
        <AddTagIcon className="cursor-pointer" onClick={handleAddOption} />
      </div>

      {data.items.map((item, itemIndex) => (
        <div className={styles.optionContent} key={item.id || itemIndex}>
          <div className={`flex-start ${styles.flexSpace}`}>
            {data.use_image ? (
              <div className={styles.image}>
                <Upload maxCount={1} showUploadList={false} {...props} accept=".png">
                  <img src={showImageUrl(item.image || currentLogo)} onClick={handleUpdateLogo} />
                </Upload>
              </div>
            ) : null}
            <CustomInput
              containerClass={styles.paddingLeftNone}
              placeholder="type option description"
              value={item.description}
              onChange={onChangeContentItem('description', itemIndex)}
            />
          </div>
          <div className="flex-start">
            <RobotoBodyText level={6}>Product ID:</RobotoBodyText>
            <div className="flex-between">
              <CustomInput
                placeholder="type here"
                value={item.product_id}
                onChange={onChangeContentItem('product_id', itemIndex)}
              />
              <DeleteIcon className={styles.deleteIcon} onClick={() => handleDelete(item.id)} />
            </div>
          </div>
        </div>
      ))}
    </Modal>
  );
};

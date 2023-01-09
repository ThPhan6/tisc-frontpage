import { FC, useEffect, useState } from 'react';

import { Checkbox, Col, Row, message } from 'antd';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove.svg';
import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { ReactComponent as AddTagIcon } from '@/assets/icons/square-plus-icon.svg';

import { useBoolean } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import { cloneDeep } from 'lodash';

import { ProductOptionContentProps, ProductOptionProps } from '../../types';
import store from '@/reducers';

import CustomButton from '@/components/Button';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle, RobotoBodyText } from '@/components/Typography';
import { ImageUpload } from '@/pages/TISC/Product/Basis/Option/components/OptionItem';

import { updateCustomProductOption } from '../../slice';
import styles from './ProductOptionModal.less';

const DEFAULT_CONTENT: ProductOptionContentProps = {
  id: '',
  description: '',
  product_id: '',
  image: '',
};

export const DEFAULT_PRODUCT_OPTION: ProductOptionProps = {
  id: '',
  items: [],
  tag: '',
  title: '',
  use_image: false,
};

type FieldName = keyof ProductOptionContentProps;

interface ProductOptionModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  option: ProductOptionProps;
  optionIndex: number;
}

export const ProductOptionModal: FC<ProductOptionModalProps> = ({
  visible,
  setVisible,
  option,
  optionIndex,
}) => {
  const submitButtonStatus = useBoolean(false);

  const [optionState, setOptionState] = useState<ProductOptionProps>(DEFAULT_PRODUCT_OPTION);

  useEffect(() => {
    if (option) {
      setOptionState(option);
    }
  }, [option]);

  const onChangeTagContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptionState({
      ...optionState,
      tag: e.target.value,
    });
  };

  const onChangeContentItem =
    (filedName: FieldName, itemIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newItems = cloneDeep(optionState.items);

      newItems[itemIndex] = {
        ...newItems[itemIndex],
        [filedName]: e.target.value,
      };

      setOptionState({
        ...optionState,
        items: newItems,
      });
    };

  const handleAddOption = () => {
    setOptionState({
      ...optionState,
      items: [...optionState.items, DEFAULT_CONTENT],
    });
  };

  const onChangeUseImage = (checked: boolean) => {
    setOptionState({
      ...optionState,
      use_image: checked,
    });
  };

  const onChangeImage = (optIndex: number) => (image64: string) => {
    const newItems = cloneDeep(optionState.items);
    newItems[optIndex] = {
      ...newItems[optIndex],
      image: image64,
    };

    setOptionState({
      ...optionState,
      items: newItems,
    });
  };

  const handleDelete = (index: number) => {
    const newItems = cloneDeep(optionState.items);
    newItems.splice(index, 1);

    setOptionState({
      ...optionState,
      items: newItems,
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSave = () => {
    switch (true) {
      case optionState.items.length === 0:
        message.error('Required at least one item');
        return;
      case optionState.items.some((el) => !el.description || (optionState.use_image && !el.image)):
        message.error('Item info is required');
        return;
    }

    store.dispatch(updateCustomProductOption({ optionState, optionIndex }));
    setVisible(false);
  };

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
    <CustomModal
      title="ENTRY FORM"
      closeIcon={<CloseIcon />}
      visible={visible}
      onCancel={() => setVisible(false)}
      className={styles.modalContainer}
      centered
      width={576}
      footer={renderFooterButton()}>
      <div className="flex-between" style={{ paddingBottom: 16 }}>
        <div className={`flex-start ${styles.optionHeader}`}>
          <MainTitle level={3}>Add Option</MainTitle>
          <Checkbox
            className={styles.imageBtn}
            checked={optionState.use_image}
            onChange={(e) => onChangeUseImage(e.target.checked)}>
            <RobotoBodyText
              level={5}
              color={optionState.use_image ? 'primary-color-dark' : 'mono-color'}>
              Image
            </RobotoBodyText>
          </Checkbox>
          <RobotoBodyText level={5}>TAG:</RobotoBodyText>
          <CustomInput
            placeholder="type tag"
            value={optionState.tag}
            onChange={onChangeTagContent}
            style={{ padding: 0, paddingLeft: 8 }}
          />
        </div>
        <AddTagIcon className="cursor-pointer" onClick={handleAddOption} />
      </div>

      {optionState.items.map((item, itemIndex) => (
        <Row
          key={item.id || itemIndex}
          className={styles.optionContent}
          style={{
            paddingBottom: optionState.use_image ? 8 : 1,
            marginBottom: optionState.use_image ? 0 : 8,
          }}>
          {optionState.use_image ? (
            <ImageUpload
              onFileChange={onChangeImage(itemIndex)}
              image={item.image ? showImageUrl(item.image) : undefined}
              style={{ border: item.image ? undefined : '1px solid #bfbfbf' }}
            />
          ) : null}

          <Col key={item.id || itemIndex} flex="auto">
            <Row>
              <Col className="flex-start" span={optionState.use_image ? 24 : 12}>
                <CustomInput
                  placeholder="type option description"
                  value={item.description}
                  onChange={onChangeContentItem('description', itemIndex)}
                  style={{ padding: 0 }}
                />
              </Col>
              <Col span={optionState.use_image ? 24 : 12}>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <BodyText level={4}>Product ID:</BodyText>
                  <CustomInput
                    placeholder="type here"
                    value={item.product_id}
                    onChange={onChangeContentItem('product_id', itemIndex)}
                    style={{ padding: 0, marginLeft: 8 }}
                  />
                </div>
              </Col>
            </Row>
          </Col>

          <Col flex="34px">
            <div className="flex-end">
              <DeleteIcon className={styles.deleteIcon} onClick={() => handleDelete(itemIndex)} />
            </div>
          </Col>
        </Row>
      ))}
    </CustomModal>
  );
};

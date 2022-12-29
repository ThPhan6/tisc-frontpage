import { FC, useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { message } from 'antd';

import {
  createShareViaEmail,
  getSharingGroups,
  getSharingPurposes,
} from '@/features/product/services';
import { useBoolean } from '@/helper/hook';
import { getEmailMessageError, getEmailMessageErrorType } from '@/helper/utils';

import { RadioValue } from '../CustomRadio/types';
import { ProductItem, ProductItemValue } from '@/features/product/types';

import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import Popover from '@/components/Modal/Popover';

import BrandProductBasicHeader from '../BrandProductBasicHeader';
import CollapseRadioFormGroup from '../CustomRadio/CollapseRadioFormGroup';
import styles from './index.less';

export interface ShareViaEmailForm {
  product_id: string;
  sharing_group: string;
  sharing_purpose: string;
  to_email: string;
  title: string;
  message: string;
  custom_product?: boolean;
}

interface ShareViaEmailProps {
  product: ProductItem;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  isCustomProduct?: boolean;
}

type FieldName = keyof ShareViaEmailForm;

const DEFAULT_STATE = {
  product_id: '',
  sharing_group: '',
  sharing_purpose: '',
  to_email: '',
  title: '',
  message: '',
};

const ShareViaEmail: FC<ShareViaEmailProps> = ({
  product,
  visible,
  setVisible,
  isCustomProduct,
}) => {
  const submitButtonStatus = useBoolean();
  const [shareViaEmailData, setShareViaEmailData] = useState<ShareViaEmailForm>({
    ...DEFAULT_STATE,
    product_id: product.id,
    custom_product: isCustomProduct,
  });
  const [sharingGroup, setSharingGroup] = useState<ProductItemValue[]>([]);
  const [sharingPurpose, setSharingPurpose] = useState<ProductItemValue[]>([]);

  useEffect(() => {
    getSharingGroups().then((data) => {
      if (data) {
        setSharingGroup(data);
      }
    });

    getSharingPurposes().then((data) => {
      if (data) {
        setSharingPurpose(data);
      }
    });
  }, [visible]);

  // format data
  const sharingGroupLabel = sharingGroup.find(
    (item) => item.id === shareViaEmailData.sharing_group,
  ) ?? {
    name: shareViaEmailData.sharing_group,
    id: '',
  };
  const sharingPurposeLabel = sharingPurpose.find(
    (item) => item.id === shareViaEmailData.sharing_purpose,
  ) ?? {
    name: shareViaEmailData.sharing_purpose,
    id: '',
  };

  const onChangeData = (fieldName: FieldName, fieldValue: any) => {
    setShareViaEmailData({
      ...shareViaEmailData,
      [fieldName]: fieldValue,
    });
  };

  const handleOnChangeRadioForm = (fieldKey: FieldName, radioValue: RadioValue) => {
    onChangeData(fieldKey, radioValue.value === 'other' ? radioValue.label : radioValue.value);
  };

  const getOptionData = (data: ProductItemValue[]) =>
    data.map((item) => ({ label: item.name, value: item.id }));

  const handleSubmit = () => {
    /// check email
    const invalidEmail = getEmailMessageError(
      shareViaEmailData.to_email,
      MESSAGE_ERROR.EMAIL_INVALID,
    );

    if (invalidEmail) {
      message.error(invalidEmail);
      return;
    }

    createShareViaEmail(shareViaEmailData).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);

        setTimeout(() => {
          submitButtonStatus.setValue(false);

          // clear data after submitted
          setShareViaEmailData({
            ...DEFAULT_STATE,
            product_id: product.id,
            custom_product: isCustomProduct,
          });

          // close popup
          setVisible(false);
        }, 200);
      }
    });
  };

  return (
    <Popover
      title="Share Via Email"
      visible={visible}
      setVisible={setVisible}
      submitButtonStatus={submitButtonStatus.value}
      onFormSubmit={handleSubmit}>
      <BrandProductBasicHeader
        image={product.images?.[0]}
        logo={product.brand?.logo}
        text_1={product.brand?.name}
        text_2={product.name}
        text_3={product.description}
        customClass={styles.header}
      />

      {/* Sharing Group */}
      <CollapseRadioFormGroup
        label="Sharing Group"
        groupType="share-via-email"
        groupIndex={1}
        checked={shareViaEmailData.sharing_group}
        placeholder={sharingGroupLabel.name}
        otherInput
        clearOtherInput={submitButtonStatus.value}
        options={getOptionData(sharingGroup)}
        onChange={(radioValue) => handleOnChangeRadioForm('sharing_group', radioValue)}
      />
      {/* Sharing Purpose */}
      <CollapseRadioFormGroup
        label="Sharing Purpose"
        groupType="share-via-email"
        groupIndex={2}
        checked={shareViaEmailData.sharing_purpose}
        placeholder={sharingPurposeLabel.name}
        otherInput
        clearOtherInput={submitButtonStatus.value}
        options={getOptionData(sharingPurpose)}
        onChange={(radioValue) => handleOnChangeRadioForm('sharing_purpose', radioValue)}
      />
      {/* Email To */}
      <InputGroup
        label="Email To"
        required
        deleteIcon
        fontLevel={3}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        placeholder="type receiver email address"
        value={shareViaEmailData.to_email}
        onChange={(e) => {
          onChangeData('to_email', e.target.value);
        }}
        onDelete={() => onChangeData('to_email', '')}
        message={getEmailMessageError(shareViaEmailData.to_email, MESSAGE_ERROR.EMAIL_INVALID)}
        messageType={getEmailMessageErrorType(shareViaEmailData.to_email, 'error', 'normal')}
      />
      {/* Title */}
      <InputGroup
        label="Title"
        required
        deleteIcon
        fontLevel={3}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        placeholder="type message title"
        value={shareViaEmailData.title}
        onChange={(e) => {
          onChangeData('title', e.target.value);
        }}
        onDelete={() => onChangeData('title', '')}
      />
      {/* Message */}
      <FormGroup label="Message" required layout="vertical">
        <CustomTextArea
          className={styles.message}
          maxLength={250}
          showCount
          placeholder="type message here..."
          borderBottomColor="mono-medium"
          boxShadow
          onChange={(e) => onChangeData('message', e.target.value)}
          value={shareViaEmailData.message}
        />
      </FormGroup>
    </Popover>
  );
};

export default ShareViaEmail;

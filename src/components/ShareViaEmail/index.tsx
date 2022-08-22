import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import Popover from '@/components/Modal/Popover';
import { MESSAGE_ERROR } from '@/constants/message';
import {
  createShareViaEmail,
  getSharingGroups,
  getSharingPurposes,
} from '@/features/product/services';
import { ProductItem, ProductItemValue } from '@/features/product/types';
import { emailMessageError, emailMessageErrorType } from '@/helper/utils';
import { FC, useEffect, useState } from 'react';
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
}

interface ShareViaEmailProps {
  product: ProductItem;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

type FieldName = keyof ShareViaEmailForm;

const ShareViaEmail: FC<ShareViaEmailProps> = ({ product, visible, setVisible }) => {
  const [shareViaEmailData, setShareViaEmailData] = useState<ShareViaEmailForm>({
    product_id: product.id,
    sharing_group: '',
    sharing_purpose: '',
    to_email: '',
    title: '',
    message: '',
  });

  // for Sharing Group
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
  }, []);

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

  const handleSubmit = () => {
    createShareViaEmail(shareViaEmailData);
    // .then((isSuccess) => {
    //   if (isSuccess) {
    //     setVisible(false);
    //   }
    // });
  };

  return (
    <Popover
      title="Share Via Email"
      visible={visible}
      setVisible={setVisible}
      onFormSubmit={handleSubmit}
    >
      <BrandProductBasicHeader
        image={product.images?.[0] || product.image}
        logo={product.brand?.logo}
        text_1={product.brand_name}
        text_2={product.name}
        text_3={product.description}
        customClass={styles.header}
      />

      {/* Sharing Group */}
      <CollapseRadioFormGroup
        label="Sharing Group"
        checked={shareViaEmailData.sharing_group}
        placeholder={sharingGroupLabel.name}
        otherInput
        optionData={sharingGroup.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        })}
        onChange={(radioValue) => {
          if (radioValue.value === 'other') {
            onChangeData('sharing_group', radioValue.label);
          } else {
            onChangeData('sharing_group', radioValue.value);
          }
        }}
      />

      {/* Sharing Purpose */}
      <CollapseRadioFormGroup
        label="Sharing Purpose"
        checked={shareViaEmailData.sharing_purpose}
        placeholder={sharingPurposeLabel.name}
        otherInput
        optionData={sharingPurpose.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        })}
        onChange={(radioValue) => {
          if (radioValue.value === 'other') {
            onChangeData('sharing_purpose', radioValue.label);
          } else {
            onChangeData('sharing_purpose', radioValue.value);
          }
        }}
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
        message={emailMessageError(shareViaEmailData.to_email, MESSAGE_ERROR.EMAIL_UNVALID)}
        messageType={emailMessageErrorType(shareViaEmailData.to_email, 'error', 'normal')}
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

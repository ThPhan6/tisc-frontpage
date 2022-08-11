import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import Popover from '@/components/Modal/Popover';
import { MESSAGE_ERROR } from '@/constants/message';
import { validateEmail } from '@/helper/utils';
import { useAppSelector } from '@/reducers';
import { getDepartmentList } from '@/services';
import { ShareViaEmailForm } from '@/types/share-via-email.type';
// import { validateEmail } from '@/helper/utils';
import { FC, useEffect, useState } from 'react';
import BrandProductBasicHeader from '../BrandProductBasicHeader';
import CollapseRadioFormGroup from '../CustomRadio/CollapseRadioFormGroup';
import styles from './index.less';

interface ShareViaEmailProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

interface SharingGroup {
  id: string;
  name: string;
}

const DEFAULT_SHAREVIAEMAIL_VALUE: ShareViaEmailForm = {
  image: '',
  logo: '',
  sharing_group_id: '',
  sharing_purpose_id: '',
  email_to: '',
  title: '',
  message: '',
};
type FieldName = keyof ShareViaEmailForm;

const ShareViaEmail: FC<ShareViaEmailProps> = ({ visible, setVisible }) => {
  const brand = useAppSelector((state) => state.product);
  console.log('productData', brand);

  const [shareViaEmailData, setShareViaEmailData] = useState<ShareViaEmailForm>(
    DEFAULT_SHAREVIAEMAIL_VALUE,
  );

  // for Sharing Group
  const [sharingGroup, setSharingGroup] = useState<SharingGroup[]>([]);
  const [sharingPurpose, setSharingPurpose] = useState<SharingGroup[]>([]);

  // validate email Address
  const isValidEmail = validateEmail(shareViaEmailData.email_to);

  useEffect(() => {
    getDepartmentList().then((res) => {
      if (res) {
        setSharingGroup(res);
        setSharingPurpose(res);
      }
    });
  }, []);

  // format data
  const sharingGroupLabel = sharingGroup.find(
    (item) => item.id === shareViaEmailData.sharing_group_id,
  ) ?? {
    name: shareViaEmailData.sharing_group_id,
    id: '',
  };
  const sharingPurposeLabel = sharingPurpose.find(
    (item) => item.id === shareViaEmailData.sharing_purpose_id,
  ) ?? {
    name: shareViaEmailData.sharing_purpose_id,
    id: '',
  };

  const onChangeData = (fieldName: FieldName, fieldValue: any) => {
    setShareViaEmailData({
      ...shareViaEmailData,
      [fieldName]: fieldValue,
    });
  };

  return (
    <Popover title="Share Via Email" visible={visible} setVisible={setVisible}>
      <BrandProductBasicHeader
        image={shareViaEmailData.image}
        logo={shareViaEmailData.logo}
        text_1="Brand company name"
        text_2="Collection/Series name"
        text_3="Product/item description"
        customClass={styles.header}
      />

      {/* Sharing Group */}
      <CollapseRadioFormGroup
        label="Sharing Group"
        checked={shareViaEmailData.sharing_group_id}
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
            onChangeData('sharing_group_id', radioValue.label);
          } else {
            onChangeData('sharing_group_id', radioValue.value);
          }
        }}
      />

      {/* Sharing Purpose */}
      <CollapseRadioFormGroup
        label="Sharing Purpose"
        checked={shareViaEmailData.sharing_purpose_id}
        placeholder={sharingPurposeLabel.name}
        otherInput
        optionData={sharingGroup.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        })}
        onChange={(radioValue) => {
          if (radioValue.value === 'other') {
            onChangeData('sharing_purpose_id', radioValue.label);
          } else {
            onChangeData('sharing_purpose_id', radioValue.value);
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
        value={shareViaEmailData.email_to}
        onChange={(e) => {
          onChangeData('email_to', e.target.value);
        }}
        onDelete={() => onChangeData('email_to', '')}
        message={
          shareViaEmailData.email_to !== ''
            ? isValidEmail
              ? ''
              : MESSAGE_ERROR.EMAIL_UNVALID
            : undefined
        }
        messageType={
          shareViaEmailData.email_to !== '' ? (isValidEmail ? 'normal' : 'error') : undefined
        }
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

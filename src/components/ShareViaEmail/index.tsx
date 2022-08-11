// import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';
import { useAppSelector } from '@/reducers';
import { getDepartmentList } from '@/services';
// import { ShareViaEmailForm } from '@/types/share-via-email.type';
// import { validateEmail } from '@/helper/utils';
import { FC, useEffect, useState } from 'react';
import CollapseRadioList from '../CustomRadio/CollapseRadioList';
import styles from './index.less';

interface ShareViaEmailProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export interface SharingGroup {
  id: string;
  name: string;
}

// const DEFAULT_SHAREVIAEMAIL_VALUE: ShareViaEmailForm = {
//   sharing_group_id: '',
//   sharing_purpose_id: '',
//   email_to: '',
//   title: '',
//   message: '',
// };

const ShareViaEmail: FC<ShareViaEmailProps> = ({ visible, setVisible }) => {
  const brand = useAppSelector((state) => state.product);
  console.log('productData', brand);
  // validate email Address
  //   const isValidEmail = validateEmail(data.general_email);

  // const [shareViaEmailData, setShareViaEmailData] = useState<ShareViaEmailForm>(
  //   DEFAULT_SHAREVIAEMAIL_VALUE,
  // );

  const [sharingGroup, setSharingGroup] = useState<SharingGroup[]>([]);

  useEffect(() => {
    getDepartmentList().then((res) => {
      if (res) {
        setSharingGroup(res);
      }
    });
  }, []);

  // format data
  // const sharingGroupLabel = sharingGroup.find(
  //   (department) => department.id === data.department_id,
  // ) ?? {
  //   name: data.department_id,
  //   id: '',
  // };

  // const onChangeData = (fieldName: FieldName, fieldValue: any) => {
  //   setData({
  //     ...data,
  //     [fieldName]: fieldValue,
  //   });
  // };

  return (
    <Popover title="Share Via Email" visible={visible} setVisible={setVisible}>
      <div className={styles.header}>
        <div className={styles.header_detail}>
          <img className={styles.image} />
          <div className={styles.content}>
            <div className={styles.company}>
              <BodyText level={6} fontFamily="Roboto">
                Brand company name
              </BodyText>
              <img className={styles.company_logo} />
            </div>
            <BodyText level={6} fontFamily="Roboto">
              Collection/Series name
            </BodyText>
            <BodyText level={6} fontFamily="Roboto">
              Product/item description
            </BodyText>
          </div>
        </div>
      </div>

      {/* Sharing Group */}
      <FormGroup
        label="Sharing Group"
        required={true}
        layout="vertical"
        // formClass={`${styles.department} ${
        //   sharingGroup.name !== '' ? styles.activeDepartment : ''
        // }`}
        formClass={styles.sharingGroup}
      >
        <CollapseRadioList
          containerClass={styles.radioGroup}
          options={sharingGroup.map((department) => {
            return {
              label: department.name,
              value: department.id,
            };
          })}
          // checked={data.department_id}
          // onChange={(radioValue) => {
          // if (radioValue.value === 'other') {
          //   onChangeData('department_id', radioValue.label);
          // } else {
          //   onChangeData('department_id', radioValue.value);
          // }
          // }}
          // placeholder={sharingGroup.name === '' ? 'select from list' : sharingGroup.name}
          otherInput
        />
      </FormGroup>

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
        // value={data.general_email}
        // onChange={(e) => {
        //   onChangeData('general_email', e.target.value);
        // }}
        // onDelete={() => onChangeData('general_email', '')}
        // message={
        //   data.general_email !== '' ? (isValidEmail ? '' : MESSAGE_ERROR.EMAIL_UNVALID) : undefined
        // }
        // messageType={data.general_email !== '' ? (isValidEmail ? 'normal' : 'error') : undefined}
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
        // value={data.general_email}
        // onChange={(e) => {
        //   onChangeData('general_email', e.target.value);
        // }}
        // onDelete={() => onChangeData('general_email', '')}
        // message={
        //   data.general_email !== '' ? (isValidEmail ? '' : MESSAGE_ERROR.EMAIL_UNVALID) : undefined
        // }
        // messageType={data.general_email !== '' ? (isValidEmail ? 'normal' : 'error') : undefined}
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
          //   onChange={(e) => onChangeData('address', e.target.value)}
          //   value={data.address}
        />
      </FormGroup>
    </Popover>
  );
};

export default ShareViaEmail;

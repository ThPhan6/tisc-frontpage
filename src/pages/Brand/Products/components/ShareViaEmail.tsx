// import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';
// import { validateEmail } from '@/helper/utils';
import { FC } from 'react';
import styles from '../styles/shareViaEmail.less';

interface ShareViaEmailProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  productData: any;
}

const ShareViaEmail: FC<ShareViaEmailProps> = ({ visible, setVisible, productData }) => {
  console.log('productData', productData);
  // validate email Address
  //   const isValidEmail = validateEmail(data.general_email);

  return (
    <Popover title="Share Via Email" visible={visible} setVisible={setVisible}>
      <div className={styles.header}>
        <div className={styles.header_detail}>
          <img className={styles.image} />
          <div className={styles.content}>
            <BodyText level={6}>Brand company name</BodyText>
            <BodyText level={6}>Collection/Series name</BodyText>
            <BodyText level={6}>Product/item description</BodyText>
          </div>
        </div>
        <div className={styles.header_logo}></div>
      </div>

      {/* Sharing Group */}
      {/* <FormGroup
        label="Sharing Group"
        required={true}
        layout="vertical"
        formClass={`${styles.department} ${
          departmentData.name !== '' ? styles.activeDepartment : ''
        }`}
      >
        <CollapseRadioList
          options={departments.map((department) => {
            return {
              label: department.name,
              value: department.id,
            };
          })}
          checked={data.department_id}
          onChange={(radioValue) => {
            if (radioValue.value === 'other') {
              onChangeData('department_id', radioValue.label);
            } else {
              onChangeData('department_id', radioValue.value);
            }
          }}
          placeholder={departmentData.name === '' ? 'select from list' : departmentData.name}
          otherInput
        />
      </FormGroup> */}

      {/* Email To */}
      <InputGroup
        label="Email To"
        required
        deleteIcon
        fontLevel={3}
        // value={data.general_email}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        // onChange={(e) => {
        //   onChangeData('general_email', e.target.value);
        // }}
        // onDelete={() => onChangeData('general_email', '')}
        placeholder="type receiver email address"
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
        // value={data.general_email}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        // onChange={(e) => {
        //   onChangeData('general_email', e.target.value);
        // }}
        // onDelete={() => onChangeData('general_email', '')}
        placeholder="type message title"
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
          //   onChange={(e) => onChangeData('address', e.target.value)}
          //   value={data.address}
          boxShadow
        />
      </FormGroup>
    </Popover>
  );
};

export default ShareViaEmail;

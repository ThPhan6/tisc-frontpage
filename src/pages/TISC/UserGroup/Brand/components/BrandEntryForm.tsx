import React, { FC, useState } from 'react';

import { ReactComponent as InfoIcon } from '@/assets/icons/info-icon.svg';

import { RadioValue } from '@/components/CustomRadio/types';
import { TISCUserGroupBrandForm, entryFormInput } from '@/types';

import { CustomRadio } from '@/components/CustomRadio';
import { EntryFormWrapper } from '@/components/EntryForm';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { Status } from '@/components/Form/Status';
import { BodyText } from '@/components/Typography';

import styles from '../styles/brandEntryForm.less';

interface BrandEntryFormValue {
  onCancel: () => void;
  handleInvite: (userId: string) => void;
  userId?: string;
  onSubmit: (value: TISCUserGroupBrandForm, callBack?: (userId: string) => void) => void;
  submitButtonStatus: boolean;
  AccessLevelDataRole: RadioValue[];
  //   role: 'TISC' | 'BRAND' | 'DESIGNER';
}

const DEFAULT_BRAND = {
  brandname: '',
  firstname: '',
  lastname: '',
  email: '',
  role_id: '',
};

const BrandEntryForm: FC<BrandEntryFormValue> = ({
  onCancel,
  onSubmit,
  handleInvite,
  userId,
  submitButtonStatus,
  AccessLevelDataRole,
  //   role,
}) => {
  // for entry form
  const [data, setData] = useState<TISCUserGroupBrandForm>(DEFAULT_BRAND);

  const onChangeData = (fieldName: entryFormInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevState) => ({
      ...prevState,
      [fieldName]: e.target.value,
    }));
  };
  const handleDeleteData = (fieldName: entryFormInput) => () => {
    setData((prevState) => ({
      ...prevState,
      [fieldName]: '',
    }));
  };

  const handleSubmit = (callBack?: (id: string) => void) => {
    onSubmit(
      {
        brandname: data.brandname?.trim() ?? '',
        firstname: data.firstname?.trim() ?? '',
        lastname: data.lastname?.trim() ?? '',
        email: data.email?.trim() ?? '',
        role_id: data.role_id,
      },
      callBack,
    );
  };

  return (
    <EntryFormWrapper
      handleCancel={onCancel}
      handleSubmit={handleSubmit}
      submitButtonStatus={submitButtonStatus}
      contentClass={styles.contentEntryForm}>
      {/* brand - company name */}
      <InputGroup
        label="Brand / Company Name"
        placeholder="brand name / trademark"
        required
        colorRequired="tertiary"
        deleteIcon
        fontLevel={3}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        value={data.brandname}
        onChange={onChangeData('brandname')}
        onDelete={handleDeleteData('brandname')}
      />
      {/* first name */}
      <InputGroup
        label="First Name"
        placeholder="member first name"
        required
        colorRequired="tertiary"
        deleteIcon
        fontLevel={3}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        value={data.firstname}
        onChange={onChangeData('firstname')}
        onDelete={handleDeleteData('firstname')}
      />
      {/* last name */}
      <InputGroup
        label="Last Name"
        placeholder="member last name"
        required
        colorRequired="tertiary"
        deleteIcon
        fontLevel={3}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        value={data.lastname}
        onChange={onChangeData('lastname')}
        onDelete={handleDeleteData('lastname')}
      />
      {/* work email */}
      <InputGroup
        label="Work Email"
        placeholder="user work email address"
        required
        colorRequired="tertiary"
        deleteIcon
        fontLevel={3}
        hasPadding
        colorPrimaryDark
        hasBoxShadow
        hasHeight
        value={data.email}
        onChange={onChangeData('email')}
        onDelete={handleDeleteData('email')}
      />
      {/* Access Level */}
      <FormGroup
        label="Access Level"
        required={true}
        iconTooltip={<InfoIcon />}
        layout="vertical"
        formClass={styles.access_label}
        // onClick={() =>
        //   setVisible({
        //     accessModal: true,
        //     workLocationModal: false,
        //   })
        // }
      >
        <CustomRadio
          options={AccessLevelDataRole}
          value={data.role_id}
          onChange={(radioValue) =>
            setData((prevState) => ({ ...prevState, role_id: radioValue.value as string }))
          }
        />
      </FormGroup>
      {/* Status */}
      <Status
        value={data.status}
        label="Status"
        toolTipTitle={
          <BodyText level={6} fontFamily="Roboto" style={{ color: '#fff' }}>
            Send email invite
          </BodyText>
        }
        alignOffset={[0, 6]}
        buttonName="Send Invite"
        text_1="Activated"
        text_2="pending invite"
        formClass={styles.status}
        onClick={() => {
          if (!userId) {
            handleSubmit(handleInvite);
          } else {
            handleInvite(userId);
          }
        }}
      />
    </EntryFormWrapper>
  );
};

export default BrandEntryForm;

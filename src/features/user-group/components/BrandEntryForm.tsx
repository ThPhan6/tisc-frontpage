import React, { FC, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';
import { BrandAccessLevelDataRole } from '@/features/team-profiles/constants/role';
import { message } from 'antd';
import { useHistory } from 'umi';

import { ReactComponent as InfoIcon } from '@/assets/icons/info-icon.svg';

import { createBrand } from '../services';
import { getEmailMessageError, getEmailMessageErrorType } from '@/helper/utils';

import { TISCUserGroupBrandForm } from '../types/brand.types';

import { CustomRadio } from '@/components/CustomRadio';
import { EntryFormWrapper } from '@/components/EntryForm';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { Status } from '@/components/Form/Status';

import styles from './BrandEntryForm.less';
import { showPageLoading } from '@/features/loading/loading';
import { inviteBrand } from '@/features/team-profiles/api';

interface BrandEntryFormValue {}

const DEFAULT_BRAND: TISCUserGroupBrandForm = {
  name: '',
  first_name: '',
  last_name: '',
  email: '',
};
type EntryFormInput = keyof typeof DEFAULT_BRAND;

const BrandEntryForm: FC<BrandEntryFormValue> = () => {
  const [data, setData] = useState<TISCUserGroupBrandForm>(DEFAULT_BRAND);
  const history = useHistory();

  const onChangeData = (fieldName: EntryFormInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevState) => ({
      ...prevState,
      [fieldName]: e.target.value,
    }));
  };

  const handleDeleteData = (fieldName: EntryFormInput) => () => {
    setData((prevState) => ({
      ...prevState,
      [fieldName]: '',
    }));
  };

  const handleSubmit = (callback?: (brandId: string) => void) => {
    /// check email
    const invalidEmail = getEmailMessageError(data.email, MESSAGE_ERROR.EMAIL_INVALID);
    if (invalidEmail) {
      message.error(invalidEmail);
      return;
    }

    showPageLoading();

    createBrand({
      name: data.name?.trim() ?? '',
      first_name: data.first_name?.trim() ?? '',
      last_name: data.last_name?.trim() ?? '',
      email: data.email?.trim() ?? '',
    }).then((newBrand) => {
      if (!newBrand) {
        return;
      }
      if (callback) {
        callback(newBrand.id);
      } else {
        history.replace(PATH.tiscUserGroupBrandList);
      }
    });
  };

  const handleSendInvite = () => {
    handleSubmit((brandId) => {
      inviteBrand(brandId).then(() => {
        history.replace(PATH.tiscUserGroupBrandList);
      });
    });
  };

  return (
    <EntryFormWrapper
      handleCancel={history.goBack}
      handleSubmit={() => handleSubmit()}
      submitButtonStatus={false}
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
        value={data.name}
        onChange={onChangeData('name')}
        onDelete={handleDeleteData('name')}
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
        value={data.first_name}
        onChange={onChangeData('first_name')}
        onDelete={handleDeleteData('first_name')}
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
        value={data.last_name}
        onChange={onChangeData('last_name')}
        onDelete={handleDeleteData('last_name')}
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
        message={getEmailMessageError(data.email, MESSAGE_ERROR.EMAIL_INVALID)}
        messageType={getEmailMessageErrorType(data.email, 'error', 'normal')}
      />
      {/* Access Level */}
      <FormGroup
        label="Access Level"
        required={true}
        iconTooltip={<InfoIcon />}
        layout="vertical"
        formClass={styles.access_label}>
        <CustomRadio
          options={BrandAccessLevelDataRole.map((el) => ({ ...el, disabled: true }))}
          value={BrandAccessLevelDataRole[0].value}
        />
      </FormGroup>
      {/* Status */}
      <Status
        value={''}
        label="Status"
        alignOffset={[0, 6]}
        buttonName="Send Invite"
        text_1="Activated"
        text_2="pending invite"
        formClass={styles.status}
        onClick={handleSendInvite}
      />
    </EntryFormWrapper>
  );
};

export default BrandEntryForm;

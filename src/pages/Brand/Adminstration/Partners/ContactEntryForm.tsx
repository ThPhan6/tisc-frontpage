import { useEffect, useMemo, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';
import { UserStatus } from '@/constants/util';
import { message } from 'antd';
import { useLocation } from 'umi';

import { pushTo } from '@/helper/history';
import { useEntryFormHandlers, useGetParamId } from '@/helper/hook';
import {
  getEmailMessageError,
  getEmailMessageErrorType,
  validateRequiredFields,
} from '@/helper/utils';
import {
  createPartnerContact,
  getPartnerContact,
  inviteUser,
  updatePartnerContact,
} from '@/services';
import { pick } from 'lodash';

import { TabItem } from '@/components/Tabs/types';
import { useAppSelector } from '@/reducers';
import { ContactRequest } from '@/types';

import CollapsiblePanel from '@/components/CollapsiblePanel';
import { CustomRadio } from '@/components/CustomRadio';
import { EntryFormWrapper } from '@/components/EntryForm';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { Status } from '@/components/Form/Status';
import CompanyModal, { SelectedCompany } from '@/components/Modal/CompanyModal';
import { MemorizeTableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { CustomTabs } from '@/components/Tabs';
import { Title } from '@/components/Typography';
import { PartnerTabKey } from '@/pages/Brand/Adminstration/Partners/PartnersTable';
import styles from '@/pages/Brand/Adminstration/Partners/styles/Partners.less';

enum Gender {
  Male = 'Male',
  Female = 'Female',
}

const genderOptions = [
  { label: Gender.Male, value: true },
  { label: Gender.Female, value: false },
];

const initialContactForm: ContactRequest = {
  firstname: '',
  lastname: '',
  gender: true,
  linkedin: '',
  company_name: '',
  relation_id: '',
  email: '',
  phone: '',
  mobile: '',
  country_name: '',
  position: '',
  remark: '',
  status: UserStatus.Uninitiate,
  phone_code: '00',
};

const getStatusText = (status: UserStatus) => {
  switch (status) {
    case UserStatus.Pending:
      return 'Pending';
    case UserStatus.Active:
      return 'Activated';
    default:
      return 'Uninitiate';
  }
};

const ContactEntryForm = () => {
  const user = useAppSelector((state) => state.user.user);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const isActiveTab = location.pathname === PATH.brandPartners;
  const { state } = useLocation<{ selectedTab?: string }>();
  const selectedTab = state?.selectedTab || PartnerTabKey.contactPartners;
  const partnerContactId = useGetParamId();
  const isUpdate = Boolean(partnerContactId);

  const {
    data,
    handleInputChange,
    handleInputDelete,
    handlePhoneChange,
    handleRadioChange,
    setData,
  } = useEntryFormHandlers<ContactRequest>(initialContactForm);

  const status = getStatusText(data.status);

  useEffect(() => {
    if (partnerContactId) {
      const handleFetchPartnerContactInfo = async () => {
        const res = await getPartnerContact(partnerContactId);
        if (res) setData(res);
      };

      handleFetchPartnerContactInfo();
    }
  }, [partnerContactId]);

  const listTab: TabItem[] = [
    {
      tab: 'Companies',
      tabletTabTitle: 'Companies',
      key: PartnerTabKey.companyPartners,
      disable: !isActiveTab,
    },

    {
      tab: 'Contacts',
      tabletTabTitle: 'Contacts',
      key: PartnerTabKey.contactPartners,
      disable: !isActiveTab,
    },
  ];

  const getRequiredFields = (): { field: keyof ContactRequest; messageField: string }[] => [
    { field: 'firstname', messageField: 'First name is required' },
    { field: 'lastname', messageField: 'Last name is required' },
    { field: 'gender', messageField: 'Gender is required' },
    { field: 'relation_id', messageField: 'Company is required' },
    { field: 'position', messageField: 'Title / Position is required' },
    { field: 'email', messageField: 'Work Email is required' },
    { field: 'phone', messageField: 'Work Phone is required' },
    { field: 'mobile', messageField: 'Work mobile is required' },
  ];

  const handleCloseEntryForm = () => {
    pushTo(`${PATH.brandPartners}?tab=contact`);
  };

  const handleSubmit = async () => {
    if (!validateRequiredFields(data, getRequiredFields())) return;

    const newData = { ...data };

    if (user?.relation_id === data.relation_id) {
      newData.relation_id = null as any;
    }

    if (isUpdate) {
      const res = await updatePartnerContact(
        partnerContactId,
        pick(newData, [
          'id',
          'firstname',
          'lastname',
          'gender',
          'linkedin',
          'mobile',
          'phone',
          'relation_id',
          'position',
          'email',
          'remark',
        ]) as ContactRequest,
      );
      if (res) setData(res);
      return;
    }

    const res = await createPartnerContact(
      pick(newData, [
        'firstname',
        'lastname',
        'gender',
        'linkedin',
        'mobile',
        'phone',
        'relation_id',
        'position',
        'email',
        'remark',
      ]) as ContactRequest,
    );
    if (res) handleCloseEntryForm();
  };

  const handleToggleModal = () => setIsOpenModal(!isOpenModal);

  const panels = useMemo(
    () => [
      {
        id: 1,
        title: 'Activation',
      },
    ],
    [],
  );

  const handleOnChangeCompanyData = (companyData: SelectedCompany) => {
    setData((prevData) => ({
      ...prevData,
      relation_id: companyData.value,
      company_name: companyData.label,
      country_name: companyData.country || '',
      phone_code: companyData.phoneCode || '',
    }));
  };

  const handleInvite = async () => {
    if (!partnerContactId) return;

    if (user?.relation_id === data.relation_id) {
      message.info('Please select other company to invite');
      return;
    }

    await handleSubmit();

    const invited = await inviteUser(partnerContactId);
    if (invited) setData((prevData) => ({ ...prevData, status: UserStatus.Pending }));
  };

  return (
    <>
      <MemorizeTableHeader title="PARTNERS" customClass={styles.partnerHeader} />
      <div className="d-flex">
        <CustomTabs
          listTab={listTab}
          centered
          tabPosition="top"
          tabDisplay="start"
          widthItem="auto"
          className={`${styles.partnerHeaderTab} ${
            !isActiveTab ? styles.partnerHeaderTabDisabled : ''
          }`}
          activeKey={selectedTab}
        />

        <div className="d-flex bg-white border-bottom-black">
          <CollapsiblePanel panels={panels} disabled={true} />
          <CustomPlusButton customClass="my-0 mx-16" disabled={true} />
        </div>
      </div>

      <EntryFormWrapper
        customClass="w-full"
        handleCancel={handleCloseEntryForm}
        handleSubmit={handleSubmit}
        contentStyles={{
          height: 'calc(var(--vh) * 100 - 289px)',
        }}
      >
        <Title level={8} customClass="py-10 mb-16 bottom-border-inset-black">
          PERSONAL PROFILE
        </Title>
        <InputGroup
          label="First Name"
          required
          fontLevel={3}
          hasPadding
          hasBoxShadow
          hasHeight
          colorPrimaryDark
          colorRequired="tertiary"
          value={data.firstname}
          placeholder="member first name"
          onChange={handleInputChange('firstname')}
          onDelete={handleInputDelete('firstname')}
          deleteIcon
        />
        <InputGroup
          label="Last Name"
          required
          fontLevel={3}
          hasPadding
          hasHeight
          hasBoxShadow
          colorPrimaryDark
          colorRequired="tertiary"
          value={data.lastname}
          placeholder="member last name"
          onChange={handleInputChange('lastname')}
          onDelete={handleInputDelete('lastname')}
          deleteIcon
        />
        <FormGroup
          label="Gender"
          required={true}
          layout="vertical"
          formClass="border-bottom-light pb-8"
        >
          <CustomRadio
            options={genderOptions}
            value={data.gender}
            onChange={handleRadioChange('gender')}
          />
        </FormGroup>
        <InputGroup
          label="Linkedin"
          fontLevel={3}
          hasPadding
          hasHeight
          hasBoxShadow
          colorPrimaryDark
          colorRequired="tertiary"
          value={data.linkedin}
          placeholder="copy/paste personal Linkedin URL link"
          onChange={handleInputChange('linkedin')}
          onDelete={handleInputDelete('linkedin')}
          deleteIcon
        />

        <Title level={8} customClass="py-10 my-16 bottom-border-inset-black">
          WORKPLACE PROFILE
        </Title>
        <InputGroup
          label="Comapny"
          required
          fontLevel={3}
          placeholder={'select from the list'}
          value={data.company_name}
          hasBoxShadow
          hasPadding
          rightIcon
          hasHeight
          colorPrimaryDark
          colorRequired="tertiary"
          onRightIconClick={handleToggleModal}
        />
        <InputGroup
          label="Title / Position"
          required
          fontLevel={3}
          hasPadding
          hasHeight
          hasBoxShadow
          colorPrimaryDark
          colorRequired="tertiary"
          value={data.position}
          placeholder="member title/position"
          onChange={handleInputChange('position')}
          onDelete={handleInputDelete('position')}
          deleteIcon
        />
        <InputGroup
          label="Work Email"
          required
          fontLevel={3}
          hasPadding
          hasHeight
          hasBoxShadow
          colorPrimaryDark
          colorRequired="tertiary"
          value={data.email}
          placeholder="user work email"
          onChange={handleInputChange('email')}
          onDelete={handleInputDelete('email')}
          deleteIcon
          message={getEmailMessageError(data.email, MESSAGE_ERROR.EMAIL_INVALID)}
          messageType={getEmailMessageErrorType(data.email, 'error', 'normal')}
        />
        <FormGroup label="Work Phone" required layout="vertical" formClass={styles.formGroup}>
          <PhoneInput
            phonePlaceholder="area code / member"
            onChange={handlePhoneChange('phone')}
            containerClass={styles.phoneInputCustom}
            value={{
              zoneCode: data.phone_code,
              phoneNumber: data.phone,
            }}
            deleteIcon
            codeReadOnly
          />
        </FormGroup>
        <FormGroup label="Work Mobile" required layout="vertical" formClass={styles.formGroup}>
          <PhoneInput
            phonePlaceholder="area code / member"
            onChange={handlePhoneChange('mobile')}
            containerClass={styles.phoneInputCustom}
            value={{
              zoneCode: data.phone_code,
              phoneNumber: data.mobile,
            }}
            deleteIcon
            codeReadOnly
          />
        </FormGroup>
        <Status
          value={data.status}
          onClick={handleInvite}
          label="Status"
          buttonName="Send Invite"
          text_1={status}
          text_2={status}
          disabled={status == 'Activated' || !isUpdate}
        />
        <FormGroup label="Remark" layout="vertical">
          <CustomTextArea
            value={data.remark}
            maxLength={240}
            showCount
            boxShadow
            placeholder="input text"
            onChange={handleInputChange('remark')}
          />
        </FormGroup>
      </EntryFormWrapper>

      <CompanyModal
        chosenValue={{
          value: data.relation_id,
          label: data.company_name as string,
        }}
        setChosenValue={handleOnChangeCompanyData}
        visible={isOpenModal}
        setVisible={handleToggleModal}
      />
    </>
  );
};

export default ContactEntryForm;

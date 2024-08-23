import { useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';
import { useGetParamId } from '@/helper/hook';
import {
  getEmailMessageError,
  getEmailMessageErrorType,
  messageError,
  messageErrorType,
  validateRequiredFields,
} from '@/helper/utils';
import { createPartner, getPartner, updatePartner } from '@/services';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { TabItem } from '@/components/Tabs/types';
import { RootState, useAppSelector } from '@/reducers';
import { CompanyForm } from '@/types';

import CollapsiblePanel from '@/components/CollapsiblePanel';
import { CustomRadio } from '@/components/CustomRadio';
import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import { EntryFormWrapper } from '@/components/EntryForm';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { CustomTabs } from '@/components/Tabs';
import { Title } from '@/components/Typography';
import AuthorizedCountryModal from '@/features/distributors/components/AuthorizedCountryModal';
import CityModal from '@/features/locations/components/CityModal';
import CountryModal from '@/features/locations/components/CountryModal';
import StateModal from '@/features/locations/components/StateModal';
import { PartnerTabKey } from '@/pages/Brand/Adminstration/Partners/PartnersTable';
import styles from '@/pages/Brand/Adminstration/Partners/styles/Partners.less';

import { showPageLoading } from '@/features/loading/loading';

enum CoverageBeyond {
  NotAllow = 'Not Allow',
  Allow = 'Allow',
}

const coverageBeyondOptions = [
  { label: CoverageBeyond.NotAllow, value: false },
  { label: CoverageBeyond.Allow, value: true },
];

type ModalType =
  | ''
  | 'city'
  | 'state'
  | 'country'
  | 'affiliation'
  | 'relation'
  | 'acquisition'
  | 'authorizedCountry';

const initialCompanyForm: CompanyForm = {
  id: '',
  name: '',
  website: '',
  country_name: '',
  province: '',
  city_name: '',
  address: '',
  postal_code: '',
  phone: '',
  email: '',
  affiliation_name: '',
  affiliation_id: '',
  relation_name: '',
  relation_id: '',
  acquisition_name: '',
  acquisition_id: '',
  price_rate: null,
  authorized_country_name: '',
  coverage_beyond: false,
  remark: '',
  city_id: '',
  authorized_countries: [],
  authorized_country_ids: [],
  country_id: '',
  state_id: '',
  state_name: '',
  phone_code: '',
};

const CompanyEntryForm = () => {
  const [data, setData] = useState<CompanyForm>(initialCompanyForm);

  const [countryData, setCountryData] = useState({
    label: '',
    value: data.country_id,
    phoneCode: '00',
  });

  const [isOpenModal, setIsOpenModal] = useState<ModalType>('');
  const [stateData, setStateData] = useState({ label: '', value: data.state_id });
  const [cityData, setCityData] = useState({ label: '', value: data.city_id });
  const [authorCountryData, setAuthorCountryData] = useState<CheckboxValue[]>(
    data?.authorized_countries?.map((country) => {
      return {
        label: country.name,
        value: country.id,
      };
    }),
  );
  const { association } = useAppSelector((state: RootState) => state.partner);
  const isActiveTab = location.pathname === PATH.brandPartners;
  const partnerId = useGetParamId();
  const isUpdate = partnerId ? true : false;

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

  const handleOnChange = <K extends keyof CompanyForm>(fieldName: K, fieldValue: CompanyForm[K]) =>
    setData({
      ...data,
      [fieldName]: fieldValue,
    });

  useEffect(() => {
    if (partnerId) {
      const handleFetchPartnerInfo = async () => {
        const res = await getPartner(partnerId);
        if (res) setData(res);
      };

      handleFetchPartnerInfo();
    }
  }, [partnerId]);

  useEffect(() => {
    if (countryData.value !== '') handleOnChange('country_id', countryData.value);
  }, [countryData]);

  useEffect(() => {
    handleOnChange('state_id', stateData.value);
  }, [stateData]);

  useEffect(() => {
    handleOnChange('city_id', cityData.value);
  }, [cityData]);

  useEffect(() => {
    if (authorCountryData) {
      handleOnChange(
        'authorized_country_ids',
        authorCountryData.map((item) => item.value) as string[],
      );
    }
  }, [authorCountryData]);

  const getRequiredFields = (): { field: keyof CompanyForm; messageField: string }[] => [
    { field: 'name', messageField: 'Company name is required' },
    { field: 'country_id', messageField: 'Country is required' },
    { field: 'state_id', messageField: 'Province / State is required' },
    { field: 'city_id', messageField: 'City is required' },
    { field: 'address', messageField: 'Address is required' },
    { field: 'postal_code', messageField: 'Postal / Zip Code is required' },
    { field: 'phone', messageField: 'Phone number is required' },
    { field: 'email', messageField: 'Email is required' },
    { field: 'affiliation_id', messageField: 'Affiliation is required' },
    { field: 'relation_id', messageField: 'Relation is required' },
    { field: 'acquisition_id', messageField: 'Acquisition is required' },
    { field: 'price_rate', messageField: 'Price rate is required' },
    { field: `authorized_country_ids`, messageField: 'Authorised country is required' },
    { field: 'coverage_beyond', messageField: 'Coverage beyond is required' },
  ];

  const handleCloseEntryForm = () => pushTo(PATH.brandPartners);

  const handleSubmit = async () => {
    const requiredFields = getRequiredFields();
    if (!validateRequiredFields(data, requiredFields)) return;

    showPageLoading();

    if (isUpdate) {
      await updatePartner(partnerId, { ...data });
      return;
    }

    const res = await createPartner({ ...data });
    if (res) handleCloseEntryForm();
  };

  const handleSetModalVisible = (visible: boolean) => (visible ? ' undefined' : setIsOpenModal(''));

  const handleToggleModal = (type: ModalType) => () => setIsOpenModal(type);

  const panels = [
    {
      id: 1,
      title: 'Affiliation',
    },
    {
      id: 2,
      title: 'Relation',
    },
    {
      id: 3,
      title: 'Acquisition',
    },
  ];

  const getFormClass = (placeholder: string) =>
    placeholder === 'select from list' ? '' : `${styles.partnerAssociations}`;

  const generatePlaceholder = (
    items: { id: string; name: string }[],
    checkedValue: string | undefined,
    defaultName: string,
  ) => {
    const selectedItem = items.find((item) => item.id === checkedValue);
    return selectedItem ? selectedItem.name : defaultName || 'select from list';
  };

  const countryMergedData = {
    label: data.country_name,
    value: data.country_id,
    phoneCode: data.phone_code,
  };

  const stateMergedData = {
    label: data.state_name,
    value: data.state_id,
  };

  const cityMergedData = {
    label: data.city_name,
    value: data.city_id,
  };

  const authouCountryMergedData = data?.authorized_country_ids?.map((id) => {
    return {
      label: data.authorized_country_name,
      value: id,
    };
  });

  return (
    <>
      <TableHeader title="PARTNERS" customClass={styles.partnerHeader} />
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
        />

        <div className="d-flex bg-white border-bottom-black">
          <CollapsiblePanel panels={panels} disabled={true} />
          <CustomPlusButton customClass="my-0 mx-16" disabled={true} />
        </div>
      </div>

      <EntryFormWrapper
        customClass="max-h-708 max-w-572"
        handleCancel={handleCloseEntryForm}
        handleSubmit={handleSubmit}
      >
        <Title level={8} customClass="py-10 mb-16 bottom-border-inset-black">
          COMPANY PROFILE
        </Title>
        <InputGroup
          label="Name"
          required
          fontLevel={3}
          hasPadding
          hasBoxShadow
          hasHeight
          value={data.name}
          placeholder="channel partner company name"
          onChange={(event) => handleOnChange('name', event.target.value)}
          deleteIcon
        />
        <InputGroup
          label="Website"
          fontLevel={3}
          hasPadding
          hasHeight
          hasBoxShadow
          value={data.website}
          placeholder="paste site URL link here"
          onChange={(event) => handleOnChange('website', event.target.value)}
          deleteIcon
        />
        <InputGroup
          label="Country"
          required
          fontLevel={3}
          placeholder="select country"
          value={!isUpdate ? countryData.label : data.country_name}
          hasBoxShadow
          hasPadding
          rightIcon
          hasHeight
          colorPrimaryDark
          colorRequired="tertiary"
          onRightIconClick={handleToggleModal('country')}
        />
        <InputGroup
          label="State / Province"
          required
          fontLevel={3}
          hasPadding
          hasHeight
          hasBoxShadow
          rightIcon
          value={!isUpdate ? stateData.label : data.state_name}
          placeholder="select state / province"
          onRightIconClick={handleToggleModal('state')}
          colorPrimaryDark
          colorRequired="tertiary"
          disabled={(countryData.value || data.country_id) === ''}
        />
        <InputGroup
          label="City / Town"
          required
          fontLevel={3}
          hasHeight
          hasPadding
          hasBoxShadow
          rightIcon
          value={!isUpdate ? cityData.label : data.city_name}
          placeholder="select city / town"
          onChange={(event) => handleOnChange('city_name', event.target.value)}
          onRightIconClick={handleToggleModal('city')}
          colorPrimaryDark
          colorRequired="tertiary"
          disabled={(stateData.value || data.state_id) === ''}
        />
        <FormGroup label="Address" required layout="vertical">
          <CustomTextArea
            maxLength={120}
            showCount
            boxShadow
            placeholder="unit #, street / road name"
            value={data.address}
            name="address"
            onChange={(event) => handleOnChange('address', event.target.value)}
          />
        </FormGroup>
        <InputGroup
          label="Postal / Zip Code"
          required
          fontLevel={3}
          placeholder="postal / zip code"
          hasBoxShadow
          hasPadding
          hasHeight
          colorPrimaryDark
          colorRequired="tertiary"
          value={data.postal_code}
          name="postal_code"
          onChange={(event) => handleOnChange('postal_code', event.target.value)}
          message={messageError(data.postal_code, MESSAGE_ERROR.POSTAL_CODE, 10)}
          messageType={messageErrorType(data.postal_code, 10, 'error', 'normal')}
          deleteIcon
        />
        <FormGroup label="General Phone" required layout="vertical">
          <PhoneInput
            phonePlaceholder="area code / number"
            onChange={(value) => handleOnChange('phone', value.phoneNumber)}
            value={{
              zoneCode: !isUpdate ? countryData.phoneCode : data.phone_code,
              phoneNumber: data.phone,
            }}
            deleteIcon
          />
        </FormGroup>
        <InputGroup
          label="General Email"
          required
          fontLevel={3}
          hasHeight
          hasPadding
          hasBoxShadow
          placeholder="general email address"
          value={data.email}
          onChange={(event) => handleOnChange('email', event.target.value)}
          deleteIcon
          message={getEmailMessageError(data.email, MESSAGE_ERROR.EMAIL_INVALID)}
          messageType={getEmailMessageErrorType(data.email, 'error', 'normal')}
        />

        <Title level={8} customClass="py-10 my-16 bottom-border-inset-black">
          ACCOUNT PROFILE
        </Title>
        <FormGroup
          label="Affiliation"
          required
          layout="vertical"
          formClass={`${styles.association} ${getFormClass(
            generatePlaceholder(
              association?.affiliation || [],
              data.affiliation_id,
              data.affiliation_name,
            ),
          )}`}
        >
          <CollapseRadioList
            options={
              association?.affiliation?.map((item) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              }) || []
            }
            placeholder={generatePlaceholder(
              association?.affiliation || [],
              data.affiliation_id,
              data.affiliation_name,
            )}
            additonalOptionsStyle={{ marginBottom: 10 }}
            additionalOtherClass="mb-10"
            otherInput
            checked={data.affiliation_id}
            onChange={(radioValue) => {
              if (radioValue.value === 'other') {
                handleOnChange('affiliation_id', radioValue.label as string);
                return;
              }
              handleOnChange('affiliation_id', radioValue.value as string);
            }}
          />
        </FormGroup>
        <FormGroup
          label="Relation"
          required
          layout="vertical"
          formClass={`${styles.association} ${getFormClass(
            generatePlaceholder(association?.relation || [], data.relation_id, data.relation_name),
          )}`}
        >
          <CollapseRadioList
            options={
              association?.relation?.map((item) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              }) || []
            }
            placeholder={generatePlaceholder(
              association?.relation || [],
              data.relation_id,
              data.relation_name,
            )}
            additonalOptionsStyle={{ marginBottom: 10 }}
            additionalOtherClass="mb-10"
            otherInput
            checked={data.relation_id}
            onChange={(radioValue) => {
              if (radioValue.value === 'other') {
                handleOnChange('relation_id', radioValue.label as string);
                return;
              }
              handleOnChange('relation_id', radioValue.value as string);
            }}
          />
        </FormGroup>
        <FormGroup
          label="Acquisition"
          required
          layout="vertical"
          formClass={`${styles.association} ${getFormClass(
            generatePlaceholder(
              association?.acquisition || [],
              data.acquisition_id,
              data.acquisition_name,
            ),
          )}`}
        >
          <CollapseRadioList
            options={
              association?.acquisition?.map((item) => {
                let className = '';
                switch (item.name) {
                  case 'Active':
                    className = 'indigo-dark-variant';
                    break;
                  case 'Inactive':
                    className = 'red-magenta';
                    break;
                  case 'Freeze':
                    className = 'orange';
                    break;
                  default:
                    className = '';
                }

                return {
                  label: <span className={`${className}`}>{item.name}</span>,
                  value: item.id,
                };
              }) || []
            }
            placeholder={generatePlaceholder(
              association?.acquisition || [],
              data.acquisition_id,
              data.acquisition_name,
            )}
            additonalOptionsStyle={{ marginBottom: 10 }}
            additionalOtherClass="mb-10"
            otherInput
            checked={data.acquisition_id}
            onChange={(radioValue) => {
              if (radioValue.value === 'other') {
                handleOnChange('acquisition_id', radioValue.label as string);
                return;
              }
              handleOnChange('acquisition_id', radioValue.value as string);
            }}
          />
        </FormGroup>
        <InputGroup
          label="Price Rate"
          required
          fontLevel={3}
          hasPadding
          hasHeight
          hasBoxShadow
          colorPrimaryDark={true}
          value={data.price_rate!}
          onChange={(event) => handleOnChange('price_rate', Number(event.target.value))}
        />
        <InputGroup
          label="Authorized Country"
          required
          fontLevel={3}
          hasPadding
          hasHeight
          hasBoxShadow
          colorPrimaryDark
          colorRequired="tertiary"
          rightIcon
          placeholder="select country"
          value={
            authorCountryData.map((item) => item.label).join(', ') || data.authorized_country_name
          }
          onRightIconClick={handleToggleModal('authorizedCountry')}
        />
        <FormGroup
          label="Coverage Beyond"
          required={true}
          layout="vertical"
          formClass="border-bottom-light pb-8"
        >
          <CustomRadio
            options={coverageBeyondOptions}
            value={data.coverage_beyond}
            onChange={(radioValue) =>
              handleOnChange('coverage_beyond', radioValue.value as boolean)
            }
          />
        </FormGroup>
        <FormGroup label="Remark" layout="vertical">
          <CustomTextArea
            value={data.remark}
            maxLength={240}
            showCount
            boxShadow
            placeholder="input text"
            onChange={(event) => handleOnChange('remark', event.target.value)}
          />
        </FormGroup>
      </EntryFormWrapper>

      <CountryModal
        visible={isOpenModal === 'country'}
        setVisible={handleSetModalVisible}
        chosenValue={!isUpdate ? countryData : countryMergedData}
        setChosenValue={setCountryData}
        hasGlobal={false}
      />

      <StateModal
        countryId={data.country_id}
        visible={isOpenModal === 'state'}
        setVisible={handleSetModalVisible}
        chosenValue={!isUpdate ? stateData : stateMergedData}
        setChosenValue={setStateData}
      />

      <CityModal
        stateId={data.state_id}
        countryId={data.country_id}
        visible={isOpenModal === 'city'}
        setVisible={handleSetModalVisible}
        chosenValue={!isUpdate ? cityData : cityMergedData}
        setChosenValue={setCityData}
      />

      <AuthorizedCountryModal
        visible={isOpenModal === 'authorizedCountry'}
        setVisible={handleSetModalVisible}
        chosenValue={!isUpdate ? authorCountryData : authouCountryMergedData}
        setChosenValue={setAuthorCountryData}
      />
    </>
  );
};

export default CompanyEntryForm;

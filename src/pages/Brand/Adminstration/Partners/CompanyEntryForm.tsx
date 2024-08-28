import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';
import { useGetParamId } from '@/helper/hook';
import {
  getEmailMessageError,
  getEmailMessageErrorType,
  handleGetCommonPartnerTypeList,
  messageError,
  messageErrorType,
  validateRequiredFields,
} from '@/helper/utils';
import { createPartner, getCommonPartnerTypes, getPartner, updatePartner } from '@/services';

import { TabItem } from '@/components/Tabs/types';
import { RootState, useAppSelector } from '@/reducers';
import { setAssociation } from '@/reducers/partner';
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
  price_rate: '1.00',
  authorized_country_name: '',
  coverage_beyond: false,
  remark: '',
  city_id: '',
  authorized_countries: [],
  authorized_country_ids: [],
  country_id: '',
  state_id: '',
  state_name: '',
  phone_code: '00',
};

const CompanyEntryForm = () => {
  const [data, setData] = useState<CompanyForm>(initialCompanyForm);
  const [initSelectedAssociation, setInitSelectedAssociation] = useState({
    affiliation_id: '',
    relation_id: '',
    acquisition_id: '',
  });
  const [isOpenModal, setIsOpenModal] = useState<ModalType>('');
  const [clearOther, setClearOther] = useState(false);
  const [associationOther, setAssociationOther] = useState({
    affiliation: '',
    relation: '',
    acquisition: '',
  });
  const { association } = useAppSelector((state: RootState) => state.partner);
  const isActiveTab = location.pathname === PATH.brandPartners;
  const partnerId = useGetParamId();
  const dispatch = useDispatch();
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
    if (
      associationOther.affiliation === '' &&
      associationOther.relation === '' &&
      associationOther.acquisition === ''
    ) {
      setData((pre) => ({
        ...pre,
        affiliation_id: initSelectedAssociation.affiliation_id,
        relation_id: initSelectedAssociation.relation_id,
        acquisition_id: initSelectedAssociation.acquisition_id,
      }));
    }
  }, [associationOther]);

  const handleFetchPartnerInfo = async () => {
    const res = await getPartner(partnerId);
    if (res) {
      setData(res);
      setInitSelectedAssociation({
        affiliation_id: res.affiliation_id,
        relation_id: res.relation_id,
        acquisition_id: res.acquisition_id,
      });
    }
  };

  useEffect(() => {
    if (partnerId) {
      handleFetchPartnerInfo();
    }
  }, [partnerId]);

  const sortedCommonPartnerTypeList = async () => {
    const res = await getCommonPartnerTypes();
    const sorted = handleGetCommonPartnerTypeList(res);
    dispatch(setAssociation(sorted));
  };

  useEffect(() => {
    sortedCommonPartnerTypeList();
  }, []);

  const getRequiredFields = (): { field: keyof CompanyForm; messageField: string }[] => [
    { field: 'name', messageField: 'Company name is required' },
    { field: 'country_id', messageField: 'Country is required' },
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

  const handleChangeLocationData =
    (type: 'country' | 'state' | 'city') =>
    (locationData: { value: string; label: string; phoneCode?: string }) => {
      setData((pre) => ({
        ...pre,
        [`${type}_id`]: locationData.value,
        [`${type}_name`]: locationData.label,
        phone_code: type === 'country' ? locationData.phoneCode || '00' : pre.phone_code,
      }));
    };

  const handleChangeAuthorizationData = (
    authorizeCountryData: { value: string; label: string }[],
  ) => {
    setData((pre) => ({
      ...pre,
      authorized_country_ids: authorizeCountryData.map((item) => item.value),
      authorized_country_name: authorizeCountryData.map((item) => item.label).join(', '),
    }));
  };

  const convertData = (formData: CompanyForm) => {
    return {
      ...formData,
      price_rate: parseFloat(formData.price_rate.toString()),
    };
  };

  const handleSubmit = async () => {
    const requiredFields = getRequiredFields();
    const check = validateRequiredFields(data, requiredFields);
    if (!check) return;
    showPageLoading();
    setClearOther(true);

    if (isUpdate) {
      const res = await updatePartner(partnerId, convertData(data));
      if (res) {
        setData(res);
        setClearOther(false);
        await sortedCommonPartnerTypeList();
      }
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
    otherAssociation: string,
  ) => {
    const selectedItem = items.find((item) => item.id === checkedValue);
    return selectedItem
      ? selectedItem.name
      : otherAssociation
      ? otherAssociation
      : defaultName || 'select from list';
  };

  return (
    <div>
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
        customClass="w-full"
        handleCancel={handleCloseEntryForm}
        handleSubmit={handleSubmit}
        contentStyles={{
          height: 'calc(var(--vh) * 100 - 289px)',
        }}
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
          colorPrimaryDark
          colorRequired="tertiary"
          value={data.name}
          placeholder="channel partner company name"
          onChange={(event) => handleOnChange('name', event.target.value)}
          onDelete={() => handleOnChange('name', '')}
          deleteIcon
        />
        <InputGroup
          label="Website"
          fontLevel={3}
          hasPadding
          hasHeight
          hasBoxShadow
          colorPrimaryDark
          colorRequired="tertiary"
          value={data.website}
          placeholder="paste site URL link here"
          onChange={(event) => handleOnChange('website', event.target.value)}
          onDelete={() => handleOnChange('website', '')}
          deleteIcon
        />
        <InputGroup
          label="Country"
          required
          fontLevel={3}
          placeholder="select country"
          value={data.country_name}
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
          fontLevel={3}
          hasPadding
          hasHeight
          hasBoxShadow
          rightIcon
          value={data.state_name}
          placeholder="select state / province"
          onRightIconClick={handleToggleModal('state')}
          colorPrimaryDark
          colorRequired="tertiary"
          disabled={data.country_id === ''}
        />
        <InputGroup
          label="City / Town"
          fontLevel={3}
          hasHeight
          hasPadding
          hasBoxShadow
          rightIcon
          value={data.city_name}
          placeholder="select city / town"
          onRightIconClick={handleToggleModal('city')}
          colorPrimaryDark
          colorRequired="tertiary"
          disabled={(data.country_id || data.state_id) === ''}
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
          onDelete={() => handleOnChange('postal_code', '')}
          message={messageError(data.postal_code, MESSAGE_ERROR.POSTAL_CODE, 10)}
          messageType={messageErrorType(data.postal_code, 10, 'error', 'normal')}
          deleteIcon
        />
        <FormGroup label="General Phone" required layout="vertical" formClass={styles.formGroup}>
          <PhoneInput
            phonePlaceholder="area code / number"
            onChange={(value) => handleOnChange('phone', value.phoneNumber)}
            containerClass={styles.phoneInputCustom}
            value={{
              zoneCode: data.phone_code,
              phoneNumber: data.phone,
            }}
            deleteIcon
            codeReadOnly
          />
        </FormGroup>
        <InputGroup
          label="General Email"
          required
          fontLevel={3}
          hasHeight
          hasPadding
          hasBoxShadow
          colorPrimaryDark
          colorRequired="tertiary"
          placeholder="general email address"
          value={data.email}
          onChange={(event) => handleOnChange('email', event.target.value)}
          onDelete={() => handleOnChange('email', '')}
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
              associationOther.affiliation,
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
              data.affiliation_name || data.affiliation_id,
              associationOther.affiliation,
            )}
            additonalOptionsStyle={{ marginBottom: 10, paddingLeft: 16 }}
            additionalOtherClass="mb-10 ml-16"
            otherInput={true}
            checked={data.affiliation_id}
            onChange={(radioValue) => {
              if (radioValue.value === 'other') {
                handleOnChange('affiliation_id', radioValue.label as string);
                setAssociationOther((prev) => ({
                  ...prev,
                  affiliation: radioValue.label as string,
                }));
                return;
              }
              handleOnChange('affiliation_id', radioValue.value as string);
            }}
            clearOtherInput={clearOther}
          />
        </FormGroup>
        <FormGroup
          label="Relation"
          required
          layout="vertical"
          formClass={`${styles.association} ${getFormClass(
            generatePlaceholder(
              association?.relation || [],
              data.relation_id,
              data.relation_name,
              associationOther.relation,
            ),
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
              data.relation_name || data.relation_id,
              associationOther.relation,
            )}
            additonalOptionsStyle={{ marginBottom: 10, paddingLeft: 16 }}
            additionalOtherClass="mb-10 ml-16"
            otherInput={true}
            checked={data.relation_id}
            onChange={(radioValue) => {
              if (radioValue.value === 'other') {
                handleOnChange('relation_id', radioValue.label as string);
                setAssociationOther((prev) => ({
                  ...prev,
                  relation: radioValue.label as string,
                }));
                return;
              }
              handleOnChange('relation_id', radioValue.value as string);
            }}
            clearOtherInput={clearOther}
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
              associationOther.acquisition,
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
              associationOther.acquisition,
            )}
            additonalOptionsStyle={{ marginBottom: 10, paddingLeft: 16 }}
            additionalOtherClass="mb-10 ml-16"
            otherInput={true}
            checked={data.acquisition_id}
            onChange={(radioValue) => {
              if (radioValue.value === 'other') {
                handleOnChange('acquisition_id', radioValue.label as string);
                setAssociationOther((prev) => ({
                  ...prev,
                  acquisition: radioValue.label as string,
                }));
                return;
              }
              handleOnChange('acquisition_id', radioValue.value as string);
            }}
            clearOtherInput={clearOther}
          />
        </FormGroup>
        <InputGroup
          label="Price Rate"
          required
          fontLevel={3}
          hasBoxShadow
          hasPadding
          hasHeight
          colorPrimaryDark={true}
          value={data.price_rate}
          name="price_rate"
          onChange={(event) => handleOnChange('price_rate', event.target.value)}
          onDelete={() => handleOnChange('price_rate', '')}
          deleteIcon
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
          value={data.authorized_country_name}
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
        chosenValue={{ value: data.country_id, label: data.country_name }}
        setChosenValue={handleChangeLocationData('country')}
        hasGlobal={false}
      />

      <StateModal
        countryId={data.country_id}
        visible={isOpenModal === 'state'}
        setVisible={handleSetModalVisible}
        chosenValue={{ value: data.state_id, label: data.state_name }}
        setChosenValue={handleChangeLocationData('state')}
      />

      <CityModal
        stateId={data.state_id}
        countryId={data.country_id}
        visible={isOpenModal === 'city'}
        setVisible={handleSetModalVisible}
        chosenValue={{ value: data.city_id, label: data.city_name }}
        setChosenValue={handleChangeLocationData('city')}
      />

      <AuthorizedCountryModal
        visible={isOpenModal === 'authorizedCountry'}
        setVisible={handleSetModalVisible}
        chosenValue={data.authorized_country_ids.map((countryId) => ({
          value: countryId,
        }))}
        setChosenValue={handleChangeAuthorizationData}
      />
    </div>
  );
};

export default CompanyEntryForm;

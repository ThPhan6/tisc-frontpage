import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';

import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import { pushTo } from '@/helper/history';
import { useEntryFormHandlers, useGetParamId } from '@/helper/hook';
import {
  getEmailMessageError,
  getEmailMessageErrorType,
  handleGetCommonPartnerTypeList,
  messageError,
  messageErrorType,
  validateRequiredFields,
} from '@/helper/utils';
import { createPartner, getCommonPartnerTypes, getPartner, updatePartner } from '@/services';

import { RadioValue } from '@/components/CustomRadio/types';
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
import InfoModal from '@/components/Modal/InfoModal';
import { MemorizeTableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { CustomTabs } from '@/components/Tabs';
import { CormorantBodyText, Title } from '@/components/Typography';
import AuthorizedCountryModal from '@/features/distributors/components/AuthorizedCountryModal';
import CityModal from '@/features/locations/components/CityModal';
import CountryModal from '@/features/locations/components/CountryModal';
import StateModal from '@/features/locations/components/StateModal';
import { PartnerTabKey } from '@/pages/Brand/Adminstration/Partners';
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
  | 'info'
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
  const isUpdate = Boolean(partnerId);

  const {
    data,
    handleInputChange,
    handleInputDelete,
    handleOnChange,
    handlePhoneChange,
    handleRadioChange,
    setData,
  } = useEntryFormHandlers<CompanyForm>(initialCompanyForm);

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

  useEffect(() => {
    if (Object.values(associationOther).every((value) => value === '')) {
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
      setData({ ...res, price_rate: Number.parseFloat(res.price_rate.toString()).toFixed(2) });
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

  const handleCloseEntryForm = () => pushTo(`${PATH.brandPartners}?tab=company`);

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

  const handleAssociationChange =
    (type: 'affiliation' | 'relation' | 'acquisition') => (radioValue: RadioValue) => {
      if (radioValue.value !== 'other') {
        handleOnChange(`${type}_id`, radioValue.value as string);
        return;
      }

      handleOnChange(`${type}_id`, radioValue.label as string);
      setAssociationOther((prev) => ({
        ...prev,
        [type]: radioValue.label,
      }));
    };

  const normalizePriceRate = (formData: CompanyForm) => {
    return {
      ...formData,
      price_rate: parseFloat(formData.price_rate.toString()),
    };
  };

  const handleSubmit = async () => {
    if (!validateRequiredFields(data, getRequiredFields())) return;
    showPageLoading();
    setClearOther(true);

    if (isUpdate) {
      const res = await updatePartner(partnerId, normalizePriceRate(data));
      if (res) {
        setData({ ...res, price_rate: Number.parseFloat(res.price_rate.toString()).toFixed(2) });
        setClearOther(false);
        await sortedCommonPartnerTypeList();
      }
      return;
    }

    const res = await createPartner(normalizePriceRate(data));
    if (res) handleCloseEntryForm();
  };

  const handleSetModalVisible = (visible: boolean) => (visible ? ' undefined' : setIsOpenModal(''));

  const handleToggleModal = (type: ModalType) => () => setIsOpenModal(type);

  const panels = useMemo(
    () => [
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
    ],
    [],
  );

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

  const accountProfileInfo = {
    title: 'ACCOUNT PROFILE',
    content: [
      {
        id: 1,
        heading: 'Affiliation',
        description: (
          <>
            The{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Affiliation
            </CormorantBodyText>{' '}
            label defines the nature of the business activities with the partner company. The
            default list is{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Agent
            </CormorantBodyText>{' '}
            and{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Distributor
            </CormorantBodyText>
            , but you could always add a new definition.
          </>
        ),
      },
      {
        id: 2,
        heading: 'Relation',
        description: (
          <>
            The{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Relation
            </CormorantBodyText>{' '}
            label refers to the connections and interactions between various entities involved in
            business activities. The default list is{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Direct
            </CormorantBodyText>{' '}
            and{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Indirect
            </CormorantBodyText>
            , but you could always add a new definition.
          </>
        ),
      },
      {
        id: 3,
        heading: 'Acquisition',
        description: (
          <>
            The{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Acquisition
            </CormorantBodyText>{' '}
            label refers to the process of acquiring new customers for the business through sales
            activities. Leads, Awareness, Interests and Negotiation define the different steps of
            the process.
            <div>
              <span className="indigo-dark-variant mr-8 font-medium">Active</span> The Active label
              give partners full access to the product list and pricing model.
            </div>
            <div>
              <span className="orange mr-8 font-medium">Freeze</span> The Freeze label temporarily
              freezes the usage of the pricing model for quotations.
            </div>
            <div>
              <span className="text-14 mr-8 font-medium red-magenta">Inactive</span> An Inactive
              label terminates access to all functions, but partners profile remains.
            </div>
          </>
        ),
      },
      {
        id: 4,
        heading: 'Price Rate',
        description: (
          <>
            The{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Price Rate
            </CormorantBodyText>
            , defaulting at 1.00, sets the profit margin preference for your partners. The rate will
            multiply by the product base rate and then be converted to the product unit rate for
            each of your partners. Noted 1.00 price rate equals to 100 in percentage weight.
          </>
        ),
      },
      {
        id: 5,
        heading: 'Authorized Country',
        description: (
          <>
            The{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Authorized Country
            </CormorantBodyText>{' '}
            highlights the distribution rights under the contract between the brand company and
            channel partner.
          </>
        ),
      },
      {
        id: 6,
        heading: 'Coverage Beyond',
        description: (
          <>
            The brand company could extend the unauthorized country territory rights by selecting
            the{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Allow
            </CormorantBodyText>{' '}
            or{' '}
            <CormorantBodyText customClass="common-cormorant-garamond-text">
              Not Allow
            </CormorantBodyText>{' '}
            button. This change might impact product search and display options.
          </>
        ),
      },
    ],
  };

  return (
    <>
      <MemorizeTableHeader title="PARTNERS" customClass={styles.partnerHeader} />
      <header className="d-flex">
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
      </header>

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
          onChange={handleInputChange('name')}
          onDelete={handleInputDelete('name')}
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
          onChange={handleInputChange('website')}
          onDelete={handleInputDelete('website')}
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
          disabled={data.state_id === ''}
        />
        <FormGroup label="Address" required layout="vertical">
          <CustomTextArea
            maxLength={120}
            showCount
            boxShadow
            placeholder="unit #, street / road name"
            value={data.address}
            name="address"
            onChange={handleInputChange('address')}
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
          onChange={handleInputChange('postal_code')}
          onDelete={handleInputDelete('postal_code')}
          message={messageError(data.postal_code, MESSAGE_ERROR.POSTAL_CODE, 10)}
          messageType={messageErrorType(data.postal_code, 10, 'error', 'normal')}
          deleteIcon
        />
        <FormGroup label="General Phone" required layout="vertical" formClass={styles.formGroup}>
          <PhoneInput
            phonePlaceholder="area code / number"
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
          onChange={handleInputChange('email')}
          onDelete={handleInputDelete('email')}
          deleteIcon
          message={getEmailMessageError(data.email, MESSAGE_ERROR.EMAIL_INVALID)}
          messageType={getEmailMessageErrorType(data.email, 'error', 'normal')}
        />

        <Title
          level={8}
          customClass="py-10 my-16 bottom-border-inset-black cursor-pointer d-flex items-center"
          onClick={handleToggleModal('info')}
        >
          ACCOUNT PROFILE
          <WarningIcon className="ml-8" />
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
            onChange={handleAssociationChange('affiliation')}
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
            onChange={handleAssociationChange('relation')}
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
            onChange={handleAssociationChange('acquisition')}
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
          onChange={handleInputChange('price_rate')}
          onDelete={handleInputDelete('price_rate')}
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
            onChange={handleRadioChange('coverage_beyond')}
          />
        </FormGroup>
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

      <InfoModal
        isOpen={isOpenModal === 'info'}
        onCancel={handleToggleModal('')}
        title={accountProfileInfo.title}
        content={accountProfileInfo.content}
      />
    </>
  );
};

export default CompanyEntryForm;

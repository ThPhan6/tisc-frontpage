import { FC, useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';

import { pushTo } from '@/helper/history';
import {
  getEmailMessageError,
  getEmailMessageErrorType,
  isEmptySpace,
  messageError,
  messageErrorType,
  validatePostalCode,
} from '@/helper/utils';

import { CustomResourceForm, CustomResourceType } from '../type';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { useAppSelector } from '@/reducers';

import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { MainTitle } from '@/components/Typography';
import CityModal from '@/features/locations/components/CityModal';
import CountryModal from '@/features/locations/components/CountryModal';
import StateModal from '@/features/locations/components/StateModal';

import styles from '../CustomResource.less';
import { AssociateModal } from './AssociateModal';

interface CustomResourceFormProps {
  data: CustomResourceForm;
  setData: (data: CustomResourceForm) => void;
  type: 'view' | 'create';
}

type FieldName = keyof CustomResourceForm;

type ModalType = '' | 'city' | 'state' | 'country' | 'associate';

export const CustomResourceEntryForm: FC<CustomResourceFormProps> = ({ data, setData, type }) => {
  const [openModal, setOpenModal] = useState<ModalType>('');

  const [countryData, setCountryData] = useState({
    label: '',
    value: data.country_id,
    phoneCode: data.phone_code ?? '00',
  });

  const [stateData, setStateData] = useState({ label: '', value: data.state_id });

  const [cityData, setCityData] = useState({ label: '', value: data.city_id });

  const [associated, setAssociated] = useState<CheckboxValue[]>(
    data.associate_resource_ids.map((associate) => {
      return {
        label: '',
        value: associate,
      };
    }),
  );

  const customResourceType = useAppSelector((state) => state.customResource.customResourceType);

  const onChangeData = (fieldName: FieldName, fieldValue: any) => {
    setData({ ...data, [fieldName]: fieldValue });
  };

  const onChangePostalCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    // only 10 chars and cannot type space
    if (!validatePostalCode(e.target.value) || !isEmptySpace(e.target.value)) {
      return;
    }
    setData({
      ...data,
      postal_code: e.target.value,
    });
  };

  const setModalVisible = (visible: boolean) => (visible ? undefined : setOpenModal(''));

  useEffect(() => {
    if (countryData.value !== '') {
      setData({ ...data, phone_code: countryData.phoneCode, country_id: countryData.value });
    }
  }, [countryData]);

  useEffect(() => {
    onChangeData('state_id', stateData.value);
  }, [stateData]);

  useEffect(() => {
    onChangeData('city_id', cityData.value);
  }, [cityData]);

  useEffect(() => {
    onChangeData(
      'associate_resource_ids',
      associated.map((item) => item.value),
    );
  }, [associated]);

  return (
    <>
      <div className={styles.header}>
        <MainTitle level={3} textAlign={'center'} customClass={styles.header__title}>
          Entry Form
        </MainTitle>
        {type === 'create' && (
          <CloseIcon
            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
            onClick={() => pushTo(PATH.designerCustomResource)}
          />
        )}
      </div>
      <div
        style={{
          height: 'calc(100vh - 256px)',
          background: '#fff',
          padding: '16px',
          overflow: 'auto',
        }}>
        <InputGroup
          label={`${
            customResourceType === CustomResourceType.Brand ? 'Brand' : 'Distributor'
          } Company Name`}
          required
          fontLevel={3}
          value={data.business_name}
          hasPadding
          colorPrimaryDark={type === 'create'}
          hasBoxShadow
          hasHeight
          placeholder="type company name"
          onChange={(e) => {
            onChangeData('business_name', e.target.value);
          }}
          deleteIcon={type === 'create'}
          onDelete={() => onChangeData('business_name', '')}
          readOnly={type === 'view'}
        />
        <InputGroup
          label="Website"
          required
          fontLevel={3}
          value={data.website_uri}
          hasPadding
          colorPrimaryDark={type === 'create'}
          hasBoxShadow
          hasHeight
          placeholder="copy and paste the URL link"
          onChange={(e) => onChangeData('website_uri', e.target.value)}
          deleteIcon={type === 'create'}
          onDelete={() => onChangeData('website_uri', '')}
          readOnly={type === 'view'}
        />
        <InputGroup
          label={`Associated ${
            customResourceType === CustomResourceType.Brand ? 'Distributor(s)' : 'Brand(s)'
          } :`}
          fontLevel={3}
          value={associated.map((item) => item.label).join(', ')}
          hasPadding
          colorPrimaryDark={type === 'create'}
          hasBoxShadow
          hasHeight
          rightIcon={type === 'create'}
          onRightIconClick={() => setOpenModal('associate')}
          placeholder="slect from the list"
          readOnly={type === 'view'}
          containerClass={styles.associate}
        />
        <InputGroup
          label="Country Location"
          required
          fontLevel={3}
          value={countryData.label}
          hasPadding
          colorPrimaryDark={type === 'create'}
          hasBoxShadow
          hasHeight
          rightIcon={type === 'create'}
          onRightIconClick={() => setOpenModal('country')}
          placeholder="country list"
          readOnly={type === 'view'}
        />
        <InputGroup
          label="State / Province"
          required
          fontLevel={3}
          value={stateData.label}
          hasPadding
          colorPrimaryDark={type === 'create'}
          hasBoxShadow
          hasHeight
          rightIcon={type === 'create'}
          disabled={data.country_id === '-1' || data.country_id === ''}
          onRightIconClick={() => setOpenModal('state')}
          placeholder={type === 'create' ? 'select from the list' : ''}
          readOnly={type === 'view'}
        />
        <InputGroup
          label="City / Town"
          required
          fontLevel={3}
          value={cityData.label?.toString()}
          hasPadding
          colorPrimaryDark={type === 'create'}
          hasBoxShadow
          hasHeight
          rightIcon={type === 'create'}
          disabled={data.state_id === ''}
          onRightIconClick={() => setOpenModal('city')}
          placeholder={type === 'create' ? 'select from the list' : ''}
          readOnly={type === 'view'}
        />
        <div className={styles.addressForm}>
          <FormGroup label="Address" layout="vertical" required labelFontSize={3}>
            <CustomTextArea
              className={`${styles.address} ${type === 'view' ? styles.customInput : ''}`}
              maxLength={100}
              showCount
              placeholder="type here"
              borderBottomColor="mono-medium"
              onChange={(e) => onChangeData('address', e.target.value)}
              value={data.address}
              boxShadow
              readOnly={type === 'view'}
            />
          </FormGroup>
        </div>

        <InputGroup
          label="Postal / Zip Code"
          placeholder="postal / zip code"
          required
          deleteIcon={type === 'create'}
          fontLevel={3}
          value={data.postal_code}
          hasPadding
          colorPrimaryDark={type === 'create'}
          hasBoxShadow
          hasHeight
          onChange={(e) => onChangePostalCode(e)}
          onDelete={() => onChangeData('postal_code', '')}
          message={messageError(data.postal_code, MESSAGE_ERROR.POSTAL_CODE, 10)}
          messageType={messageErrorType(data.postal_code, 10, 'error', 'normal')}
          readOnly={type === 'view'}
        />
        <FormGroup
          label="General Phone"
          required
          layout="vertical"
          labelFontSize={3}
          style={{ marginBottom: '16px' }}>
          <PhoneInput
            phonePlaceholder="area code / number"
            onChange={(value) => {
              onChangeData('general_phone', value.phoneNumber);
            }}
            codeReadOnly
            value={{
              zoneCode: countryData.phoneCode,
              phoneNumber: data.general_phone,
            }}
            deleteIcon={type === 'create'}
            containerClass={type === 'create' ? styles.phoneInput : ''}
            phoneNumberReadOnly={type === 'view'}
          />
        </FormGroup>
        <InputGroup
          label="General Email"
          placeholder="type email address here"
          required
          deleteIcon={type === 'create'}
          fontLevel={3}
          value={data.general_email}
          hasPadding
          colorPrimaryDark={type === 'create'}
          hasBoxShadow
          hasHeight
          onChange={(e) => onChangeData('general_email', e.target.value)}
          readOnly={type === 'view'}
          onDelete={() => onChangeData('general_email', '')}
          message={getEmailMessageError(data.general_email, MESSAGE_ERROR.EMAIL_INVALID)}
          messageType={getEmailMessageErrorType(data.general_email, 'error', 'normal')}
        />
      </div>
      <CountryModal
        visible={openModal === 'country'}
        setVisible={setModalVisible}
        chosenValue={countryData}
        setChosenValue={setCountryData}
        withPhoneCode
        hasGlobal={false}
      />
      <StateModal
        countryId={data.country_id}
        visible={openModal === 'state'}
        setVisible={setModalVisible}
        chosenValue={stateData}
        setChosenValue={setStateData}
      />

      <CityModal
        stateId={data.state_id}
        countryId={data.country_id}
        visible={openModal === 'city'}
        setVisible={setModalVisible}
        chosenValue={cityData}
        setChosenValue={setCityData}
      />

      <AssociateModal
        visible={openModal === 'associate'}
        setVisible={setModalVisible}
        chosenValue={associated}
        setChosenValue={setAssociated}
      />
    </>
  );
};

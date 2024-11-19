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

import CustomButton from '@/components/Button';
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
  type: 'view' | 'create' | 'update';
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
    data?.associate_resource_ids?.map((associate) => {
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

  const onChangeTypeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    // only 10 chars and cannot type space
    // Postal code has same rule to utilize it
    if (!validatePostalCode(e.target.value) || !isEmptySpace(e.target.value)) {
      return;
    }
    setData({
      ...data,
      type_code: e.target.value,
    });
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
      associated?.map((item) => item.value),
    );
  }, [associated]);

  const isEdit = type !== 'view';

  const labelColor = type !== 'create' ? 'mono-color-dark' : 'mono-color';

  return (
    <>
      <div className={styles.header}>
        <MainTitle level={3} textAlign={'center'} customClass={styles.header__title}>
          {customResourceType === CustomResourceType.Brand ? 'Brand' : 'Distributor'} Information
        </MainTitle>
        {isEdit ? (
          <CloseIcon
            style={{ cursor: 'pointer', width: '24px', height: '24px' }}
            onClick={() => pushTo(PATH.designerCustomResource)}
          />
        ) : (
          <CustomButton
            size="small"
            variant="primary"
            properties="rounded"
            onClick={() => pushTo(PATH.designerCustomResource)}
          >
            Close
          </CustomButton>
        )}
      </div>
      <div className={styles.form}>
        <InputGroup
          label="Company Type & Code"
          fontLevel={3}
          value={data.type_code}
          hasPadding
          colorPrimaryDark={isEdit}
          hasBoxShadow
          hasHeight
          placeholder="type code, max. 10 letters"
          onChange={(e) => onChangeTypeCode(e)}
          deleteIcon={isEdit}
          onDelete={() => onChangeData('type_code', '')}
          readOnly={type === 'view'}
          labelColor={labelColor}
        />
        <InputGroup
          label={`${
            customResourceType === CustomResourceType.Brand ? 'Brand' : 'Distributor'
          } Company Name`}
          required
          fontLevel={3}
          value={data.business_name}
          hasPadding
          colorPrimaryDark={isEdit}
          hasBoxShadow
          hasHeight
          placeholder="type company name"
          onChange={(e) => {
            onChangeData('business_name', e.target.value);
          }}
          deleteIcon={isEdit}
          onDelete={() => onChangeData('business_name', '')}
          readOnly={type === 'view'}
          labelColor={labelColor}
        />
        <InputGroup
          label="Website"
          required
          fontLevel={3}
          value={data.website_uri}
          hasPadding
          colorPrimaryDark={isEdit}
          hasBoxShadow
          hasHeight
          placeholder="copy and paste the URL link"
          onChange={(e) => onChangeData('website_uri', e.target.value)}
          deleteIcon={isEdit}
          onDelete={() => onChangeData('website_uri', '')}
          readOnly={type === 'view'}
          labelColor={labelColor}
        />
        <InputGroup
          label={`Associated ${
            customResourceType === CustomResourceType.Brand ? 'Distributor(s)' : 'Brand(s)'
          } :`}
          fontLevel={3}
          value={associated?.map((item) => item.label).join(', ')}
          hasPadding
          colorPrimaryDark={isEdit}
          hasBoxShadow
          hasHeight
          rightIcon={isEdit}
          onRightIconClick={() => setOpenModal('associate')}
          placeholder={isEdit ? 'select from the list' : ''}
          readOnly={type === 'view'}
          containerClass={styles.associate}
          labelColor={labelColor}
        />
        <InputGroup
          label="Country Location"
          fontLevel={3}
          value={countryData.label}
          hasPadding
          colorPrimaryDark={isEdit}
          hasBoxShadow
          hasHeight
          rightIcon={isEdit}
          onRightIconClick={() => setOpenModal('country')}
          placeholder="country list"
          readOnly={type === 'view'}
          labelColor={labelColor}
        />
        <InputGroup
          label="State / Province"
          fontLevel={3}
          value={stateData.label}
          hasPadding
          colorPrimaryDark={isEdit}
          hasBoxShadow
          hasHeight
          rightIcon={isEdit}
          disabled={data.country_id === '-1' || data.country_id === ''}
          onRightIconClick={() => setOpenModal('state')}
          placeholder={isEdit ? 'select from the list' : ''}
          readOnly={type === 'view'}
          labelColor={labelColor}
        />
        <InputGroup
          label="City / Town"
          fontLevel={3}
          value={cityData.label?.toString()}
          hasPadding
          colorPrimaryDark={isEdit}
          hasBoxShadow
          hasHeight
          rightIcon={isEdit}
          disabled={data.state_id === ''}
          onRightIconClick={() => setOpenModal('city')}
          placeholder={isEdit ? 'select from the list' : ''}
          readOnly={type === 'view'}
          labelColor={labelColor}
        />
        <div className={styles.addressForm}>
          <FormGroup label="Address" layout="vertical" labelFontSize={3} labelColor={labelColor}>
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
          deleteIcon={isEdit}
          fontLevel={3}
          value={data.postal_code}
          hasPadding
          colorPrimaryDark={isEdit}
          hasBoxShadow
          hasHeight
          onChange={(e) => onChangePostalCode(e)}
          onDelete={() => onChangeData('postal_code', '')}
          message={messageError(data.postal_code ?? '', MESSAGE_ERROR.POSTAL_CODE, 10)}
          messageType={messageErrorType(data.postal_code ?? '', 10, 'error', 'normal')}
          readOnly={type === 'view'}
          labelColor={labelColor}
        />
        <FormGroup
          label="General Phone"
          required
          layout="vertical"
          labelFontSize={3}
          labelColor={labelColor}
          style={{ marginBottom: '16px' }}
        >
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
            deleteIcon={isEdit}
            containerClass={isEdit ? styles.phoneInput : ''}
            phoneNumberReadOnly={type === 'view'}
          />
        </FormGroup>
        <InputGroup
          label="General Email"
          placeholder="type email address here"
          required
          deleteIcon={isEdit}
          fontLevel={3}
          value={data.general_email}
          hasPadding
          colorPrimaryDark={isEdit}
          hasBoxShadow
          hasHeight
          onChange={(e) => onChangeData('general_email', e.target.value)}
          readOnly={type === 'view'}
          onDelete={() => onChangeData('general_email', '')}
          message={getEmailMessageError(data.general_email, MESSAGE_ERROR.EMAIL_INVALID)}
          messageType={getEmailMessageErrorType(data.general_email, 'error', 'normal')}
          labelColor={labelColor}
        />
        <div className={styles.addressForm}>
          <FormGroup label="Notes" layout="vertical" labelFontSize={3} labelColor={labelColor}>
            <CustomTextArea
              className={`${styles.address} ${type === 'view' ? styles.customInput : ''}`}
              maxLength={100}
              showCount
              placeholder="type here"
              borderBottomColor="mono-medium"
              onChange={(e) => onChangeData('notes', e.target.value)}
              value={data.notes}
              boxShadow
              readOnly={type === 'view'}
            />
          </FormGroup>
        </div>
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

import { FC, useEffect, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';

import { pushTo } from '@/helper/history';
import { messageError, messageErrorType } from '@/helper/utils';

import { CustomResourceForm } from '../../types';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { useAppSelector } from '@/reducers';

import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { TableHeader } from '@/components/Table/TableHeader';
import { MainTitle } from '@/components/Typography';
import CityModal from '@/features/locations/components/CityModal';
import CountryModal from '@/features/locations/components/CountryModal';
import StateModal from '@/features/locations/components/StateModal';

import { CustomResourceValue } from '../../CustomResource';
import styles from '../../CustomResource.less';
import { AssociateModal } from './AssociateModal';

interface CustomResourceFormProps {
  data: CustomResourceForm;
  setData: (data: CustomResourceForm) => void;
}

type FieldName = keyof CustomResourceForm;

type ModalType = '' | 'city' | 'state' | 'country' | 'associate';

export const CustomResourceEntryForm: FC<CustomResourceFormProps> = ({ data, setData }) => {
  const [openModal, setOpenModal] = useState<ModalType>('');

  const [countryData, setCountryData] = useState({
    label: '',
    value: data.country_id,
    phoneCode: '00',
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

  const viewBy = useAppSelector((state) => state.officeProduct.customResourceValue);

  const onChangeData = (fieldName: FieldName, fieldValue: any) => {
    setData({ ...data, [fieldName]: fieldValue });
  };

  const setModalVisible = (visible: boolean) => (visible ? undefined : setOpenModal(''));

  useEffect(() => {
    if (countryData.value !== '') {
      onChangeData('country_id', countryData.value);
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
      <TableHeader
        title={
          <MainTitle level={3} style={{ textAlign: 'center' }}>
            Entry Form
          </MainTitle>
        }
        rightAction={
          <CloseIcon
            onClick={() => pushTo(PATH.designerCustomResource)}
            style={{ cursor: 'pointer' }}
          />
        }
      />
      <div
        style={{
          height: 'calc(100vh - 256px)',
          background: '#fff',
          padding: '16px',
          overflow: 'auto',
        }}>
        <FormGroup
          label={`${viewBy === CustomResourceValue.Brand ? 'Brand' : 'Distributor'} Company Name`}
          required
          layout="vertical"
          style={{ marginBottom: '16px' }}>
          <CustomInput
            placeholder="type company name"
            borderBottomColor="mono-medium"
            value={data.business_name}
            onChange={(e) => {
              onChangeData('business_name', e.target.value);
            }}
          />
        </FormGroup>
        <FormGroup label="Website" required layout="vertical" style={{ marginBottom: '16px' }}>
          <CustomInput
            placeholder="copy and paste the URL link"
            borderBottomColor="mono-medium"
            value={data.website_uri}
            onChange={(e) => onChangeData('website_uri', e.target.value)}
          />
        </FormGroup>
        <InputGroup
          label={`Associated ${
            viewBy === CustomResourceValue.Brand ? 'Brand(s)' : 'Distributor(s)'
          }`}
          fontLevel={3}
          value={associated.map((item) => item.label).join(', ')}
          hasPadding
          colorPrimaryDark
          hasBoxShadow
          hasHeight
          rightIcon
          onRightIconClick={() => setOpenModal('associate')}
          placeholder="copy and paste the URL link"
        />
        <InputGroup
          label="Country Location"
          fontLevel={3}
          value={countryData.label?.toString()}
          hasPadding
          colorPrimaryDark
          hasBoxShadow
          hasHeight
          rightIcon
          onRightIconClick={() => setOpenModal('country')}
          placeholder="country list"
        />
        <InputGroup
          label="State / Province"
          fontLevel={3}
          value={stateData.label?.toString()}
          hasPadding
          colorPrimaryDark
          hasBoxShadow
          hasHeight
          rightIcon
          disabled={data.country_id === '-1' || data.country_id === ''}
          onRightIconClick={() => setOpenModal('state')}
          placeholder="select from the list"
        />
        <InputGroup
          label="City / Town"
          fontLevel={3}
          value={cityData.label?.toString()}
          hasPadding
          colorPrimaryDark
          hasBoxShadow
          hasHeight
          rightIcon
          disabled={data.state_id === ''}
          onRightIconClick={() => setOpenModal('city')}
          placeholder="select from the list"
        />
        <FormGroup label="Address" layout="vertical">
          <CustomTextArea
            className={styles.address}
            maxLength={100}
            showCount
            placeholder="type here"
            borderBottomColor="mono-medium"
            onChange={(e) => onChangeData('address', e.target.value)}
            value={data.address}
            boxShadow
          />
        </FormGroup>
        <InputGroup
          label="Postal / Zip Code"
          placeholder="postal / zip code"
          required
          deleteIcon
          fontLevel={3}
          value={data.postal_code}
          hasPadding
          colorPrimaryDark
          hasBoxShadow
          hasHeight
          onChange={(e) => onChangeData('postal_code', e.target.value)}
          onDelete={() => onChangeData('postal_code', '')}
          message={messageError(data.postal_code, MESSAGE_ERROR.POSTAL_CODE, 10)}
          messageType={messageErrorType(data.postal_code, 10, 'error', 'normal')}
        />
        <FormGroup
          label="General Phone"
          required
          layout="vertical"
          style={{ marginBottom: '16px' }}>
          <PhoneInput
            phonePlaceholder="area code / number"
            onChange={(value) => {
              onChangeData('general_phone', value.phoneNumber);
            }}
            colorPlaceholder="mono"
            codeReadOnly
            value={{
              zoneCode: countryData.phoneCode,
              phoneNumber: data.general_phone,
            }}
            deleteIcon
          />
        </FormGroup>
        <InputGroup
          label="General Email"
          placeholder="type email address here"
          required
          deleteIcon
          fontLevel={3}
          value={data.general_email}
          hasPadding
          colorPrimaryDark
          hasBoxShadow
          hasHeight
          onChange={(e) => onChangeData('general_email', e.target.value)}
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

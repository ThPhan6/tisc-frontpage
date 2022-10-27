import { FC, useEffect, useState } from 'react';

import { getIssuingFor } from '@/features/project/services';
import { getBusinessAddress } from '@/helper/utils';

import { PdfDetail } from '../type';
import { LocationDetail } from '@/features/locations/type';

import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import DateInput from '@/components/Form/DateInput';
import { BusinessDetail } from '@/features/product/components/BrandContact';

import styles from '../index.less';
import { getLocationPagination } from '@/features/locations/api';

interface IssuingInformationProps {
  data: PdfDetail;
  onChangeData: (newData: PdfDetail) => void;
}
const IssuingInformation: FC<IssuingInformationProps> = ({ data, onChangeData }) => {
  const [location, setLocation] = useState<LocationDetail[]>([]);
  const [issuingFor, setIssuingFor] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getLocationPagination({ page: 1, pageSize: 99999 }, (response) => {
      setLocation(response.data);
    });
    getIssuingFor().then((res) => {
      setIssuingFor(res);
    });
  }, []);

  const issuingOffice = location.find((item) => item.id === data.config.location_id);
  const issuingForValue = issuingFor.find((item) => item.id === data.config.issuing_for_id);

  const renderLabelHeader = (value: LocationDetail) => {
    return (
      <BusinessDetail
        business={value.business_name}
        type={value.functional_type}
        address={getBusinessAddress(value)}
        country={value.country_name.toUpperCase()}
        phone_code={value.phone_code}
        general_phone={value.general_phone}
        genernal_email={value.general_email}
        customClass={styles.business}
      />
    );
  };

  return (
    <div className={styles.formInformation}>
      <FormGroup
        label="Issuing Office"
        required
        layout="vertical"
        formClass={`${styles.formGroup} ${
          data.config.location_id !== '' ? styles.activeText : ''
        }`}>
        <CollapseRadioList
          options={location?.map((office) => {
            return {
              label: renderLabelHeader(office),
              value: office.id,
            };
          })}
          placeholder={
            data.config.location_id === '' ? 'select from the list' : issuingOffice?.business_name
          }
          checked={data.config.location_id}
          onChange={(checkedItem) => {
            onChangeData({
              ...data,
              config: {
                ...data.config,
                location_id: String(checkedItem.value),
              },
            });
          }}
        />
      </FormGroup>
      <FormGroup
        label="Issuing For"
        required
        layout="vertical"
        formClass={data.config.issuing_for_id !== '' ? styles.activeText : ''}>
        <CollapseRadioList
          options={issuingFor.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          })}
          placeholder={
            data.config.issuing_for_id === '' ? 'select from the list' : issuingForValue?.name
          }
          otherInput
          checked={data.config.issuing_for_id}
          onChange={(checkedItem) => {
            onChangeData({
              ...data,
              config: {
                ...data.config,
                issuing_for_id: String(
                  checkedItem.value === 'other' ? checkedItem.label : checkedItem.value,
                ),
              },
            });
          }}
        />
      </FormGroup>
      <FormGroup label="Issuing Date" required layout="vertical">
        <DateInput
          value={data.config.issuing_date}
          onChange={(date) =>
            onChangeData({
              ...data,
              config: { ...data.config, issuing_date: date?.format('YYYY-MM-DD') ?? '' },
            })
          }
        />
      </FormGroup>
      <FormGroup label="Revision #" layout="vertical">
        <CustomInput
          placeholder="e.g. Rev.01"
          borderBottomColor="mono-medium"
          value={data.config.revision}
          onChange={(e) =>
            onChangeData({
              ...data,
              config: {
                ...data.config,
                revision: e.target.value,
              },
            })
          }
          containerClass={styles.revision}
        />
      </FormGroup>
    </div>
  );
};
export default IssuingInformation;

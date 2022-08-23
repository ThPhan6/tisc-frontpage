import type { FC } from 'react';

import { formatPhoneCode } from '@/helper/utils';
import { upperCase } from 'lodash';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import type { MarketAvailabilityDetailRegionCountry, MarketAvailabilityDetails } from '@/types';

import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import { EntryFormWrapper } from '@/components/EntryForm';
import { BodyText, Title } from '@/components/Typography';

import styles from '../styles/MarketAvailabilityEntryForm.less';

interface MarketAvailabilityEntryFormProps {
  data: MarketAvailabilityDetails;
  setData: (data: MarketAvailabilityDetails) => void;
  onCancel: () => void;
  onSubmit: (data: string[]) => void;
  submitButtonStatus: boolean;
}

export const MarketAvailabilityEntryForm: FC<MarketAvailabilityEntryFormProps> = ({
  data,
  setData,
  onCancel,
  onSubmit,
  submitButtonStatus,
}) => {
  const checked: CheckboxValue[] = [];
  data.regions.forEach((region) => {
    region.countries.forEach((country) => {
      if (country.available) {
        checked.push({
          label: '',
          value: country.id.toString(),
        });
      }
    });
  });

  const setChecked = (checkedData: CheckboxValue[]) => {
    const newData = { ...data };
    let totalActive = 0;
    newData.regions = newData.regions.map((region) => {
      return {
        ...region,
        countries: region.countries.map((country) => {
          const availability = checkedData.find((item) => item.value === country.id.toString());
          if (availability) {
            totalActive++;
          }
          return {
            ...country,
            available: availability ? true : false,
          };
        }),
      };
    });
    newData.total_available = totalActive;
    setData(newData);
  };

  /// for country label
  const renderOptionLabel = (item: MarketAvailabilityDetailRegionCountry) => {
    return (
      <BodyText level={5} fontFamily="Roboto">
        <span style={{ marginRight: '8px' }}>{item.name}</span>
        <span>{formatPhoneCode(item.phone_code)}</span>
      </BodyText>
    );
  };

  const handleSubmitData = () => {
    onSubmit(checked.map((item) => item.value));
  };

  return (
    <>
      <EntryFormWrapper
        handleCancel={onCancel}
        handleSubmit={handleSubmitData}
        submitButtonStatus={submitButtonStatus}
        title={upperCase(data.collection_name)}
        textAlignTitle="left"
        customClass={styles.entry_form}
        headerContent={
          <div className={styles.header}>
            <div className={styles.header_content}>
              <Title level={8}>
                Total Distributed Countries
                <span> (distributors and its authorised countries): </span>
              </Title>
            </div>
            <Title level={8} customClass="total-available">
              {data.total}
            </Title>
          </div>
        }
        footerContent={
          <div className={styles.footer}>
            <BodyText level={6} fontFamily="Roboto">
              Total Available Countries
            </BodyText>
            <BodyText level={3} customClass={styles.footer_colon}>
              :
            </BodyText>
            {/* waitting to pass count TAC */}
            <Title level={8} customClass={styles.footer_quantity}>
              {data.total_available}
            </Title>
          </div>
        }>
        <DropdownCheckboxList
          data={data.regions.map((region) => {
            return {
              name: region.name,
              options: region.countries.map((country) => ({
                label: renderOptionLabel(country),
                value: country.id.toString(),
              })),
            };
          })}
          renderTitle={(dropdownData) => dropdownData.name}
          selected={checked}
          onChange={setChecked}
          combinable
        />
      </EntryFormWrapper>
    </>
  );
};

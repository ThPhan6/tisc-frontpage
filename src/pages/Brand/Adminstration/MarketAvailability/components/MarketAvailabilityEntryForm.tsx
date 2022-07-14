import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { EntryFormWrapper } from '@/components/EntryForm';
import { BodyText, Title } from '@/components/Typography';
import { sum } from 'lodash';
import { FC } from 'react';
import styles from '../styles/MarketAvailabilityEntryForm.less';

interface IContinent {
  country_name: string;
  phone_code: string;
}

interface IMarketAvailabilityEntryForm {
  value: any;
  onChange: (value: any) => void;
  onCancel: () => void;
  onSubmit: (data: any) => void;
  submitButtonStatus: boolean;
}

const countriesData = [
  {
    continent: 'ASIA',
    options: [
      { label: { country_name: 'China', phone_code: '+86' }, value: '1' },
      { label: { country_name: 'VietNam', phone_code: '+84' }, value: '2' },
    ],
  },
  {
    continent: 'EUROPE',
    options: [
      { label: { country_name: 'England', phone_code: '+186' }, value: '11' },
      { label: { country_name: 'Russia', phone_code: '+16' }, value: '23' },
      { label: { country_name: 'Ukraine', phone_code: '+161' }, value: '22' },
    ],
  },
];

export const MarketAvailabilityEntryForm: FC<IMarketAvailabilityEntryForm> = ({
  value,
  onChange,
  onCancel,
  onSubmit,
  submitButtonStatus,
}) => {
  /// Total Distributed Countries
  const countTDC = sum(countriesData.map((country) => country.options?.length));

  const handleSelectedCountry = (selectedCountry: CheckboxValue[]) => {
    onChange(selectedCountry);

    /// handle Total Avaiable Countries, comming
    // using country selected to set count TAC
    // onChange({...props, count_TAC: selectedCountry.length})
  };

  /// for country label
  const renderLabel = (item: IContinent) => {
    return (
      <BodyText level={5} fontFamily="Roboto">
        <span style={{ marginRight: '8px' }}>{item.country_name}</span>
        <span>{item.phone_code}</span>
      </BodyText>
    );
  };

  const handleSubmitData = () => {
    onSubmit(value);
  };

  return (
    <>
      <EntryFormWrapper
        handleCancel={onCancel}
        handleSubmit={handleSubmitData}
        submitButtonStatus={submitButtonStatus}
        title="COLECTION NAME 01"
        textAlignTitle="left"
        customClass={styles.entry_form}
        headerContent={
          <div className={styles.header}>
            <div className={styles.header_content}>
              <Title level={8}>Total Distributed Countries</Title>
              <BodyText level={3}>(distributors and its authorised countries):</BodyText>
            </div>
            <Title level={8}>{countTDC ?? 'N/A'}</Title>
          </div>
        }
        footerContent={
          <div className={styles.footer}>
            <BodyText level={6} fontFamily="Roboto">
              Total Avaiable Countries
            </BodyText>
            <BodyText level={3} customClass={styles.footer_colon}>
              :
            </BodyText>
            {/* waitting to pass count TAC */}
            <Title level={8} customClass={styles.footer_quantity}>
              0
            </Title>
          </div>
        }
      >
        <DropdownCheckboxList
          data={countriesData.map((country) => {
            return {
              key: country.continent,
              options: country.options.map((option) => ({
                label: renderLabel(option.label),
                value: option.value,
              })),
            };
          })}
          renderTitle={(continent) => continent.key}
          /// using selected prop to pass to checkbox
          selected={value}
          onChange={handleSelectedCountry}
        />
      </EntryFormWrapper>
    </>
  );
};

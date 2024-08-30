import { useEffect, useState } from 'react';

import { formatPhoneCode } from '@/helper/utils';
import { getCompanySummary } from '@/services';

import Popover from '@/components/Modal/Popover';
import styles from '@/components/Modal/styles/CompanyModal.less';
import { BodyText } from '@/components/Typography';

interface CompanyModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: any;
  setChosenValue?: (value: any) => void;
  withPhoneCode?: boolean;
}

export interface Company {
  id: string;
  name: string;
  country_name: string;
  phone_code: string;
}

const CompanyModal = ({
  visible,
  setVisible,
  chosenValue,
  setChosenValue,
  withPhoneCode,
}: CompanyModalProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);

  const handleGetCompanies = async () => {
    const res = await getCompanySummary();

    if (res) {
      const newCompanies: Company[] = [];
      setCompanies((res as any)?.company);

      if (chosenValue?.value) {
        const checked = newCompanies.find((item) => item.id === chosenValue.value);

        if (checked) {
          setChosenValue?.({
            label: checked.name,
            value: checked.id,
            phoneCode: checked.phone_code,
            country: checked.country_name,
          });
        }
      }
    }
  };

  useEffect(() => {
    handleGetCompanies();
  }, []);

  return (
    <Popover
      title="SELECT COMPANY"
      visible={visible}
      setVisible={setVisible}
      secondaryModal
      chosenValue={chosenValue}
      setChosenValue={(data) => {
        const selectedCountry = companies.find((company) => company.id === data.value);
        if (selectedCountry) {
          setChosenValue?.({
            label: selectedCountry.name,
            value: selectedCountry.id,
            country: selectedCountry.country_name,
            phoneCode: selectedCountry.phone_code,
          });
        }
      }}
      className={`${styles.company_modal}`}
      groupRadioList={[
        {
          options: companies.map((company) => {
            return {
              label: (
                <>
                  <hgroup className={`${styles.company_modal_heading_group}`}>
                    <BodyText
                      fontFamily="Roboto"
                      level={5}
                      customClass={`${styles.company_modal_heading_group_name}`}
                    >
                      {company.name}
                    </BodyText>
                    <p className={`${styles.company_modal_heading_group_country}`}>
                      {company.country_name}
                    </p>
                  </hgroup>

                  {withPhoneCode ? (
                    <span>{company.id !== '-1' ? formatPhoneCode(company.phone_code) : ''}</span>
                  ) : (
                    ''
                  )}
                </>
              ),
              value: company.id,
            };
          }),
        },
      ]}
    />
  );
};

export default CompanyModal;

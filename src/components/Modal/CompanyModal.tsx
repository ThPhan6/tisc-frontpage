import { useCallback, useEffect, useState } from 'react';

import { getCompanySummary } from '@/services';

import Popover from '@/components/Modal/Popover';
import styles from '@/components/Modal/styles/CompanyModal.less';
import { BodyText } from '@/components/Typography';

export interface SelectedCompany {
  label: string;
  value: string;
  phoneCode?: string;
  country?: string;
}

interface CompanyModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue: SelectedCompany;
  setChosenValue: (value: SelectedCompany) => void;
}

export interface Company {
  id: string;
  name: string;
  country_name: string;
  phone_code: string;
}

const CompanyModal = ({ visible, setVisible, chosenValue, setChosenValue }: CompanyModalProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const handleFetchCompanies = async () => {
      const res: any = await getCompanySummary();
      if (res) {
        setCompanies(res.company);
        if (chosenValue?.value) {
          const selectedCompany = res.company.find(
            (item: Company) => item.id === chosenValue.value,
          );
          if (selectedCompany) {
            setChosenValue({
              label: selectedCompany.name,
              value: selectedCompany.id,
              phoneCode: selectedCompany.phone_code,
              country: selectedCompany.country_name,
            });
          }
        }
      }
    };

    handleFetchCompanies();
  }, []);

  const handleCompanySelection = useCallback(
    (data: { value: string }) => {
      const selectedCompany = companies.find((company) => company.id === data.value);
      if (selectedCompany) {
        setChosenValue({
          label: selectedCompany.name,
          value: selectedCompany.id,
          country: selectedCompany.country_name,
          phoneCode: selectedCompany.phone_code,
        });
      }
    },
    [companies, setChosenValue],
  );

  return (
    <Popover
      title="SELECT COMPANY"
      visible={visible}
      setVisible={setVisible}
      secondaryModal
      chosenValue={chosenValue}
      setChosenValue={handleCompanySelection}
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

import { useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_UNEMPLOYED_COMPANY_NAME } from '@/constants';

import { getCompanySummary } from '@/services';
import { max } from 'lodash';

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

export interface CompanyData {
  companies: Company[];
  unemployed: { id: string; name: string };
}

const CompanyModal = ({ visible, setVisible, chosenValue, setChosenValue }: CompanyModalProps) => {
  const [companyOptions, setCompanyOptions] = useState<CompanyData>({
    companies: [],
    unemployed: { id: '', name: DEFAULT_UNEMPLOYED_COMPANY_NAME },
  });

  useEffect(() => {
    const handleFetchCompanies = async () => {
      const res: any = await getCompanySummary();
      if (res) {
        setCompanyOptions({
          companies: res.company,
          unemployed: { id: res.unemployed_company?.id, name: res.unemployed_company.name },
        });
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
      const selectedCompany = companyOptions.companies.find((company) => company.id === data.value);
      if (selectedCompany) {
        setChosenValue({
          label: selectedCompany.name,
          value: selectedCompany.id,
          country: selectedCompany.country_name,
          phoneCode: selectedCompany.phone_code,
        });
      }

      if (data.value === companyOptions.unemployed.id) {
        setChosenValue({
          label: companyOptions.unemployed.name,
          value: companyOptions.unemployed.id,
          phoneCode: '00',
        });
      }
    },
    [companyOptions, setChosenValue],
  );

  const generalCompanyNameWidth = useMemo(() => {
    const longestCompanyNameLength =
      max(companyOptions.companies.map((company) => company.name.length)) || 0;
    return 8 * longestCompanyNameLength;
  }, [companyOptions.companies]);

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
          options: [
            {
              customClass: `pb-12 border-bottom-light mb-8-px`,
              label: (
                <>
                  <hgroup className={`${styles.company_modal_heading_group}`}>
                    <BodyText
                      fontFamily="Roboto"
                      level={5}
                      customClass={`${styles.company_modal_heading_group_name} ellipsis text-uppercase`}
                    >
                      {companyOptions.unemployed.name}
                    </BodyText>
                  </hgroup>
                </>
              ),
              value: companyOptions.unemployed.id,
            },
            ...companyOptions.companies.map((company) => {
              return {
                customClass: 'mb-16',
                label: (
                  <>
                    <hgroup className={`${styles.company_modal_heading_group}`}>
                      <BodyText
                        fontFamily="Roboto"
                        level={5}
                        customClass={`${styles.company_modal_heading_group_name} ellipsis text-capitalize `}
                        style={{ width: generalCompanyNameWidth }}
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
          ],
        },
      ]}
    />
  );
};

export default CompanyModal;

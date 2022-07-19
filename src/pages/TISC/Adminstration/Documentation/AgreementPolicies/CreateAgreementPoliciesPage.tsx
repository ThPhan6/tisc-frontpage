import { TableHeader } from '@/components/Table/TableHeader';
import { useState } from 'react';
import { EmailAutoRespondEntryForm } from './components/AgreementPoliciesEntryForm';
import { AgreementPoliciesProps } from '@/types';

const DEFAULT_AGREEMENTPOLICIES_VALUE = {
  title: '',
  message: '',
};

const CreateAgreementPoliciesPage = () => {
  const [value, setValue] = useState<AgreementPoliciesProps>(DEFAULT_AGREEMENTPOLICIES_VALUE);

  const handleOnChange = (newValue: AgreementPoliciesProps) => {
    setValue(newValue);
  };

  return (
    <div>
      <TableHeader title="AGREEMENT / POLICIES / TERMS" />
      <EmailAutoRespondEntryForm value={value} onChange={handleOnChange} />
    </div>
  );
};

export default CreateAgreementPoliciesPage;

import { TableHeader } from '@/components/Table/TableHeader';
import { useState } from 'react';
import { EmailAutoRespondEntryForm } from './components/EmailAutorespondersEntryForm';
import { EmailAutoRespondProps } from './types';

const DEFAULT_EMAILAUTORESPONDERS_VALUE = {
  topic: '',
  targetedFor: '',
  title: '',
  message: '',
};

const CreateEmailAutoRespondersPage = () => {
  const [value, setValue] = useState<EmailAutoRespondProps>(DEFAULT_EMAILAUTORESPONDERS_VALUE);

  const handleOnChange = (newValue: EmailAutoRespondProps) => {
    setValue(newValue);
  };

  return (
    <div>
      <TableHeader title="Email Autoresponders" />
      <EmailAutoRespondEntryForm value={value} onChange={handleOnChange} />
    </div>
  );
};

export default CreateEmailAutoRespondersPage;

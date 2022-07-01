import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TableHeader } from '@/components/Table/TableHeader';
import { useState } from 'react';
import { InspirationalQuotationEntryForm } from './components/InspirationalQuotationEntryForm';
import { inputProps } from './types';

const DEFAULT_INPUT = {
  author: '',
  identity: '',
  quotation: '',
};

const CreateInspirationalQuotationsPage = () => {
  const [input, setInput] = useState<inputProps>(DEFAULT_INPUT);

  const handleOnChangeInput = (newInput: inputProps) => {
    setInput(newInput);
  };

  return (
    <div>
      <TableHeader title="Inspirational Quotations" rightAction={<CustomPlusButton disabled />} />
      <InspirationalQuotationEntryForm value={input} onChange={handleOnChangeInput} />
    </div>
  );
};

export default CreateInspirationalQuotationsPage;

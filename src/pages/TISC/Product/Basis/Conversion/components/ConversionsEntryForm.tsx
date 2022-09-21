import { useProductBasicEntryForm } from '../../hook';

const ConversionsEntryForm = () => {
  const { ProductBasicEntryForm } = useProductBasicEntryForm('CONVERSIONS');

  return <ProductBasicEntryForm />;
};

export default ConversionsEntryForm;

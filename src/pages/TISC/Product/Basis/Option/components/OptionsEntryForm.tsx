import { useProductBasicEntryForm } from '../../hook';

const OptionsEntryForm = () => {
  const { ProductBasicEntryForm } = useProductBasicEntryForm('OPTIONS');

  return <ProductBasicEntryForm />;
};

export default OptionsEntryForm;

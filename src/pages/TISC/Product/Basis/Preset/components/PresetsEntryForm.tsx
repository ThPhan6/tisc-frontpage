import { useProductBasicEntryForm } from '../../hook';

const PresetsEntryForm = () => {
  const { ProductBasicEntryForm } = useProductBasicEntryForm('PRESETS');

  return <ProductBasicEntryForm />;
};

export default PresetsEntryForm;

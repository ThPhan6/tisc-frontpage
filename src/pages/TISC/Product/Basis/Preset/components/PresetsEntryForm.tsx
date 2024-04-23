import { ProductBasisFormType, useProductBasicEntryForm } from '../../hook';

const PresetsEntryForm = () => {
  const { renderProductBasicEntryForm } = useProductBasicEntryForm(ProductBasisFormType.presets);

  return renderProductBasicEntryForm();
};

export default PresetsEntryForm;

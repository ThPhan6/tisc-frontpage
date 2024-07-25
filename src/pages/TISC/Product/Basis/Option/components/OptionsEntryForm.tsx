import { ProductBasisFormType, useProductBasicEntryForm } from '../../hook';

const OptionsEntryForm = () => {
  const { renderProductBasicEntryForm } = useProductBasicEntryForm(ProductBasisFormType.options);

  return renderProductBasicEntryForm();
};

export default OptionsEntryForm;

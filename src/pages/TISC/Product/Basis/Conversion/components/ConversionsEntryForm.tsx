import { ProductBasisFormType, useProductBasicEntryForm } from '../../hook';

const ConversionsEntryForm = () => {
  const { renderProductBasicEntryForm } = useProductBasicEntryForm(
    ProductBasisFormType.conversions,
  );

  return renderProductBasicEntryForm();
};

export default ConversionsEntryForm;

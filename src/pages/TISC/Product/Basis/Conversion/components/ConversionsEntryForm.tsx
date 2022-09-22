import { useProductBasicEntryForm } from '../../hook';

const ConversionsEntryForm = () => {
  const { renderProductBasicEntryForm } = useProductBasicEntryForm('conversions');

  return renderProductBasicEntryForm();
};

export default ConversionsEntryForm;

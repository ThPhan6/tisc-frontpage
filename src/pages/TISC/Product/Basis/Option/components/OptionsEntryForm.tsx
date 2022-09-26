import { useProductBasicEntryForm } from '../../hook';

const OptionsEntryForm = () => {
  const { renderProductBasicEntryForm } = useProductBasicEntryForm('options');

  return renderProductBasicEntryForm();
};

export default OptionsEntryForm;

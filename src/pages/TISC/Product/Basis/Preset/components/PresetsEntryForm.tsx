import { useProductBasicEntryForm } from '../../hook';

const PresetsEntryForm = () => {
  const { renderProductBasicEntryForm } = useProductBasicEntryForm('presets');

  return renderProductBasicEntryForm();
};

export default PresetsEntryForm;

import { useLocation } from 'umi';

import { PreSelectOptionsLinkageForm } from './PreSelectOptionsLinkageForm';
import { SelectOptionsLinkageForm } from './SelectOptionsLinkageForm';

const LinkagePage = () => {
  const { state /* is option data selected */ } = useLocation();

  return !state ? <PreSelectOptionsLinkageForm /> : <SelectOptionsLinkageForm />;
};

export default LinkagePage;

import { useEffect } from 'react';

import { useLocation } from 'umi';

import store from '@/reducers';

import { resetLinkageState } from '../store';
import { PreSelectOptionsLinkageForm } from './PreSelectOptionsLinkageForm';
import { SelectOptionsLinkageForm } from './SelectOptionsLinkageForm';

const LinkagePage = () => {
  const { state /* is option data selected */ } = useLocation();

  useEffect(() => {
    return () => {
      store.dispatch(resetLinkageState());
    };
  }, []);

  return !state ? <PreSelectOptionsLinkageForm /> : <SelectOptionsLinkageForm />;
};

export default LinkagePage;

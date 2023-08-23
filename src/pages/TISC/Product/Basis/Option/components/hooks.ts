import { useLocation } from 'umi';

export const useCheckPreLinkageForm = () => {
  const { state } = useLocation();
  return !state;
};

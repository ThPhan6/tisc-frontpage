import { useLocation } from 'umi';

import {
  ATTRIBUTE_PATH_TO_TYPE,
  FEATURE_URL_PATH,
  GENERAL_URL_PATH,
  SPECIFICATION_URL_PATH,
} from '../utils';

export const useAttributeLocation = () => {
  const location = useLocation();
  const ATTRIBUTE_PATHS = [GENERAL_URL_PATH, FEATURE_URL_PATH, SPECIFICATION_URL_PATH];
  const ACTIVE_PATH = ATTRIBUTE_PATHS.find(
    (path) => location.pathname.indexOf(path) >= 0,
  ) as string;
  return {
    activePath: ACTIVE_PATH,
    attributeLocation: ATTRIBUTE_PATH_TO_TYPE[ACTIVE_PATH],
  };
};

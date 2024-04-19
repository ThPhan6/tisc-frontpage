import { useLocation, useParams } from 'umi';

import { map } from 'lodash';

import {
  ATTRIBUTE_PATH_TO_TYPE,
  FEATURE_URL_PATH,
  GENERAL_URL_PATH,
  SPECIFICATION_URL_PATH,
} from '../utils';

export const useAttributeLocation = () => {
  const paramId = useParams<{ brandId: string }>();

  const location = useLocation();
  const ATTRIBUTE_PATHS = [GENERAL_URL_PATH, FEATURE_URL_PATH, SPECIFICATION_URL_PATH].map((el) =>
    el.replace(':brandId', paramId.brandId),
  );
  const ACTIVE_PATH = ATTRIBUTE_PATHS.find(
    (path) => location.pathname.replace(':brandId', paramId.brandId).indexOf(path) >= 0,
  ) as string;

  const attributePathToType = {};
  const _ = map(ATTRIBUTE_PATH_TO_TYPE, (value, key) => {
    attributePathToType[key.replace(':brandId', paramId.brandId)] = value;
  });

  return {
    activePath: ACTIVE_PATH,
    attributeLocation: attributePathToType[ACTIVE_PATH],
  };
};

import { useLocation, useParams } from 'umi';

import { map } from 'lodash';

import { BrandAttributeParamProps } from '../../BrandAttribute/types';

import { replaceBrandAttributeBrandId } from '../../BrandAttribute/util';
import {
  ATTRIBUTE_PATH_TO_TYPE,
  FEATURE_URL_PATH,
  GENERAL_URL_PATH,
  SPECIFICATION_URL_PATH,
} from '../utils';

export const useAttributeLocation = () => {
  const param = useParams<BrandAttributeParamProps>();

  const location = useLocation();
  const ATTRIBUTE_PATHS = [GENERAL_URL_PATH, FEATURE_URL_PATH, SPECIFICATION_URL_PATH].map((el) =>
    replaceBrandAttributeBrandId(el, param.brandId, param.brandName),
  );
  const ACTIVE_PATH = ATTRIBUTE_PATHS.find(
    (path) =>
      replaceBrandAttributeBrandId(location.pathname, param.brandId, param.brandName).indexOf(
        path,
      ) >= 0,
  ) as string;

  const attributePathToType = {};
  const _ = map(ATTRIBUTE_PATH_TO_TYPE, (value, key) => {
    attributePathToType[replaceBrandAttributeBrandId(key, param.brandId, param.brandName)] = value;
  });

  return {
    activePath: ACTIVE_PATH,
    attributeLocation: attributePathToType[ACTIVE_PATH],
  };
};

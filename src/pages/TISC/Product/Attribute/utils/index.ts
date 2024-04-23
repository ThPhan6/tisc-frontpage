import { PATH } from '@/constants/path';

export const GENERAL_TYPE = 1;
export const FEATURE_TYPE = 2;
export const SPECIFICATION_TYPE = 3;
export const GENERAL_URL_PATH = PATH.attributeGeneral;
export const FEATURE_URL_PATH = PATH.attributeFeature;
export const SPECIFICATION_URL_PATH = PATH.attributeSpecification;

export const ATTRIBUTE_PATH_TO_TYPE = {
  /// path to type
  [GENERAL_URL_PATH]: {
    NAME: 'GENERAL ATTRIBUTES',
    TYPE: GENERAL_TYPE,
  },
  [FEATURE_URL_PATH]: {
    NAME: 'FEATURE ATTRIBUTES',
    TYPE: FEATURE_TYPE,
  },
  [SPECIFICATION_URL_PATH]: {
    NAME: 'SPECIFICATIONS',
    TYPE: SPECIFICATION_TYPE,
  },
};

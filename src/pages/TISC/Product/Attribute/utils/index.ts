export const GENERAL_TYPE = 1;
export const FEATURE_TYPE = 2;
export const SPECIFICATION_TYPE = 3;
export const GENERAL_URL_PATH = '/tisc/products/attributes/general';
export const FEATURE_URL_PATH = '/tisc/products/attributes/feature';
export const SPECIFICATION_URL_PATH = '/tisc/products/attributes/specification';

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
    NAME: 'SPECIFICATION ATTRIBUTES',
    TYPE: SPECIFICATION_TYPE,
  },
};

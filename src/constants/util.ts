export enum STATUS_RESPONSE {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum STATUS_RESPONSE_CODE {
  ERROR = 400,
  SUCCESS = 200,
}

export const ORDER_METHOD = {
  directPurchase: 1,
  customOrder: 2,
};

export const USER_STATUSES = {
  ACTIVE: 1,
  BLOCKED: 2,
  INACTIVE: 2,
  PENDING: 3,
};

export const DESIGN_STATUSES = {
  ACTIVE: 1,
  INACTIVE: 2,
};

export const DESIGN_STATUSES_TEXTS = {
  [DESIGN_STATUSES.ACTIVE]: 'Active',
  [DESIGN_STATUSES.INACTIVE]: 'Inactive',
};

export const BRAND_STATUSES_TEXTS = {
  [USER_STATUSES.ACTIVE]: 'Active',
  [USER_STATUSES.INACTIVE]: 'Inactive',
  [USER_STATUSES.PENDING]: 'Pending',
};

export const MEASUREMENT_UNIT = {
  IMPERIAL: 1,
  METRIC: 2,
};

export const USER_STATUS_TEXTS = {
  [USER_STATUSES.ACTIVE]: 'Activated',
  [USER_STATUSES.BLOCKED]: 'Blocked',
  [USER_STATUSES.INACTIVE]: 'Inactive',
  [USER_STATUSES.PENDING]: 'Pending',
};

export const IMAGE_ACCEPT_TYPES = {
  image: '.png,.jpeg,.webp,.svg,.jpg',
};

export const AVATAR_ACCEPT_TYPES = ['png', 'jpeg', 'jpg', 'webp', 'svg'];

export const QUERY_KEY = {
  cate_id: 'cate_id',
  cate_name: 'cate_name',
  brand_id: 'brand_id',
  brand_name: 'brand_name',
  b_id: 'b_id',
  b_name: 'b_name',
  coll_id: 'coll_id',
  coll_name: 'coll_name',
  sort_order: 'sort_order',
  sort_name: 'sort_name',
  search: 'search',
};

export const COVERAGE_BEYOND = {
  notAllow: true,
  allow: false,
};
export const GENDER = {
  male: true,
  female: false,
};

export const SORT_ORDER = {
  increase: 'ASC',
  decrease: 'DESC',
  headerFollow: 'A - Z',
  footerFollow: 'Z - A',
};

export const COLUMN_WIDTH = {
  status: 130,
};

export const COMMON_TYPES = {
  SHARING_GROUP: 1,
  SHARING_PURPOSE: 2,
  PROJECT_BUILDING: 3,
  FINISH_SCHEDULES: 4,
  COMPANY_FUNCTIONAL: 5,
  PROJECT_INSTRUCTION: 6,
  PROJECT_TYPE: 7,
  PROJECT_REQUIREMENT: 8,
  PROJECT_UNIT: 9,
  DEPARTMENT: 10,
  REQUEST_FOR: 11,
};

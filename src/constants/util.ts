export const LOGO_SIZE_LIMIT = 240 * 1024; // 240 KB

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
  image: '.png,.jpeg,.webp,.jpg',
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
  company_id: 'company_id',
  company_name: 'company_name',
  sort_order: 'sort_order',
  sort_name: 'sort_name',
  search: 'search',
  no_previous_page: 'new_tab',
  new_tab_from_request: 'new_tab_from_request',
  project_product_id: 'project_product_id',
};

export const NEW_TAB_QUERY = '?new_tab=true';
export const NEW_TAB_FROM_REQUEST_QUERY = 'new_tab_from_request=true';

export const COVERAGE_BEYOND = {
  notAllow: false,
  allow: true,
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
  TEAM_DEPARTMENT: 10,
  REQUEST_FOR: 11,
  ACTION_TASK: 12,
  ISSUE_FOR: 13,
  CAPABILITIES: 14,
  INVOICE: 15,
  INVENTORY_UNIT: 20,
};

export enum CompanyFunctionalGroup {
  LOGISTIC = 'Logistic Facility & Warehouse',
}

export const ACTION_TASK_MODEL = {
  notification: 'notification',
  request: 'request',
  inquiry: 'inquiry',
};

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

export const dataMenuSummary = {
  leftData: [
    {
      id: '1',
      quantity: 4,
      label: 'BRAND COMPANIES',
      brands: [
        {
          id: '11',
          quantity: 8,
          label: 'Locations',
        },
        {
          id: '12',
          quantity: 18,
          label: 'Teams',
        },
      ],
    },
    {
      id: '2',
      quantity: 3,
      label: 'COUNTRIES',
      brands: [
        {
          id: '21',
          quantity: 0,
          label: 'Africa',
        },
        {
          id: '22',
          quantity: 1,
          label: 'Asia',
        },
        {
          id: '23',
          quantity: 1,
          label: 'Europe',
        },
        {
          id: '24',
          quantity: 0,
          label: 'N.America',
        },
        {
          id: '25',
          quantity: 1,
          label: 'Oceania',
        },
        {
          id: '26',
          quantity: 0,
          label: 'S.America',
        },
      ],
    },
    {
      id: '3',
      quantity: '1,223',
      label: 'PRODUCTS',
      brands: [
        {
          id: '31',
          quantity: 5,
          label: 'Categories',
        },
        {
          id: '32',
          quantity: 19,
          label: 'Collections',
        },
        {
          id: '33',
          quantity: 220,
          label: 'Cards',
        },
      ],
    },
  ],
  projectData: [
    {
      id: '1',
      quantity: '$127,300',
      label: 'Total sq.m.',
    },
    {
      id: '2',
      quantity: '$1,370,246',
      label: 'Total sq.ft.',
    },
  ],
  subscriptionData: [
    {
      id: '1',
      quantity: '$8,901',
      label: 'Grand Total',
    },
  ],
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
  NOT_ALLOW: true,
  ALLOW: false,
};

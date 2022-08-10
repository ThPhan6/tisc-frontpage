export enum STATUS_RESPONSE {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum STATUS_RESPONSE_CODE {
  ERROR = 400,
  SUCCESS = 200,
}

export const USER_STATUSES = {
  ACTIVE: 1,
  BLOCKED: 2,
  PENDING: 3,
};

export const USER_STATUS_TEXTS = {
  [USER_STATUSES.ACTIVE]: 'Activated',
  [USER_STATUSES.BLOCKED]: 'Blocked',
  [USER_STATUSES.PENDING]: 'Pending',
};

export const dataMenuFirm = {
  leftData: [
    {
      id: '1',
      quantity: 3,
      label: 'DESIGN FIRMS',
      brands: [
        {
          id: '11',
          quantity: 7,
          label: 'Locations',
        },
        {
          id: '12',
          quantity: 28,
          label: 'Designers',
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
          quantity: 3,
          label: 'Asia',
        },
        {
          id: '23',
          quantity: 0,
          label: 'Europe',
        },
        {
          id: '24',
          quantity: 0,
          label: 'N.America',
        },
        {
          id: '25',
          quantity: 0,
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
      quantity: 11,
      label: 'PROJECTS',
      brands: [
        {
          id: '31',
          quantity: 8,
          label: 'Live',
        },
        {
          id: '32',
          quantity: 2,
          label: 'On Hold',
        },
        {
          id: '33',
          quantity: 1,
          label: 'Archived',
        },
      ],
    },
  ],
};
export const IMAGE_ACCEPT_TYPES = {
  image: '.png,.jpeg,.webp,.svg,.jpg',
};

export const AVATAR_ACCEPT_TYPES = ['png', 'jpeg', 'jpg', 'webp', 'svg'];

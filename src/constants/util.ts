export enum STATUS_RESPONSE {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum STATUS_RESPONSE_CODE {
  ERROR = 400,
  SUCCESS = 200,
}

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
          quantity: 8,
          label: 'Locations',
        },
      ],
    },
    {
      id: '2',
      quantity: 4,
      label: 'BRAND COMPANIES',
      brands: [
        {
          id: '21',
          quantity: 8,
          label: 'Locations',
        },
        {
          id: '22',
          quantity: 8,
          label: 'Locations',
        },
        {
          id: '23',
          quantity: 8,
          label: 'Locations',
        },
      ],
    },
    {
      id: '3',
      quantity: 4,
      label: 'BRAND COMPANIES',
      brands: [
        {
          id: '31',
          quantity: 8,
          label: 'Locations',
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

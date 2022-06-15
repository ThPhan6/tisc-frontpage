export enum STATUS_RESPONSE {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum STATUS_RESPONSE_CODE {
  ERROR = 400,
  SUCCESS = 200,
}

export const dataBrands = [
  {
    id: '1',
    quantity: 4,
    brandName: 'BRAND COMPANIES',
    brands: [
      {
        id: '11',
        quantity: 8,
        brandName: 'Locations',
      },
      {
        id: '18',
        quantity: 4,
        brandName: 'Teams',
      },
    ],
  },
  {
    id: '2',
    quantity: 3,
    brandName: 'COUNTRIES',
    brands: [
      {
        id: '21',
        quantity: 0,
        brandName: 'Asia',
      },
      {
        id: '22',
        quantity: 0,
        brandName: 'Africa',
      },
      {
        id: '23',
        quantity: 1,
        brandName: 'Africa',
      },
      {
        id: '34',
        quantity: 1,
        brandName: 'Africa',
      },
    ],
  },
  {
    id: '3',
    quantity: 1123,
    brandName: 'PRODUCTS',
    brands: [
      {
        id: '31',
        quantity: 5,
        brandName: 'Categorys',
      },
      {
        id: '32',
        quantity: 19,
        brandName: 'Collections',
      },
      {
        id: '33',
        quantity: 192,
        brandName: 'Cards',
      },
    ],
  },
];

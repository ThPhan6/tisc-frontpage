import { renderIconByName } from '@/components/Menu/Icon';

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

export const dataTISCAccessLevel = [
  {
    logo: renderIconByName('workspace-icon.svg'),
    name: 'MY WORKSPACE',
    items: [
      {
        id: 'fc140389-ff0e-4acc-9d54-db37593cf863',
        name: 'TISC Admin',
        accessable: true,
      },
      {
        id: '4a810738-a2d0-423c-8690-1f5ece367fef',
        name: 'Consultant Team',
        accessable: true,
      },
    ],
    number: 1,
    parent_number: null,
  },
  {
    logo: renderIconByName('user-group-icon.svg'),
    name: 'USER GROUP',
    items: [
      {
        id: 'fbe67619-f0a8-4529-a3a7-51e3765e0c05',
        name: 'TISC Admin',
        accessable: null,
      },
      {
        id: '7070ee2d-f0ac-4e92-b4f0-474e159dec44',
        name: 'Consultant Team',
        accessable: null,
      },
    ],
    number: 2,
    parent_number: null,
    subs: [
      {
        logo: renderIconByName('design-firm-icon.svg'),
        name: 'Design Firms',
        items: [
          {
            id: 'bf11599f-0b3d-4983-acd9-3a7edf6e7797',
            name: 'TISC Admin',
            accessable: true,
          },
          {
            id: 'ffeeb989-30c1-4f62-91d5-658bffbc3188',
            name: 'Consultant Team',
            accessable: false,
          },
        ],
        number: 4,
        parent_number: 2,
      },
      {
        logo: renderIconByName('brand-icon.svg'),
        name: 'Brands',
        items: [
          {
            id: 'a0216c05-db22-48a1-8bc9-6a073494164a',
            name: 'TISC Admin',
            accessable: true,
          },
          {
            id: '6c6e62df-6c66-4521-9f29-30b55611c6c0',
            name: 'Consultant Team',
            accessable: false,
          },
        ],
        number: 3,
        parent_number: 2,
      },
    ],
  },
  {
    logo: renderIconByName('project-icon.svg'),
    name: 'PROJECTS',
    items: [
      {
        id: '2e3dc501-9c38-44b1-973b-9b4ddcbc4141',
        name: 'TISC Admin',
        accessable: null,
      },
      {
        id: '48b7cc66-f347-47a2-8139-edcec6db3436',
        name: 'Consultant Team',
        accessable: null,
      },
    ],
    number: 5,
    parent_number: null,
    subs: [
      {
        logo: renderIconByName('listing-icon.svg'),
        name: 'Listing',
        items: [
          {
            id: '04515bee-82b4-4503-b2ca-4597fee109e7',
            name: 'TISC Admin',
            accessable: true,
          },
          {
            id: 'd49211bc-054d-4b51-b5db-23954c0f3b4f',
            name: 'Consultant Team',
            accessable: false,
          },
        ],
        number: 6,
        parent_number: 5,
      },
    ],
  },
  {
    logo: renderIconByName('product-icon.svg'),
    name: 'PRODUCTS',
    items: [
      {
        id: 'f703afb3-b98a-4a99-8920-ef9ba2610a67',
        name: 'TISC Admin',
        accessable: null,
      },
      {
        id: '2e669020-bc9d-4d9b-b16b-1e690799b8fa',
        name: 'Consultant Team',
        accessable: null,
      },
    ],
    number: 7,
    parent_number: null,
    subs: [
      {
        logo: renderIconByName('category-icon.svg'),
        name: 'Categories',
        items: [
          {
            id: '6ee1bba5-ec86-4661-ab89-8d22ffe76a49',
            name: 'TISC Admin',
            accessable: true,
          },
          {
            id: 'b38e420c-cd2e-45dc-b9a0-6eff0444d2f9',
            name: 'Consultant Team',
            accessable: false,
          },
        ],
        number: 8,
        parent_number: 7,
      },
      {
        logo: renderIconByName('basis-icon.svg'),
        name: 'Basis',
        items: [
          {
            id: '9cdf7778-9011-498e-b8da-64b1ea1b9b5e',
            name: 'TISC Admin',
            accessable: true,
          },
          {
            id: 'f5d9f083-8c54-433f-ba7c-5a01ad543dc6',
            name: 'Consultant Team',
            accessable: true,
          },
        ],
        number: 9,
        parent_number: 7,
      },
      {
        logo: renderIconByName('attributes-icon.svg'),
        name: 'Attributes',
        items: [
          {
            id: 'dd2930dc-146b-4709-bc6c-04968cdfb612',
            name: 'TISC Admin',
            accessable: true,
          },
          {
            id: '8aab2503-6779-4965-867a-3242d2056bc0',
            name: 'Consultant Team',
            accessable: true,
          },
        ],
        number: 10,
        parent_number: 7,
      },
      {
        logo: renderIconByName('configuration-icon.svg'),
        name: 'Configurations',
        items: [
          {
            id: '51950a96-f8fc-4c77-9ddb-2498defc50b8',
            name: 'TISC Admin',
            accessable: true,
          },
          {
            id: '804fd989-e5b3-4367-b801-e2613f6643fe',
            name: 'Consultant Team',
            accessable: true,
          },
        ],
        number: 11,
        parent_number: 7,
      },
    ],
  },
  {
    logo: renderIconByName('adminstration-icon.svg'),
    name: 'ADMINISTRATION',
    items: [
      {
        id: 'c769cdf2-4f83-4750-b874-f1d46eb1e10d',
        name: 'TISC Admin',
        accessable: null,
      },
      {
        id: '43a90ee6-c731-4c9e-8b84-86fe2c51bd08',
        name: 'Consultant Team',
        accessable: null,
      },
    ],
    number: 12,
    parent_number: null,
    subs: [
      {
        logo: renderIconByName('documentation-icon.svg'),
        name: 'Documentations',
        items: [
          {
            id: 'e7b67ec2-5998-4d88-8fa8-7a9e96f18fe2',
            name: 'TISC Admin',
            accessable: true,
          },
          {
            id: 'f897ac2e-3ceb-4a55-a1e8-866fb724f549',
            name: 'Consultant Team',
            accessable: false,
          },
        ],
        number: 13,
        parent_number: 12,
      },
      {
        logo: renderIconByName('location-icon.svg'),
        name: 'Locations',
        items: [
          {
            id: '60c14891-3783-453d-86ac-93ae972bfb39',
            name: 'TISC Admin',
            accessable: true,
          },
          {
            id: 'a1be3d1a-aef7-43b0-85d0-bea790979814',
            name: 'Consultant Team',
            accessable: false,
          },
        ],
        number: 14,
        parent_number: 12,
      },
      {
        logo: renderIconByName('team-profile-icon.svg'),
        name: 'Team profiles',
        items: [
          {
            id: '6feab9a3-8c25-4fc7-9a37-bc116ca72e07',
            name: 'TISC Admin',
            accessable: true,
          },
          {
            id: 'ac284b1b-65e4-4890-867b-2b1fbd93dbe1',
            name: 'Consultant Team',
            accessable: false,
          },
        ],
        number: 15,
        parent_number: 12,
      },
      {
        logo: renderIconByName('messages-icon.svg'),
        name: 'Messages',
        items: [
          {
            id: '044c78c1-5a55-4748-8815-f942e7c0a891',
            name: 'TISC Admin',
            accessable: true,
          },
          {
            id: '3a738101-b809-465f-9aed-0664516c3c91',
            name: 'Consultant Team',
            accessable: false,
          },
        ],
        number: 16,
        parent_number: 12,
      },
      {
        logo: renderIconByName('revenue-icon.svg'),
        name: 'Revenues',
        items: [
          {
            id: '0a07da43-d014-4959-92e2-daec2e20aec9',
            name: 'TISC Admin',
            accessable: true,
          },
          {
            id: 'dae58519-ead2-4040-951e-d346001db614',
            name: 'Consultant Team',
            accessable: false,
          },
        ],
        number: 17,
        parent_number: 12,
      },
    ],
  },
];

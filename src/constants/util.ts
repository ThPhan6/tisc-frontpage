import { renderIconByName } from '@/components/Menu/Icon';
import { IHowToForm } from '@/pages/TISC/Adminstration/Documentation/HowTo/types';

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

export const howToPagePanel: IHowToForm = {
  tisc: {
    data: [
      {
        title: 'Onboarding Guide',
        description: '',
        FAQ: [],
      },
      {
        title: 'My Workspace',
        icon: renderIconByName('workspace-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'User Group',
        icon: renderIconByName('user-group-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Projects',
        icon: renderIconByName('project-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Products',
        icon: renderIconByName('product-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Adminstration',
        icon: renderIconByName('adminstration-icon.svg'),
        description: '',
        FAQ: [],
      },
    ],
  },
  brands: {
    data: [
      {
        title: 'Onboarding Guide',
        description: '',
        FAQ: [],
      },
      {
        title: 'My Workspace',
        icon: renderIconByName('workspace-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Products',
        icon: renderIconByName('product-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'General Inquires',
        icon: renderIconByName('general-inquire-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Project Tracking',
        icon: renderIconByName('project-tracking-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Adminstration',
        icon: renderIconByName('adminstration-icon.svg'),
        description: '',
        FAQ: [],
      },
    ],
  },
  designers: {
    data: [
      {
        title: 'Onboarding Guide',
        description: '',
        FAQ: [],
      },
      {
        title: 'My Workspace',
        icon: renderIconByName('workspace-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'My Favourites',
        icon: renderIconByName('my-favourite-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Products',
        icon: renderIconByName('product-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Projects',
        icon: renderIconByName('project-icon.svg'),
        description: '',
        FAQ: [],
      },

      {
        title: 'Adminstration',
        icon: renderIconByName('adminstration-icon.svg'),
        description: '',
        FAQ: [],
      },
    ],
  },
};

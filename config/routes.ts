export default [
  // NO REQUIRE AUTHENTICATION
  {
    path: '/',
    component: './LandingPage',
    layout: false,
  },
  {
    path: '/reset-password',
    component: './LandingPage',
    layout: false,
  },
  // REQUIRED AUTHENTICATION
  {
    path: '/profiles',
    component: './ProfilesPage',
  },

  // TISC MENU - ADMIN ACCESS ONLY
  {
    path: '/tisc/dashboard',
    name: 'workspace',
    icon: 'workspace-icon.svg',
    component: './Welcome',
  },
  {
    path: '/tisc/user-groups',
    name: 'usergroup',
    icon: 'user-group-icon.svg',
    routes: [
      {
        path: '/tisc/user-groups/brands',
        name: 'brand',
        icon: 'brand-icon.svg',
        component: './TISC/UserGroup/Brand',
      },
      {
        path: '/tisc/user-groups/design-firms',
        name: 'designfirm',
        icon: 'design-firm-icon.svg',
        component: './TISC/UserGroup/DesignFirm',
      },
    ],
  },
  {
    path: '/tisc/projects',
    name: 'project',
    icon: 'project-icon.svg',
    routes: [
      {
        path: '/tisc/projects/listing',
        name: 'listing',
        icon: 'listing-icon.svg',
        component: './Welcome',
      },
    ],
  },
  {
    path: '/tisc/products',
    name: 'product',
    icon: 'product-icon.svg',
    routes: [
      {
        path: '/tisc/products/categories',
        name: 'category',
        icon: 'category-icon.svg',
        component: './TISC/Product/Category',
      },
      {
        path: '/tisc/products/basis',
        name: 'basis',
        icon: 'basis-icon.svg',
        routes: [
          {
            path: '/tisc/products/basis/conversions',
            name: 'conversion',
            component: './TISC/Product/Basis/Conversion',
          },
          {
            path: '/tisc/products/basis/presets',
            name: 'preset',
            component: './TISC/Product/Basis/Preset',
          },
          {
            path: '/tisc/products/basis/options',
            name: 'option',
            component: './TISC/Product/Basis/Option',
          },
        ],
      },
      {
        path: '/tisc/products/attributes',
        name: 'attribute',
        icon: 'attributes-icon.svg',
        routes: [
          {
            path: '/tisc/products/attributes/general',
            name: 'general',
            component: './Welcome',
          },
          {
            path: '/tisc/products/attributes/feature',
            name: 'feature',
            component: './Welcome',
          },
          {
            path: '/tisc/products/attributes/specification',
            name: 'specification',
            component: './Welcome',
          },
        ],
      },
      {
        path: '/tisc/products/configuration',
        name: 'configuration',
        icon: 'configuration-icon.svg',
        component: './Welcome',
      },
    ],
  },
  {
    path: '/tisc/adminstration',
    name: 'adminstration',
    icon: 'adminstration-icon.svg',
    routes: [
      {
        path: '/tisc/adminstration/documentation',
        name: 'documentation',
        icon: 'documentation-icon.svg',
        routes: [
          {
            path: '/tisc/adminstration/documentation/agreement-policy-terms',
            name: 'terms.policy',
            component: './Welcome',
          },
          {
            path: '/tisc/adminstration/documentation/how-to',
            name: 'how.to',
            component: './Welcome',
          },
        ],
      },
      {
        path: '/tisc/adminstration/locations',
        name: 'location',
        icon: 'location-icon.svg',
        component: './Welcome',
      },
      {
        path: '/tisc/adminstration/team-profiles',
        name: 'team.profile',
        icon: 'team-profile-icon.svg',
        component: './Welcome',
      },
      {
        path: '/tisc/adminstration/messages',
        name: 'messages',
        icon: 'messages-icon.svg',
        routes: [
          {
            path: '/tisc/adminstration/messages/email-autoresponders',
            name: 'email',
            component: './Welcome',
          },
          {
            path: '/tisc/adminstration/messages/inspirational-quotations',
            name: 'quotation',
            component: './Welcome',
          },
        ],
      },
      {
        path: '/tisc/adminstration/revenues',
        name: 'revenue',
        icon: 'revenue-icon.svg',
        routes: [
          {
            path: '/tisc/adminstration/revenues/services',
            name: 'service',
            component: './Welcome',
          },
          {
            path: '/tisc/adminstration/revenues/subscription',
            name: 'subscription',
            component: './Welcome',
          },
        ],
      },
    ],
  },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  // GENERAL PAGE
  {
    component: './404',
  },
];

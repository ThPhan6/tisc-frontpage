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
        routes: [
          {
            path: '/tisc/products/categories',
            component: './TISC/Product/Category',
            hideInMenu: true,
          },
          {
            path: '/tisc/products/categories/create',
            hideInMenu: true,
            component: './TISC/Product/Category/CreateCategoryPage',
          },
          {
            path: '/tisc/products/categories/update/:id',
            hideInMenu: true,
            component: './TISC/Product/Category/UpdateCategoryPage',
          },
        ],
      },
      {
        path: '/tisc/products/basis',
        name: 'basis',
        icon: 'basis-icon.svg',
        routes: [
          {
            path: '/tisc/products/basis/conversions',
            name: 'conversion',
            routes: [
              {
                path: '/tisc/products/basis/conversions',
                component: './TISC/Product/Basis/Conversion',
                hideInMenu: true,
              },
              {
                path: '/tisc/products/basis/conversions/create',
                hideInMenu: true,
                component: './TISC/Product/Basis/Conversion/CreateConversionPage',
              },
              {
                path: '/tisc/products/basis/conversions/:id',
                hideInMenu: true,
                component: './TISC/Product/Basis/Conversion/UpdateConversionPage',
              },
            ],
          },

          {
            path: '/tisc/products/basis/presets',
            name: 'preset',
            routes: [
              {
                path: '/tisc/products/basis/presets',
                component: './TISC/Product/Basis/Preset',
                hideInMenu: true,
              },
              {
                path: '/tisc/products/basis/presets/create',
                hideInMenu: true,
                component: './TISC/Product/Basis/Preset/CreatePresetPage',
              },
              {
                path: '/tisc/products/basis/presets/:id',
                hideInMenu: true,
                component: './TISC/Product/Basis/Preset/UpdatePresetPage',
              },
            ],
          },
          {
            path: '/tisc/products/basis/options',
            name: 'option',
            routes: [
              {
                path: '/tisc/products/basis/options',
                component: './TISC/Product/Basis/Option',
                hideInMenu: true,
              },
              {
                path: '/tisc/products/basis/options/create',
                hideInMenu: true,
                component: './TISC/Product/Basis/Option/CreateOptionPage',
              },
              {
                path: '/tisc/products/basis/options/:id',
                hideInMenu: true,
                component: './TISC/Product/Basis/Option/UpdateOptionPage',
              },
            ],
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
            routes: [
              {
                path: '/tisc/products/attributes/general',
                component: './TISC/Product/Attribute',
                hideInMenu: true,
              },
              {
                path: '/tisc/products/attributes/general/create',
                hideInMenu: true,
                component: './TISC/Product/Attribute/CreatePage',
              },
              {
                path: '/tisc/products/attributes/general/:id',
                hideInMenu: true,
                component: './TISC/Product/Attribute/UpdatePage',
              },
            ],
          },
          {
            path: '/tisc/products/attributes/feature',
            name: 'feature',
            routes: [
              {
                path: '/tisc/products/attributes/feature',
                component: './TISC/Product/Attribute',
                hideInMenu: true,
              },
              {
                path: '/tisc/products/attributes/feature/create',
                hideInMenu: true,
                component: './TISC/Product/Attribute/CreatePage',
              },
              {
                path: '/tisc/products/attributes/feature/:id',
                hideInMenu: true,
                component: './TISC/Product/Attribute/UpdatePage',
              },
            ],
          },
          {
            path: '/tisc/products/attributes/specification',
            name: 'specification',
            routes: [
              {
                path: '/tisc/products/attributes/specification',
                component: './TISC/Product/Attribute',
                hideInMenu: true,
              },
              {
                path: '/tisc/products/attributes/specification/create',
                hideInMenu: true,
                component: './TISC/Product/Attribute/CreatePage',
              },
              {
                path: '/tisc/products/attributes/specification/:id',
                hideInMenu: true,
                component: './TISC/Product/Attribute/UpdatePage',
              },
            ],
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
            component:
              './TISC/Adminstration/Messages/EmailAutoresponders/CreateEmailAutorespondersPage',
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

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
  {
    path: '/howTo',
    component: './HowTo',
  },
  // TISC MENU - ADMIN ACCESS ONLY
  {
    path: '/tisc/dashboard',
    name: 'workspace',
    icon: 'workspace-icon.svg',
    component: './Welcome',
    access: 'tisc_workspace',
  },
  {
    path: '/tisc/user-groups',
    name: 'usergroup',
    icon: 'user-group-icon.svg',
    access: 'tisc_user_group',
    routes: [
      {
        path: '/tisc/user-groups/brands',
        name: 'brand',
        icon: 'brand-icon.svg',
        component: './TISC/UserGroup/Brand',
        access: 'tisc_user_group_brand',
      },
      {
        path: '/tisc/user-groups/design-firms',
        name: 'designfirm',
        icon: 'design-firm-icon.svg',
        component: './TISC/UserGroup/DesignFirm',
        access: 'tisc_user_group_design',
      },
    ],
  },
  {
    path: '/tisc/projects',
    name: 'project',
    icon: 'project-icon.svg',
    access: 'tisc_project',
    routes: [
      {
        path: '/tisc/projects/listing',
        name: 'listing',
        icon: 'listing-icon.svg',
        component: './Welcome',
        access: 'tisc_project_list',
      },
    ],
  },
  {
    path: '/tisc/products',
    name: 'product',
    icon: 'product-icon.svg',
    access: 'tisc_product',
    routes: [
      {
        path: '/tisc/products/categories',
        name: 'category',
        icon: 'category-icon.svg',
        access: 'tisc_product_category',
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
        access: 'tisc_product_basis',
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
        access: 'tisc_product_attribute',
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
        access: 'tisc_product_configuration',
        routes: [
          {
            path: '/tisc/products/configuration',
            component: './TISC/Product/Configuration',
            hideInMenu: true,
          },
          {
            path: '/tisc/products/configuration/create/:brandId',
            component: './TISC/Product/Configuration/Create',
            hideInMenu: true,
          },
          {
            path: '/tisc/products/configuration/:id',
            component: './TISC/Product/Configuration/Update',
            hideInMenu: true,
          },
        ],
      },
    ],
  },
  {
    path: '/tisc/adminstration',
    name: 'adminstration',
    icon: 'adminstration-icon.svg',
    access: 'tisc_administration',
    routes: [
      {
        path: '/tisc/adminstration/documentation',
        name: 'documentation',
        icon: 'documentation-icon.svg',
        access: 'tisc_administration_documentation',
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
        access: 'tisc_administration_location',
      },
      {
        path: '/tisc/adminstration/team-profiles',
        name: 'team.profile',
        icon: 'team-profile-icon.svg',
        component: './Welcome',
        access: 'tisc_administration_team_profile',
      },
      {
        path: '/tisc/adminstration/messages',
        name: 'messages',
        icon: 'messages-icon.svg',
        access: 'tisc_administration_message',
        routes: [
          {
            path: '/tisc/adminstration/messages/email-autoresponders',
            name: 'email',
            component: './Welcome',
          },
          {
            path: '/tisc/adminstration/messages/quotation',
            name: 'quotation',
            routes: [
              {
                path: '/tisc/adminstration/messages/quotation',
                component: './TISC/Adminstration/Messages/InspirationalQuotations',
                hideInMenu: true,
              },
              {
                path: '/tisc/adminstration/messages/quotation/create',
                component:
                  './TISC/Adminstration/Messages/InspirationalQuotations/CreateQuotationPage',
                hideInMenu: true,
              },
              {
                path: '/tisc/adminstration/messages/quotation/update/:id',
                component:
                  './TISC/Adminstration/Messages/InspirationalQuotations/UpdateQuotationPage',
                hideInMenu: true,
              },
            ],
          },
        ],
      },
      {
        path: '/tisc/adminstration/revenues',
        name: 'revenue',
        icon: 'revenue-icon.svg',
        access: 'tisc_administration_revenue',
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
  {
    path: '/brand/dashboard',
    name: 'workspace',
    icon: 'workspace-icon.svg',
    component: './Welcome',
    access: 'brand_workspace',
  },
  {
    path: '/brand/product',
    name: 'product',
    icon: 'product-icon.svg',
    component: './Welcome',
    access: 'brand_product',
  },
  {
    path: '/brand/general-inquiry',
    name: 'general_inquiry',
    icon: 'general-inquiry-icon.svg',
    component: './Welcome',
    access: 'brand_genenral_inquiry',
  },
  {
    path: '/brand/project-tracking',
    name: 'project_tracking',
    icon: 'project-tracking-icon.svg',
    component: './Welcome',
    access: 'brand_project_tracking',
  },
  {
    path: '/brand/adminstration',
    name: 'adminstration',
    icon: 'adminstration-icon.svg',
    access: 'brand_administration',
    routes: [
      {
        path: '/brand/adminstration/brand-profile',
        name: 'brand_profile',
        icon: 'brand-icon.svg',
        access: 'brand_administration_brand_profile',
      },
      {
        path: '/brand/adminstration/locations',
        name: 'location',
        icon: 'location-icon.svg',
        component: './Welcome',
        access: 'brand_administration_location',
      },
      {
        path: '/brand/adminstration/team-profiles',
        name: 'team.profile',
        icon: 'team-profile-icon.svg',
        component: './Welcome',
        access: 'brand_administration_team_profile',
      },
      {
        path: '/brand/adminstration/distributors',
        name: 'brand.distributor',
        icon: 'distributor-icon.svg',
        component: './Welcome',
        access: 'brand_administration_distributor',
      },
      {
        path: '/brand/adminstration/market-availability',
        name: 'brand.market_availability',
        icon: 'market-availability-icon.svg',
        component: './Welcome',
        access: 'brand_administration_market_availability',
      },
      {
        path: '/brand/adminstration/subscription',
        name: 'brand.subscription',
        icon: 'subscription-icon.svg',
        component: './Welcome',
        access: 'brand_administration_subscription',
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

import { PATH } from '../src/constants/path';

export default [
  // NO REQUIRE AUTHENTICATION
  {
    path: PATH.landingPage,
    component: './LandingPage',
    layout: false,
  },
  {
    path: PATH.resetPassword,
    component: './LandingPage',
    layout: false,
  },
  {
    path: PATH.createPassword,
    component: './LandingPage',
    layout: false,
  },
  {
    path: PATH.verifyAccount,
    component: './LandingPage',
    layout: false,
  },
  // REQUIRED AUTHENTICATION
  {
    path: PATH.profiles,
    component: './UserProfile',
  },
  {
    path: PATH.howTo,
    component: './HowTo',
  },

  // TISC MENU - ADMIN ACCESS ONLY
  {
    path: PATH.tiscHomePage,
    name: 'workspace',
    icon: 'workspace-icon.svg',
    component: './TISC/MyWorkspace',
    access: 'tisc_workspace',
  },
  {
    path: PATH.tiscUserGroupList,
    name: 'usergroup',
    icon: 'user-group-icon.svg',
    access: 'tisc_user_group',
    routes: [
      {
        path: PATH.tiscUserGroupBrandList,
        name: 'brand',
        icon: 'brand-icon.svg',
        access: 'tisc_user_group_brand',
        routes: [
          {
            hideInMenu: true,
            path: PATH.tiscUserGroupBrandList,
            component: './TISC/UserGroup/Brand',
          },
          {
            hideInMenu: true,
            path: PATH.tiscUserGroupBrandEntryFrom,
            component: './TISC/UserGroup/Brand/CreatePage',
          },
          {
            hideInMenu: true,
            path: PATH.tiscUserGroupBrandViewDetail,
            component: './TISC/UserGroup/Brand/UpdatePage',
          },
        ],
      },
      {
        path: PATH.tiscUserGroupDesignerList,
        name: 'designfirm',
        icon: 'design-firm-icon.svg',
        access: 'tisc_user_group_design',
        routes: [
          {
            path: PATH.tiscUserGroupDesignerList,
            hideInMenu: true,
            component: './TISC/UserGroup/DesignFirm',
          },
          {
            path: PATH.tiscUserGroupViewDesigner,
            hideInMenu: true,
            component: './TISC/UserGroup/DesignFirm/UpdatePage',
          },
        ],
      },
    ],
  },
  {
    path: PATH.tiscProject,
    name: 'project',
    icon: 'project-icon.svg',
    access: 'tisc_project',
    routes: [
      {
        path: PATH.tiscProjectListing,
        name: 'listing',
        icon: 'listing-icon.svg',
        component: './Admin',
        access: 'tisc_project_list',
      },
    ],
  },
  {
    path: PATH.tiscProduct,
    name: 'product',
    icon: 'product-icon.svg',
    access: 'tisc_product',
    routes: [
      {
        path: PATH.categories,
        name: 'category',
        icon: 'category-icon.svg',
        access: 'tisc_product_category',
        routes: [
          {
            path: PATH.categories,
            component: './TISC/Product/Category',
            hideInMenu: true,
          },
          {
            path: PATH.createCategories,
            hideInMenu: true,
            component: './TISC/Product/Category/CreateCategoryPage',
          },
          {
            path: PATH.updateCategories,
            hideInMenu: true,
            component: './TISC/Product/Category/UpdateCategoryPage',
          },
        ],
      },
      {
        path: PATH.tiscBasis,
        name: 'basis',
        icon: 'basis-icon.svg',
        access: 'tisc_product_basis',
        routes: [
          {
            path: PATH.conversions,
            name: 'conversion',
            routes: [
              {
                path: PATH.conversions,
                component: './TISC/Product/Basis/Conversion',
                hideInMenu: true,
              },
              {
                path: PATH.createConversions,
                hideInMenu: true,
                component: './TISC/Product/Basis/Conversion/CreateConversionPage',
              },
              {
                path: PATH.updateConversions,
                hideInMenu: true,
                component: './TISC/Product/Basis/Conversion/UpdateConversionPage',
              },
            ],
          },

          {
            path: PATH.presets,
            name: 'preset',
            routes: [
              {
                path: PATH.presets,
                component: './TISC/Product/Basis/Preset',
                hideInMenu: true,
              },
              {
                path: PATH.createPresets,
                hideInMenu: true,
                component: './TISC/Product/Basis/Preset/CreatePresetPage',
              },
              {
                path: PATH.updatePresets,
                hideInMenu: true,
                component: './TISC/Product/Basis/Preset/UpdatePresetPage',
              },
            ],
          },
          {
            path: PATH.options,
            name: 'option',
            routes: [
              {
                path: PATH.options,
                component: './TISC/Product/Basis/Option',
                hideInMenu: true,
              },
              {
                path: PATH.createOptions,
                hideInMenu: true,
                component: './TISC/Product/Basis/Option/CreateOptionPage',
              },
              {
                path: PATH.updateOptions,
                hideInMenu: true,
                component: './TISC/Product/Basis/Option/UpdateOptionPage',
              },
            ],
          },
        ],
      },
      {
        path: PATH.attribute,
        name: 'attribute',
        icon: 'attributes-icon.svg',
        access: 'tisc_product_attribute',
        routes: [
          {
            path: PATH.attributeGeneral,
            name: 'general',
            routes: [
              {
                path: PATH.attributeGeneral,
                component: './TISC/Product/Attribute',
                hideInMenu: true,
              },
              {
                path: PATH.attributeGeneralCreate,
                hideInMenu: true,
                component: './TISC/Product/Attribute/CreatePage',
              },
              {
                path: PATH.attributeGeneralUpdate,
                hideInMenu: true,
                component: './TISC/Product/Attribute/UpdatePage',
              },
            ],
          },
          {
            path: PATH.attributeFeature,
            name: 'feature',
            routes: [
              {
                path: PATH.attributeFeature,
                component: './TISC/Product/Attribute',
                hideInMenu: true,
              },
              {
                path: PATH.attributeFeatureCreate,
                hideInMenu: true,
                component: './TISC/Product/Attribute/CreatePage',
              },
              {
                path: PATH.attributeFeatureUpdate,
                hideInMenu: true,
                component: './TISC/Product/Attribute/UpdatePage',
              },
            ],
          },
          {
            path: PATH.attributeSpecification,
            name: 'specification',
            routes: [
              {
                path: PATH.attributeSpecification,
                component: './TISC/Product/Attribute',
                hideInMenu: true,
              },
              {
                path: PATH.attributeSpecificationCreate,
                hideInMenu: true,
                component: './TISC/Product/Attribute/CreatePage',
              },
              {
                path: PATH.attributeSpecificationUpdate,
                hideInMenu: true,
                component: './TISC/Product/Attribute/UpdatePage',
              },
            ],
          },
        ],
      },
      {
        path: PATH.productConfiguration,
        name: 'configuration',
        icon: 'configuration-icon.svg',
        access: 'tisc_product_configuration',
        routes: [
          {
            path: PATH.productConfiguration,
            component: './TISC/Product/Configuration',
            hideInMenu: true,
          },
          {
            path: PATH.productConfigurationCreate,
            component: './TISC/Product/Configuration/Create',
            hideInMenu: true,
          },
          {
            path: PATH.productConfigurationUpdate,
            component: './TISC/Product/Configuration/Update',
            hideInMenu: true,
          },
        ],
      },
    ],
  },
  {
    path: PATH.tiscAdministration,
    name: 'adminstration',
    icon: 'adminstration-icon.svg',
    access: 'tisc_administration',
    routes: [
      {
        path: PATH.tiscDocumentation,
        name: 'documentation',
        icon: 'documentation-icon.svg',
        access: 'tisc_administration_documentation',
        routes: [
          {
            path: PATH.policy,
            name: 'terms.policy',
            routes: [
              {
                path: PATH.policy,
                component: './TISC/Adminstration/Documentation/PolicyTemplate',
                hideInMenu: true,
              },
              {
                path: PATH.policyUpdate,
                component: './TISC/Adminstration/Documentation/PolicyTemplate/Update',
                hideInMenu: true,
              },
            ],
          },
          {
            path: PATH.tiscDocumentationHowTo,
            name: 'how.to',
            component: './TISC/Adminstration/Documentation/HowTo',
          },
        ],
      },
      {
        path: PATH.tiscLocation,
        name: 'location',
        icon: 'location-icon.svg',
        access: 'tisc_administration_location',
        routes: [
          {
            path: PATH.tiscLocation,
            component: './TISC/Adminstration/Location',
            hideInMenu: true,
          },
          {
            path: PATH.tiscLocationCreate,
            hideInMenu: true,
            component: './TISC/Adminstration/Location/CreatePage',
          },
          {
            path: PATH.tiscLocationUpdate,
            hideInMenu: true,
            component: './TISC/Adminstration/Location/UpdatePage',
          },
        ],
      },
      {
        path: PATH.teamProfile,
        name: 'team.profile',
        icon: 'team-profile-icon.svg',
        access: 'tisc_administration_team_profile',
        routes: [
          {
            path: PATH.teamProfile,
            component: './TISC/Adminstration/TeamProfiles',
            hideInMenu: true,
          },
          {
            path: PATH.createTeamProfile,
            component: '../features/team-profiles/components/TeamProfilesEntryForm',
            hideInMenu: true,
          },
          {
            path: PATH.updateTeamProfile,
            component: '../features/team-profiles/components/TeamProfilesEntryForm',
            hideInMenu: true,
          },
        ],
      },
      {
        path: PATH.tiscAdministrationMessage,
        name: 'messages',
        icon: 'messages-icon.svg',
        access: 'tisc_administration_message',
        routes: [
          {
            path: PATH.emailAuto,
            name: 'email',
            routes: [
              {
                path: PATH.emailAuto,
                component: './TISC/Adminstration/Messages/EmailAutoresponders/',
                hideInMenu: true,
              },
              {
                path: PATH.updateEmailAuto,
                component: './TISC/Adminstration/Messages/EmailAutoresponders/UpdateEmailAutoPage',
                hideInMenu: true,
              },
            ],
          },
          {
            path: PATH.quotation,
            name: 'quotation',
            routes: [
              {
                path: PATH.quotation,
                component: './TISC/Adminstration/Messages/InspirationalQuotations',
                hideInMenu: true,
              },
              {
                path: PATH.createQuotation,
                component:
                  './TISC/Adminstration/Messages/InspirationalQuotations/CreateQuotationPage',
                hideInMenu: true,
              },
              {
                path: PATH.updateQuotation,
                component:
                  './TISC/Adminstration/Messages/InspirationalQuotations/UpdateQuotationPage',
                hideInMenu: true,
              },
            ],
          },
        ],
      },
      {
        path: PATH.tiscRevenue,
        name: 'revenue',
        icon: 'revenue-icon.svg',
        access: 'tisc_administration_revenue',
        routes: [
          {
            path: PATH.tiscRevenueService,
            name: 'service',
            component: './Admin',
          },
          {
            path: PATH.tiscRevenueSubscription,
            name: 'subscription',
            component: './Admin',
          },
        ],
      },
    ],
  },
  {
    path: PATH.brandHomePage,
    name: 'workspace',
    icon: 'workspace-icon.svg',
    component: './Admin',
    access: 'brand_workspace',
  },
  {
    path: PATH.brandProduct,
    name: 'product',
    icon: 'product-icon.svg',
    access: 'brand_product',
    routes: [
      {
        path: '/brand/product',
        component: './Brand/Products',
        hideInMenu: true,
      },
      {
        path: '/brand/product/:id',
        component: './Brand/Products/ViewPage',
        hideInMenu: true,
      },
    ],
  },
  {
    path: PATH.brandGeneralInquiry,
    name: 'general_inquiry',
    icon: 'general-inquiry-icon.svg',
    component: './Admin',
    access: 'brand_genenral_inquiry',
  },
  {
    path: PATH.brandProjectTracking,
    name: 'project_tracking',
    icon: 'project-tracking-icon.svg',
    component: './Admin',
    access: 'brand_project_tracking',
  },
  {
    path: PATH.brandAdministration,
    name: 'adminstration',
    icon: 'adminstration-icon.svg',
    access: 'brand_administration',
    routes: [
      {
        path: PATH.brandAdministrationProfile,
        name: 'brand.profile',
        icon: 'brand-icon.svg',
        access: 'brand_administration_brand_profile',
        component: './Brand/Adminstration/BrandProfile',
      },
      {
        path: PATH.brandLocation,
        name: 'location',
        icon: 'location-icon.svg',
        access: 'brand_administration_location',
        routes: [
          {
            path: PATH.brandLocation,
            component: './Brand/Adminstration/Location',
            hideInMenu: true,
          },
          {
            path: PATH.brandLocationCreate,
            hideInMenu: true,
            component: './Brand/Adminstration/Location/CreatePage',
          },
          {
            path: PATH.brandLocationUpdate,
            hideInMenu: true,
            component: './Brand/Adminstration/Location/UpdatePage',
          },
        ],
      },
      {
        name: 'team.profile',
        icon: 'team-profile-icon.svg',
        access: 'brand_administration_team_profile',
        path: PATH.brandTeamProfile,
        routes: [
          {
            path: PATH.brandTeamProfile,
            component: './Brand/Adminstration/TeamProfiles',
            hideInMenu: true,
          },
          {
            path: PATH.brandCreateTeamProfile,
            component: '../features/team-profiles/components/TeamProfilesEntryForm',
            hideInMenu: true,
          },
          {
            path: PATH.brandUpdateTeamProfile,
            component: '../features/team-profiles/components/TeamProfilesEntryForm',
            hideInMenu: true,
          },
        ],
      },
      {
        path: PATH.distributors,
        name: 'brand.distributor',
        icon: 'distributor-icon.svg',
        access: 'brand_administration_distributor',
        routes: [
          {
            path: PATH.distributors,
            component: './Brand/Adminstration/Distributors',
            hideInMenu: true,
          },
          {
            path: PATH.createDistributor,
            component: './Brand/Adminstration/Distributors/CreatePage',
            hideInMenu: true,
          },
          {
            path: PATH.updateDistributor,
            component: './Brand/Adminstration/Distributors/UpdatePage',
            hideInMenu: true,
          },
        ],
      },
      {
        name: 'brand.market_availability',
        icon: 'market-availability-icon.svg',
        access: 'brand_administration_market_availability',
        path: PATH.marketAvailability,
        routes: [
          {
            path: PATH.marketAvailability,
            component: './Brand/Adminstration/MarketAvailability',
            hideInMenu: true,
          },
          {
            path: PATH.updateMarketAvailability,
            component: './Brand/Adminstration/MarketAvailability/UpdatePage',
            hideInMenu: true,
          },
        ],
      },
      {
        path: PATH.brandSubscription,
        name: 'brand.subscription',
        icon: 'subscription-icon.svg',
        component: './Admin',
        access: 'brand_administration_subscription',
      },
    ],
  },
  {
    path: PATH.designerHomePage,
    name: 'workspace',
    icon: 'workspace-icon.svg',
    component: './Admin',
    access: 'design_workspace',
  },
  {
    path: PATH.designerFavourite,
    name: 'favourite',
    icon: 'my-favourite-icon.svg',
    component: './Designer/MyFavourite',
    access: 'design_my_favourite',
  },
  {
    path: PATH.designerProduct,
    name: 'product',
    icon: 'product-icon.svg',
    access: 'design_product',
    routes: [
      {
        path: PATH.designerBrandProduct,
        name: 'brand.product',
        icon: 'brand-icon.svg',
        access: 'design_product_brand_product',
        routes: [
          {
            path: PATH.designerBrandProduct,
            component: './Designer/Products',
            hideInMenu: true,
          },
          {
            path: PATH.designerBrandProductDetail,
            component: './Brand/Products/ViewPage',
            hideInMenu: true,
          },
        ],
      },
      {
        path: PATH.designerCustomLibrary,
        name: 'custom.library',
        icon: 'design-firm-icon.svg',
        component: './Admin',
        access: 'design_product_custom_library',
      },
    ],
  },
  {
    path: PATH.designerProject,
    name: 'project',
    icon: 'project-icon.svg',
    access: 'design_project',
    routes: [
      {
        path: PATH.designerProject,
        component: './Designer/Project',
        hideInMenu: true,
      },
      {
        path: PATH.designerCreateProject,
        hideInMenu: true,
        component: './Designer/Project/CreatePage',
      },
      {
        path: PATH.designerUpdateProject,
        hideInMenu: true,
        component: './Designer/Project/UpdatePage',
      },
    ],
  },
  {
    path: PATH.designerAdminstration,
    name: 'adminstration',
    icon: 'adminstration-icon.svg',
    component: './Admin',
    access: 'design_administration',
    routes: [
      {
        path: PATH.designerOfficeProfile,
        name: 'office.profile',
        icon: 'office-profile-icon.svg',
        component: './Admin',
        access: 'design_administration_office_profile',
      },
      {
        path: PATH.designerOfficeLocation,
        name: 'location',
        icon: 'location-icon.svg',
        component: './Admin',
        access: 'design_administration_location',
      },
      {
        path: PATH.designerOfficeTeamProfile,
        name: 'team.profile',
        icon: 'team-profile-icon.svg',
        component: './Admin',
        access: 'design_administration_team_profile',
      },
      {
        path: PATH.designerMaterialProductCode,
        name: 'material/product.code',
        icon: 'material-product-code.svg',
        component: './Admin',
        access: 'design_administration_material_product_code',
      },
    ],
  },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/welcome',
  //   component: './Welcome',
  // },
  // GENERAL PAGE
  {
    component: './404',
  },
];

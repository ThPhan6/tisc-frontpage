import { PATH } from '../src/constants/path';

const routes = [
  // NO REQUIRE AUTHENTICATION
  {
    path: PATH.sharedProduct,
    component: '../features/product/components/ProductDetailContainer',
    layout: false,
  },
  {
    path: PATH.sharedCustomProduct,
    component: './Designer/Products/CustomLibrary/ProductLibraryDetail',
    layout: false,
  },
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
  {
    path: PATH.cancelBooking,
    component: './LandingPage',
    layout: false,
  },
  {
    path: PATH.reScheduleBooking,
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
    access: 'tisc_workspace',
    component: '../features/my-workspace',
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
            component: './TISC/UserGroup/Brand/BrandCreatePage',
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
            component: './TISC/UserGroup/DesignFirm/DesignFirmUpdatePage',
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
        access: 'tisc_project_list',
        routes: [
          {
            path: PATH.tiscProjectListing,
            component: './TISC/ProjectListing',
            hideInMenu: true,
          },
          {
            path: PATH.tiscProjectListingDetail,
            component: './TISC/ProjectListing/detail.tsx',
            hideInMenu: true,
          },
        ],
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
            component: '../features/categories/components/CategoryEntryForm',
          },
          {
            path: PATH.updateCategories,
            hideInMenu: true,
            component: '../features/categories/components/CategoryEntryForm',
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
                component: './TISC/Product/Basis/Conversion/components/ConversionsEntryForm',
              },
              {
                path: PATH.updateConversions,
                hideInMenu: true,
                component: './TISC/Product/Basis/Conversion/components/ConversionsEntryForm',
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
                component: './TISC/Product/Basis/Preset/components/PresetsEntryForm',
              },
              {
                path: PATH.updatePresets,
                hideInMenu: true,
                component: './TISC/Product/Basis/Preset/components/PresetsEntryForm',
              },
            ],
          },
        ],
      },

      {
        path: PATH.attribute,
        name: 'Brand Attributes',
        icon: 'attributes-icon.svg',
        access: 'tisc_product_attribute',
        routes: [
          {
            path: PATH.attribute,
            component: './TISC/Product/BrandAttribute',
            hideInMenu: true,
          },
          {
            path: PATH.attributeGeneral,
            name: 'General',
            hideInMenu: true,
            routes: [
              {
                path: PATH.attributeGeneral,
                component: './TISC/Product/Attribute',
                hideInMenu: true,
              },
              {
                path: PATH.attributeGeneralCreate,
                hideInMenu: true,
                component: './TISC/Product/Attribute/components/AttributeEntryForm',
              },
              {
                path: PATH.attributeGeneralUpdate,
                hideInMenu: true,
                component: './TISC/Product/Attribute/components/AttributeEntryForm',
              },
            ],
          },
          {
            path: PATH.attributeFeature,
            name: 'Feature',
            hideInMenu: true,
            routes: [
              {
                path: PATH.attributeFeature,
                component: './TISC/Product/Attribute',
                hideInMenu: true,
              },
              {
                path: PATH.attributeFeatureCreate,
                hideInMenu: true,
                component: './TISC/Product/Attribute/components/AttributeEntryForm',
              },
              {
                path: PATH.attributeFeatureUpdate,
                hideInMenu: true,
                component: './TISC/Product/Attribute/components/AttributeEntryForm',
              },
            ],
          },
          {
            path: PATH.attributeSpecification,
            name: 'Specification',
            hideInMenu: true,
            routes: [
              {
                path: PATH.attributeSpecification,
                component: './TISC/Product/Attribute',
                hideInMenu: true,
              },
              {
                path: PATH.attributeSpecificationCreate,
                hideInMenu: true,
                component: './TISC/Product/Attribute/components/AttributeEntryForm',
              },
              {
                path: PATH.attributeSpecificationUpdate,
                hideInMenu: true,
                component: './TISC/Product/Attribute/components/AttributeEntryForm',
              },
            ],
          },
          {
            path: PATH.options,
            name: 'Component',
            hideInMenu: true,
            routes: [
              {
                path: PATH.options,
                component: './TISC/Product/Basis/Option',
                hideInMenu: true,
              },
              {
                path: PATH.createOptions,
                hideInMenu: true,
                component: './TISC/Product/Basis/Option/components/OptionsEntryForm',
              },
              {
                path: PATH.updateOptions,
                hideInMenu: true,
                component: './TISC/Product/Basis/Option/components/OptionsEntryForm',
              },
              {
                path: PATH.LinkageDataSet,
                hideInMenu: true,
                component: './TISC/Product/Basis/Option/components/LinkagePage.tsx',
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
            component: '../features/product/components/ProductDetailContainer',
            hideInMenu: true,
          },
          {
            path: PATH.productConfigurationUpdate,
            component: '../features/product/components/ProductDetailContainer',
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
                component:
                  './TISC/Adminstration/Documentation/PolicyTemplate/UpdateAgreementPoliciesPage',
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
            component: '../features/locations/components/LocationTable',
            hideInMenu: true,
          },
          {
            path: PATH.tiscLocationCreate,
            hideInMenu: true,
            component: '../features/locations/components/LocationDetail',
          },
          {
            path: PATH.tiscLocationUpdate,
            hideInMenu: true,
            component: '../features/locations/components/LocationDetail',
          },
        ],
      },
      {
        path: PATH.tiscTeamProfile,
        name: 'team.profile',
        icon: 'team-profile-icon.svg',
        access: 'tisc_administration_team_profile',
        routes: [
          {
            path: PATH.tiscTeamProfile,
            component: '../features/team-profiles/components/TeamProfilesTable',
            hideInMenu: true,
          },
          {
            path: PATH.tiscCreateTeamProfile,
            component: '../features/team-profiles/components/TeamProfilesEntryForm',
            hideInMenu: true,
          },
          {
            path: PATH.tiscUpdateTeamProfile,
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
                component: '../features/InspirationalQuotes/components/InspirationalQuotesDetail',
                hideInMenu: true,
              },
              {
                path: PATH.updateQuotation,
                component: '../features/InspirationalQuotes/components/InspirationalQuotesDetail',
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
            routes: [
              {
                path: PATH.tiscRevenueService,
                component: './TISC/Adminstration/Revenue/Services',
                hideInMenu: true,
              },
              {
                path: PATH.tiscRevenueServiceCreate,
                component: './TISC/Adminstration/Revenue/Services/ServiceCreatePage',
                hideInMenu: true,
              },
              {
                path: PATH.tiscRevenueServiceDetail,
                component: './TISC/Adminstration/Revenue/Services/ServiceViewPage',
                hideInMenu: true,
              },
              {
                path: PATH.tiscRevenueServiceUpdate,
                component: './TISC/Adminstration/Revenue/Services/ServiceCreatePage',
                hideInMenu: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: PATH.brandHomePage,
    name: 'workspace',
    icon: 'workspace-icon.svg',
    access: 'brand_workspace',

    routes: [
      {
        path: PATH.brandHomePage,
        component: '../features/my-workspace',
        hideInMenu: true,
      },
      {
        path: PATH.brandDashboardProjectDetail,
        component: './Brand/ProjectTracking/ProjectTrackingDetail',
        hideInMenu: true,
      },
    ],
  },
  {
    path: PATH.brandProduct,
    name: 'product',
    icon: 'product-icon.svg',
    access: 'brand_product',
    routes: [
      {
        path: PATH.brandProduct,
        component: './Brand/Products',
        hideInMenu: true,
      },
      {
        path: PATH.updateProductBrand,
        component: './Brand/Products/ProductBrandViewPage',
        hideInMenu: true,
      },
    ],
  },

  {
    path: PATH.brandGeneralInquiry,
    name: 'general_inquiry',
    icon: 'general-inquiry-icon.svg',
    access: 'brand_genenral_inquiry',
    routes: [
      {
        path: PATH.brandGeneralInquiry,
        component: './Brand/GeneralInquiries',
        hideInMenu: true,
      },
      {
        path: PATH.brandGeneralInquiryDetail,
        component: './Brand/GeneralInquiries/detail.tsx',
        hideInMenu: true,
      },
    ],
  },

  {
    path: PATH.brandProjectTracking,
    name: 'project_tracking',
    icon: 'project-tracking-icon.svg',
    access: 'brand_project_tracking',
    routes: [
      {
        path: PATH.brandProjectTracking,
        component: './Brand/ProjectTracking',
        hideInMenu: true,
      },
      {
        path: PATH.brandProjectTrackingDetail,
        component: './Brand/ProjectTracking/ProjectTrackingDetail',
        hideInMenu: true,
      },
    ],
  },
  {
    path: PATH.brandPricesInventories,
    name: 'prices_inventories',
    icon: 'bar-code-icon.svg',
    access: 'brand_prices_and_inventories',
    routes: [
      {
        path: PATH.brandPricesInventories,
        component: './Brand/PricesAndInventories',
        hideInMenu: true,
      },
      {
        path: PATH.brandPricesInventoriesTable,
        component:
          './Brand/PricesAndInventories/PriceAndInventoryTable/Templates/PriceAndInventoryTable',
        hideInMenu: true,
      },
      {
        path: PATH.brandPricesInventoriesForm,
        component: './Brand/PricesAndInventories/PriceAndInventoryForm',
        hideInMenu: true,
      },
      {
        path: PATH.brandPricesInventoriesFormUpdate,
        component: './Brand/PricesAndInventories/PriceAndInventoryForm',
        hideInMenu: true,
      },
    ],
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
        component: '../features/office-profile',
      },
      {
        path: PATH.brandLocation,
        name: 'location',
        icon: 'location-icon.svg',
        access: 'brand_administration_location',
        routes: [
          {
            path: PATH.brandLocation,
            component: '../features/locations/components/LocationTable',

            hideInMenu: true,
          },
          {
            path: PATH.brandLocationCreate,
            hideInMenu: true,
            component: '../features/locations/components/LocationDetail',
          },
          {
            path: PATH.brandLocationUpdate,
            hideInMenu: true,
            component: '../features/locations/components/LocationDetail',
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
            component: '../features/team-profiles/components/TeamProfilesTable',
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
        path: PATH.brandPartners,
        name: 'brand.partners',
        icon: 'shaking-hands.svg',
        access: 'brand_administration_partners',
        routes: [
          {
            path: PATH.brandPartners,
            component: './Brand/Adminstration/Partners/PartnersTable',
            hideInMenu: true,
          },
          {
            path: PATH.brandCreatePartnerCompany,
            component: './Brand/Adminstration/Partners/CompanyEntryForm',
            hideInMenu: true,
          },
          {
            path: PATH.brandUpdatePartner,
            component: './Brand/Adminstration/Partners/CompanyEntryForm',
            hideInMenu: true,
          },
          {
            path: PATH.brandCreatePartnerContact,
            component: './Brand/Adminstration/Partners/ContactEntryForm',
            hideInMenu: true,
          },
          {
            path: PATH.brandUpdatePartnerContact,
            component: './Brand/Adminstration/Partners/ContactEntryForm',
            hideInMenu: true,
          },
        ],
      },
      // {
      //   path: PATH.distributors,
      //   name: 'brand.distributor',
      //   icon: 'distributor-icon.svg',
      //   access: 'brand_administration_distributor',
      //   routes: [
      //     {
      //       path: PATH.distributors,
      //       component: './Brand/Adminstration/Distributors',
      //       hideInMenu: true,
      //     },
      //     {
      //       path: PATH.createDistributor,
      //       component: '../features/distributors/components/DistributorDetail',
      //       hideInMenu: true,
      //     },
      //     {
      //       path: PATH.updateDistributor,
      //       component: '../features/distributors/components/DistributorDetail',
      //       hideInMenu: true,
      //     },
      //   ],
      // },
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
            component: './Brand/Adminstration/MarketAvailability/UpdateMarketAvailabilityPage',
            hideInMenu: true,
          },
        ],
      },
      {
        path: PATH.brandBilledServices,
        name: 'brand.billed_services',
        icon: 'billed-service-icon.svg',
        access: 'brand_administration_billed_services',
        routes: [
          {
            path: PATH.brandBilledServices,
            component: './Brand/Adminstration/BilledServices',
            hideInMenu: true,
          },
          {
            path: PATH.brandBilledServicesView,
            component: './Brand/Adminstration/BilledServices/BilledServicesDetail',
            hideInMenu: true,
          },
        ],
      },
    ],
  },
  {
    path: PATH.designerHomePage,
    name: 'workspace',
    icon: 'workspace-icon.svg',
    component: '../features/my-workspace',
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
            component: './Designer/Products/BrandProducts',
            hideInMenu: true,
          },
          {
            path: PATH.designerBrandProductDetail,
            component: './Brand/Products/ProductBrandViewPage',
            hideInMenu: true,
          },
        ],
      },
      {
        path: PATH.designerCustomProduct,
        name: 'library.resources',
        icon: 'office-library-icon.svg',
        access: 'design_product_custom_library',
        routes: [
          {
            path: PATH.designerCustomProduct,
            component: './Designer/Products/CustomLibrary',
            hideInMenu: true,
          },
          {
            path: PATH.designerCustomResource,
            component: './Designer/CustomResource/CustomResource',
            hideInMenu: true,
          },
          {
            path: PATH.designerCustomProductCreate,
            component: './Designer/Products/CustomLibrary/ProductLibraryUpdate',
            hideInMenu: true,
          },
          {
            path: PATH.designerCustomProductUpdate,
            component: './Designer/Products/CustomLibrary/ProductLibraryUpdate',
            hideInMenu: true,
          },
          {
            path: PATH.designerCustomProductDetail,
            component: './Designer/Products/CustomLibrary/ProductLibraryDetail',
            hideInMenu: true,
          },

          {
            path: PATH.designerCustomResourceCreate,
            component: './Designer/CustomResource/CustomResourceCreatePage',
            hideInMenu: true,
          },
          {
            path: PATH.designerCustomResourceUpdate,
            component: './Designer/CustomResource/CustomResourceCreatePage',
            hideInMenu: true,
          },
          {
            path: PATH.designerCustomResourceDetail,
            component: './Designer/CustomResource/CustomResourceViewPage',
            hideInMenu: true,
          },
        ],
      },
    ],
  },
  {
    path: PATH.designerProject,
    name: 'project',
    icon: 'project-icon.svg',
    access: 'design_project_overal_listing',
    routes: [
      {
        path: PATH.designerProject,
        component: './Designer/Project',
        hideInMenu: true,
      },
      {
        path: PATH.designerProjectCreate,
        hideInMenu: true,
        component: './Designer/Project/ProjectCreatePage',
      },
      {
        path: PATH.designerUpdateProject,
        hideInMenu: true,
        component: './Designer/Project/ProjectUpdatePage',
      },
    ],
  },
  {
    path: PATH.designerUpdateProject,
    hideInMenu: true,
    component: './Designer/Project/ProjectUpdatePage',
    access: 'design_project_updating',
  },
  {
    path: PATH.designerAdminstration,
    name: 'adminstration',
    icon: 'adminstration-icon.svg',
    access: 'design_administration',
    routes: [
      {
        path: PATH.designerOfficeProfile,
        name: 'office.profile',
        icon: 'office-profile-icon.svg',
        component: '../features/office-profile',
        access: 'design_administration_office_profile',
      },
      {
        path: PATH.designFirmLocation,
        name: 'location',
        icon: 'location-icon.svg',
        access: 'design_administration_location',
        routes: [
          {
            path: PATH.designFirmLocation,
            component: '../features/locations/components/LocationTable',
            hideInMenu: true,
          },
          {
            path: PATH.designFirmLocationCreate,
            component: '../features/locations/components/LocationDetail',
            hideInMenu: true,
          },
          {
            path: PATH.designFirmLocationUpdate,
            component: '../features/locations/components/LocationDetail',
            hideInMenu: true,
          },
        ],
      },
      {
        path: PATH.designerOfficeTeamProfile,
        name: 'team.profile',
        icon: 'team-profile-icon.svg',
        access: 'design_administration_team_profile',
        routes: [
          {
            path: PATH.designerOfficeTeamProfile,
            component: '../features/team-profiles/components/TeamProfilesTable',
            hideInMenu: true,
          },
          {
            path: PATH.designerOfficeTeamProfileCreate,
            component: '../features/team-profiles/components/TeamProfilesEntryForm',
            hideInMenu: true,
          },
          {
            path: PATH.designerOfficeTeamProfileUpdate,
            component: '../features/team-profiles/components/TeamProfilesEntryForm',
            hideInMenu: true,
          },
        ],
      },
      {
        path: PATH.designerMaterialProductCode,
        name: 'material/product.code',
        icon: 'material-product-code.svg',
        access: 'design_administration_material_product_code',
        routes: [
          {
            path: PATH.designerMaterialProductCode,
            component: './Designer/Adminstration/MaterialProductCode',
            hideInMenu: true,
          },
          {
            path: PATH.designerMaterialProductCodeCreate,
            hideInMenu: true,
            component: '../features/material-product-code/components/MaterialProductEntryForm',
          },
          {
            path: PATH.designerMaterialProductCodeUpdate,
            hideInMenu: true,
            component: '../features/material-product-code/components/MaterialProductEntryForm',
          },
        ],
      },
    ],
  },
  {
    path: PATH.partnerProduct,
    name: 'product',
    icon: 'product-icon.svg',
    access: 'partner_product',
    routes: [
      {
        path: PATH.partnerProduct,
        component: './Brand/Products',
        hideInMenu: true,
      },
      {
        path: PATH.updateProductPartner,
        component: './Brand/Products/ProductBrandViewPage',
        hideInMenu: true,
      },
    ],
  },
  {
    path: PATH.partnerGeneralInquiry,
    name: 'general_inquiry',
    icon: 'general-inquiry-icon.svg',
    access: 'partner_genenral_inquiry',
    routes: [
      {
        path: PATH.partnerGeneralInquiry,
        component: './Brand/GeneralInquiries',
        hideInMenu: true,
      },
      {
        path: PATH.partnerGeneralInquiryDetail,
        component: './Brand/GeneralInquiries/detail.tsx',
        hideInMenu: true,
      },
    ],
  },
  {
    path: PATH.partnerProjectTracking,
    name: 'project_tracking',
    icon: 'project-tracking-icon.svg',
    access: 'partner_project_tracking',
    routes: [
      {
        path: PATH.partnerProjectTracking,
        component: './Brand/ProjectTracking',
        hideInMenu: true,
      },
      {
        path: PATH.partnerProjectTrackingDetail,
        component: './Brand/ProjectTracking/ProjectTrackingDetail',
        hideInMenu: true,
      },
    ],
  },
  {
    component: './404',
  },
];

const inject404Routes = (curRoutes: any) => {
  return curRoutes.map((route: any) => {
    if (route.routes) {
      route.routes.push({
        component: './404',
      });
      return {
        ...route,
        routes: inject404Routes(route.routes),
      };
    }
    return route;
  });
};

const injectedRoutes = inject404Routes(routes);

export default injectedRoutes;

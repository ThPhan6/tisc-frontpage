export const PATH = {
  // public path
  landingPage: '/',
  resetPassword: '/reset-password',
  createPassword: '/create-password',
  verifyAccount: '/verify',
  sharedProduct: '/shared-product/:id',
  sharedCustomProduct: '/shared-custom-product/:id',
  reScheduleBooking: '/booking/:id/re-schedule',
  cancelBooking: '/booking/:id/cancel',
  // private path
  profiles: '/profile-settings',
  tiscHomePage: '/tisc/dashboard',
  brandHomePage: '/brand/dashboard',
  brandDashboardProjectDetail: '/brand/dashboard/:id',
  designerHomePage: '/design-firms/dashboard',

  //how-to
  howTo: '/howTo',

  // Tisc
  // category
  categories: '/tisc/products/categories',
  createCategories: '/tisc/products/categories/create',
  updateCategories: '/tisc/products/categories/update/:id',
  // user group
  tiscUserGroupList: '/tisc/user-groups',

  tiscUserGroupBrandList: '/tisc/user-groups/brands',
  tiscUserGroupBrandEntryFrom: '/tisc/user-groups/brands/create',
  tiscUserGroupBrandViewDetail: '/tisc/user-groups/brands/update/:id',

  // user group - design-firms
  tiscUserGroupDesignerList: '/tisc/user-groups/design-firms',
  tiscUserGroupViewDesigner: '/tisc/user-groups/design-firms/view/:id',

  // tisc project_tracking
  tiscProject: '/tisc/projects',
  tiscProjectListing: '/tisc/projects/listing',
  tiscProjectListingDetail: '/tisc/projects/listing/:id',
  tiscProduct: '/tisc/products',

  // basic
  tiscBasis: '/tisc/products/basis',
  //preset
  presets: '/tisc/products/basis/presets',
  createPresets: '/tisc/products/basis/presets/create',
  updatePresets: '/tisc/products/basis/presets/:id',

  // conversion
  conversions: '/tisc/products/basis/conversions',
  createConversions: '/tisc/products/basis/conversions/create',
  updateConversions: '/tisc/products/basis/conversions/:id',

  // component
  options: '/tisc/products/attributes/:brandName/:brandId/component',
  createOptions:
    '/tisc/products/attributes/:brandName/:brandId/component/create/:groupName/:groupId',
  updateOptions: '/tisc/products/attributes/:brandName/:brandId/component/:id/sub/:subId',
  LinkageDataSet: '/tisc/products/attributes/:brandName/:brandId/component/:id/linkage',

  // brand attributes
  attribute: '/tisc/products/attributes',

  // attribute general
  attributeGeneral: '/tisc/products/attributes/:brandName/:brandId/general',
  attributeGeneralCreate: '/tisc/products/attributes/:brandName/:brandId/general/create',
  attributeGeneralUpdate: '/tisc/products/attributes/:brandName/:brandId/general/:id',

  // attribute feature
  attributeFeature: '/tisc/products/attributes/:brandName/:brandId/feature',
  attributeFeatureCreate: '/tisc/products/attributes/:brandName/:brandId/feature/create',
  attributeFeatureUpdate: '/tisc/products/attributes/:brandName/:brandId/feature/:id',

  // attribute specification
  attributeSpecification: '/tisc/products/attributes/:brandName/:brandId/specification',
  attributeSpecificationCreate:
    '/tisc/products/attributes/:brandName/:brandId/specification/create',
  attributeSpecificationUpdate: '/tisc/products/attributes/:brandName/:brandId/specification/:id',

  //tisc adminstration
  tiscAdministration: '/tisc/adminstration',

  // team profile
  tiscTeamProfile: '/tisc/adminstration/team-profiles',
  tiscCreateTeamProfile: '/tisc/adminstration/team-profiles/create',
  tiscUpdateTeamProfile: '/tisc/adminstration/team-profiles/update/:id',

  // inspirational quotes
  tiscAdministrationMessage: '/tisc/adminstration/messages',
  quotation: '/tisc/adminstration/messages/quotation',
  createQuotation: '/tisc/adminstration/messages/quotation/create',
  updateQuotation: '/tisc/adminstration/messages/quotation/update/:id',
  // email autorepsonder
  emailAuto: '/tisc/adminstration/messages/email-autoresponders',
  updateEmailAuto: '/tisc/adminstration/messages/email-autoresponders/update/:id',

  // configuration
  productConfiguration: '/tisc/products/configuration',
  productConfigurationCreate: '/tisc/products/configuration/create/:brandId',
  productConfigurationUpdate: '/tisc/products/configuration/:id',

  // documentation
  tiscDocumentation: '/tisc/adminstration/documentation',
  policy: '/tisc/adminstration/documentation/agreement-policy-terms',
  policyUpdate: '/tisc/adminstration/documentation/agreement-policy-terms/:id',

  tiscDocumentationHowTo: '/tisc/adminstration/documentation/how-to',
  tiscRevenue: '/tisc/adminstration/revenues',
  tiscRevenueService: '/tisc/adminstration/revenues/service',
  tiscRevenueServiceCreate: '/tisc/adminstration/revenues/service/create',
  tiscRevenueServiceUpdate: '/tisc/adminstration/revenues/service/update/:id',
  tiscRevenueServiceDetail: '/tisc/adminstration/revenues/service/:id',

  // tisc - locations
  tiscLocation: '/tisc/adminstration/locations',
  tiscLocationCreate: '/tisc/adminstration/locations/create',
  tiscLocationUpdate: '/tisc/adminstration/locations/:id',

  //brand
  brandProduct: '/brand/product',
  updateProductBrand: '/brand/product/:id',
  partnerProduct: '/partner/product',
  updateProductPartner: '/partner/product/:id',

  /// general inquiries
  brandGeneralInquiry: '/brand/general-inquiry',
  brandGeneralInquiryDetail: '/brand/general-inquiry/:id',
  partnerGeneralInquiry: '/partner/general-inquiry',
  partnerGeneralInquiryDetail: '/partner/general-inquiry/:id',

  /// project tracking
  brandProjectTracking: '/brand/project-tracking',
  brandProjectTrackingDetail: '/brand/project-tracking/:id',
  partnerProjectTracking: '/partner/project-tracking',
  partnerProjectTrackingDetail: '/partner/project-tracking/:id',

  // prices & inventories
  brandPricesInventories: '/brand/prices-and-inventories',
  brandPricesInventoriesTable: '/brand/prices-and-inventories/categories',
  brandPricesInventoriesForm: '/brand/prices-and-inventories/create',
  brandPricesInventoriesFormUpdate: '/brand/prices-and-inventories/:id',

  //adminstration
  brandAdministration: '/brand/adminstration',
  brandAdministrationProfile: '/brand/adminstration/brand-profile',
  // market availablity
  marketAvailability: '/brand/adminstration/market-availability',
  updateMarketAvailability: '/brand/adminstration/market-availability/:id',
  //locations
  brandLocation: '/brand/adminstration/locations',
  brandLocationCreate: '/brand/adminstration/locations/create',
  brandLocationUpdate: '/brand/adminstration/locations/:id',
  //distributors
  distributors: '/brand/adminstration/distributors',
  createDistributor: '/brand/adminstration/distributors/create',
  updateDistributor: '/brand/adminstration/distributors/:id',
  /// brand team profile
  brandTeamProfile: '/brand/adminstration/team-profiles',
  brandCreateTeamProfile: '/brand/adminstration/team-profiles/create',
  brandUpdateTeamProfile: '/brand/adminstration/team-profiles/update/:id',
  /// partners
  brandPartners: '/brand/adminstration/partners',
  brandCreatePartnerCompany: '/brand/adminstration/partners/create/company',
  brandUpdatePartner: '/brand/adminstration/partners/:id',
  brandCreatePartnerContact: '/brand/adminstration/partners/create/contact',
  brandUpdatePartnerContact: '/brand/adminstration/partners/contact/:id',

  //brand billed services
  brandBilledServices: '/brand/adminstration/billed-services',
  brandBilledServicesView: '/brand/adminstration/billed-services/:id',

  /// design-firms
  // My Favourite
  designerFavourite: '/design-firms/my-favorites',
  // Brand Product
  designerProduct: '/design-firms/products',
  designerBrandProduct: '/design-firms/products/brand-products',
  designerBrandProductDetail: '/design-firms/products/brand-products/:id',
  // Library (Custom PRoduct)
  designerCustomProduct: '/design-firms/products/library-resources',
  designerCustomProductCreate: '/design-firms/products/library-resources/create',
  designerCustomProductUpdate: '/design-firms/products/library-resources/update/:id',
  designerCustomProductDetail: '/design-firms/products/library-resources/:id',
  // Resources (Vendor Management)
  designerCustomResource: '/design-firms/products/library-resources/custom-resources',
  designerCustomResourceCreate: '/design-firms/products/library-resources/custom-resources/create',
  designerCustomResourceUpdate:
    '/design-firms/products/library-resources/custom-resources/update/:id',
  designerCustomResourceDetail: '/design-firms/products/library-resources/custom-resources/:id',
  // Project
  designerProject: '/design-firms/projects',
  designerUpdateProject: '/design-firms/projects/:id',
  designerProjectCreate: '/design-firms/projects/create',
  // Adminstration
  designerAdminstration: '/design-firms/administration',
  // Office Profile
  designerOfficeProfile: '/design-firms/administration/office-profile',
  // Team Profile
  designerOfficeTeamProfile: '/design-firms/administration/team-profiles',
  designerOfficeTeamProfileCreate: '/design-firms/administration/team-profiles/create',
  designerOfficeTeamProfileUpdate: '/design-firms/administration/team-profiles/:id',
  // Material Product Code
  designerMaterialProductCode: '/design-firms/administration/material-product-code',
  designerMaterialProductCodeCreate: '/design-firms/administration/material-product-code/create',
  designerMaterialProductCodeUpdate: '/design-firms/administration/material-product-code/:id',
  // Location
  designFirmLocation: '/design-firms/administration/locations',
  designFirmLocationCreate: '/design-firms/administration/locations/create',
  designFirmLocationUpdate: '/design-firms/administration/locations/:id',
};

export const PUBLIC_PATH = [
  PATH.landingPage,
  PATH.resetPassword,
  PATH.createPassword,
  PATH.verifyAccount,
  PATH.sharedProduct,
  PATH.cancelBooking,
  PATH.reScheduleBooking,
];

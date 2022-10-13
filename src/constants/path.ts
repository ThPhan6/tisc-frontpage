export const PATH = {
  // public path
  landingPage: '/',
  resetPassword: '/reset-password',
  createPassword: '/create-password',
  verifyAccount: '/verify',
  // private path
  profiles: '/profile-settings',
  tiscHomePage: '/tisc/dashboard',
  brandHomePage: '/brand/dashboard',
  brandViewDetailDashboard: '/brand/dashboard/:id',

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

  // option
  options: '/tisc/products/basis/options',
  createOptions: '/tisc/products/basis/options/create',
  updateOptions: '/tisc/products/basis/options/:id',
  // attribute general
  attribute: '/tisc/products/attributes',
  attributeGeneral: '/tisc/products/attributes/general',
  attributeGeneralCreate: '/tisc/products/attributes/general/create',
  attributeGeneralUpdate: '/tisc/products/attributes/general/:id',

  // attribute general
  attributeFeature: '/tisc/products/attributes/feature',
  attributeFeatureCreate: '/tisc/products/attributes/feature/create',
  attributeFeatureUpdate: '/tisc/products/attributes/feature/:id',

  // attribute feature
  attributeSpecification: '/tisc/products/attributes/specification',
  attributeSpecificationCreate: '/tisc/products/attributes/specification/create',
  attributeSpecificationUpdate: '/tisc/products/attributes/specification/:id',

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
  tiscRevenueSubscription: '/tisc/adminstration/revenues/subscription',

  // tisc - locations
  tiscLocation: '/tisc/adminstration/locations',
  tiscLocationCreate: '/tisc/adminstration/locations/create',
  tiscLocationUpdate: '/tisc/adminstration/locations/:id',

  //brand
  brandProduct: '/brand/product',
  updateProductBrand: '/brand/product/:id',

  /// general inquiries
  brandGeneralInquiry: '/brand/general-inquiry',
  brandGeneralInquiryDetail: '/brand/general-inquiry/detail',

  /// project tracking
  brandProjectTracking: '/brand/project-tracking',
  brandProjectTrackingDetail: '/brand/project-tracking/:id',
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
  // brand subscription
  brandSubscription: '/brand/adminstration/subscription',

  // design-firms
  designerHomePage: '/design-firms/dashboard',
  designerFavourite: '/design-firms/my-favorites',
  designerProduct: '/design-firms/products',
  designerBrandProduct: '/design-firms/products/brand-products',
  designerBrandProductDetail: '/design-firms/products/brand-products/:id',
  designerCustomLibrary: '/design-firms/products/custom-library',
  designerProject: '/design-firms/projects',
  designerCreateProject: '/design-firms/projects/create',
  designerUpdateProject: '/design-firms/projects/:id',
  designerProjectCreate: '/design-firms/projects/create',
  designerProjectUpdate: '/design-firms/projects/update/:id',
  designerAdminstration: '/design-firms/administration',
  designerOfficeProfile: '/design-firms/administration/office-profile',
  designerOfficeTeamProfile: '/design-firms/administration/team-profiles',
  designerOfficeTeamProfileCreate: '/design-firms/administration/team-profiles/create',
  designerOfficeTeamProfileUpdate: '/design-firms/administration/team-profiles/:id',
  designerMaterialProductCode: '/design-firms/administration/material-product-code',
  designerMaterialProductCodeCreate: '/design-firms/administration/material-product-code/create',
  designerMaterialProductCodeUpdate: '/design-firms/administration/material-product-code/:id',

  // location
  designFirmLocation: '/design-firms/administration/locations',
  designFirmLocationCreate: '/design-firms/administration/locations/create',
  designFirmLocationUpdate: '/design-firms/administration/locations/:id',
};

export const PUBLIC_PATH = [
  PATH.landingPage,
  PATH.resetPassword,
  PATH.createPassword,
  PATH.verifyAccount,
];

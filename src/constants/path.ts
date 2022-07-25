export const PATH = {
  // public path
  landingPage: '/',
  resetPassword: '/reset-password',
  createPassword: '/create-password',

  // private path
  profiles: '/profiles',
  homePage: '/tisc/dashboard',
  brandHomePage: '/brand/dashboard',

  //how-to
  howTo: '/howTo',

  // Tisc
  // category
  categories: '/tisc/products/categories',
  createCategories: '/tisc/products/categories/create',
  updateCategories: '/tisc/products/categories/update/:id',

  // basic
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
  attributeGeneral: '/tisc/products/attributes/general',
  attributeGeneralCreate: '/tisc/products/attributes/general/create',
  attributeGeneralUpdate: '/tisc/products/attributes/general/:id',
  //

  // team profile
  teamProfile: '/tisc/adminstration/team-profiles',
  createTeamProfile: '/tisc/adminstration/team-profiles/create',
  updateTeamProfile: '/tisc/adminstration/team-profiles/update/:id',

  // inspirational quotes
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
  policy: '/tisc/adminstration/documentation/agreement-policy-terms',
  policyUpdate: '/tisc/adminstration/documentation/agreement-policy-terms/:id',

  // tisc - locations
  tiscLocation: '/tisc/adminstration/locations',
  tiscLocationCreate: '/tisc/adminstration/locations/create',
  tiscLocationUpdate: '/tisc/adminstration/locations/:id',

  //brand
  //adminstration
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
  // brand product
  productBrand: '/brand/product',
  updateProductBrand: '/brand/product/:id',
};

export const PUBLIC_PATH = [PATH.landingPage, PATH.resetPassword, PATH.createPassword];

export const PATH = {
  // public path
  landingPage: '/',
  resetPassword: '/reset-password',

  // private path
  profiles: '/profiles',
  homePage: '/tisc/dashboard',
  brandHomePage: '/brand/dashboard',

  //how-to
  howTo: '/howTo',

  // Tisc
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

  // inspirational quotation
  quotation: '/tisc/adminstration/messages/quotation',
  createQuotation: '/tisc/adminstration/messages/quotation/create',
  updateQuotation: '/tisc/adminstration/messages/quotation/update/:id',
  // email autorepsonder
  emailAuto: '/tisc/adminstration/messages/email-auto',
  updateEmailAuto: '/tisc/adminstration/messages/email-auto/update/:id',

  // configuration
  productConfiguration: '/tisc/products/configuration',
  productConfigurationCreate: '/tisc/products/configuration/create/:brandId',
  productConfigurationUpdate: '/tisc/products/configuration/:id',

  // tisc - locations
  tiscLocation: '/tisc/adminstration/locations',
  tiscLocationCreate: '/tisc/adminstration/locations/create',
  tiscLocationUpdate: '/tisc/adminstration/locations/:id',

  //brand
  //adminstration
  //distributors
  distributors: '/brand/adminstration/distributors',
  createDistributor: '/brand/adminstration/distributors/create',
  updateDistributor: '/brand/adminstration/distributors/:id',
};

export const PUBLIC_PATH = [PATH.landingPage, PATH.resetPassword];

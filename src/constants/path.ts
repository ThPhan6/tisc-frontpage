export const PATH = {
  // public path
  landingPage: '/',
  resetPassword: '/reset-password',

  // private path
  profiles: '/profiles',
  homePage: '/tisc/dashboard',

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
};

export const PUBLIC_PATH = [PATH.landingPage, PATH.resetPassword];

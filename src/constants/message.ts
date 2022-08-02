export const MESSAGE_ERROR = {
  EMAIL: 'Unknown email',
  PASSWORD: 'Password error',
  CONFIRM_PASSWORD: 'Passwords do not match',
  PHONE_INPUT: 'Invalid phone number',
  POSTAL_CODE: 'You are allowed to enter 10 characters only',
  reachLogoSizeLimit: 'Logo size limit reached (240 KB)',
  WORK_EMAIL: 'Work email is required',
  GENERAL_EMAIL: 'General email is required',
  EMAIL_AUTO: 'Message is required',
  EMAIL_UNVALID: 'Email is not valid',
  EMAIL_INVALID_INCORRECT: 'Email invalid is not incorrect',
  URL_INVALID: 'Some download urls are not valid',
  AGREE_TISC: 'Click to proceed',
  VERIFY_TOKEN_EXPIRED: 'Verification link has expired',
  PASSWORD_CHARACTER: 'Password must be more than 8 characters',
  FIRST_NAME: 'First name is required',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_ALREADY_USED: 'Email already taken',
};

export const MESSAGE_NOTIFICATION = {
  RESET_PASSWORD_SUCCESS: 'Reset password successfully',
  RESET_PASSWORD_ERROR: 'Reset password error',
  LOGIN_SUCCESS: 'Login successfully',
  LOGIN_ERROR: 'Login error',
  RESET_PASSWORD: 'Please check your mail to reset password',
  UPDATE_AVATAR_SUCCESS: 'Update avatar successfully',
  UPDATE_AVATAR_ERROR: 'Update avatar error',
  UPDATE_PERSONAL_PROFILE_SUCCESS: 'Update personal profile successfully',
  UPDATE_PERSONAL_PROFILE_ERROR: 'Update personal profile error',
  CREATE_PASSSWORD_VERIFICATION_SUCCESS: 'Create account password successfully',
  CREATE_PASSSWORD_VERIFICATION_FAILED: 'Failed to create account password',
  SIGN_UP_DESIGNER_SUCCESS:
    'Sign up designer successfully and please check your email to verify account',
  SIGN_UP_DESIGNER_ERROR: 'Sign up designer error',

  // Category
  CREATE_CATEGORY_SUCCESS: 'Create the category successfully',
  CREATE_CATEGORY_ERROR: 'Create the category error',
  DELETE_CATEGORY_SUCCESS: 'Delete the category successfully',
  DELETE_CATEGORY_ERROR: 'Delete the category error',
  UPDATE_CATEGORY_SUCCESS: 'Update the category successfully',
  UPDATE_CATEGORY_ERROR: 'Update the category error',
  GET_LIST_CATEGORY_ERROR: 'Failed to get list category',

  // product
  CREATE_PRODUCT_SUCCESS: 'Create product card successfully',
  CREATE_PRODUCT_ERROR: 'Failed to create product card',
  UPDATE_PRODUCT_SUCCESS: 'Update product card successfully',
  UPDATE_PRODUCT_ERROR: 'Failed to update product card',
  GET_LIST_PRODUCT_BY_BRAND_ERROR: 'Failed to get product list',
  DELETE_PRODUCT_SUCCESS: 'Delete product successfully',
  DELETE_PRODUCT_ERROR: 'Failed to delete product',
  DUPLICATE_PRODUCT_SUCCESS: 'Duplicate product successfully',
  DUPLICATE_PRODUCT_ERROR: 'Failed to duplicate product',
  GET_ONE_PRODUCT_ERROR: 'Failed to get product information',

  // product catelogue
  CREATE_PRODUCT_CATELOGUE_SUCCESS: 'Create product catelogue successfully',
  CREATE_PRODUCT_CATELOGUE_ERROR: 'Failed to create product catelogue',
  GET_PRODUCT_CATELOGUE_BY_PRODUCT_ID_ERROR: 'Failed to get product catelogues',

  // product download
  CREATE_PRODUCT_DOWNLOAD_SUCCESS: 'Create product download successfully',
  CREATE_PRODUCT_DOWNLOAD_ERROR: 'Failed to create product download',
  GET_PRODUCT_DOWNLOAD_BY_PRODUCT_ID_ERROR: 'Failed to get product downloads',

  // product tip
  CREATE_PRODUCT_TIP_SUCCESS: 'Create product tip successfully',
  CREATE_PRODUCT_TIP_ERROR: 'Failed to create product tip',
  GET_PRODUCT_TIP_BY_PRODUCT_ID_ERROR: 'Failed to get product tips',

  // ATTRIBUTE
  GET_ATTRRIBUTE_DATA_FAILED: 'Failed to get attribute data',
  CREATE_ATTRIBUTE_SUCCESS: 'Create attribute successfully',
  UPDATE_ATTRIBUTE_SUCCESS: 'Update attribute successfully',
  DELETE_ATTRIBUTE_SUCCESS: 'Delete attribute successfully',
  CREATE_ATTRIBUTE_ERROR: 'Error when create attribute',
  UPDATE_ATTRIBUTE_ERROR: 'Error when create attribute',
  DELETE_ATTRIBUTE_ERROR: 'Error when create attribute',
  GET_ONE_ATTRIBUTE_ERROR: 'Error when get attribute data',

  // Conversion
  CREATE_CONVERSION_SUCCESS: 'Create conversion successfully',
  CREATE_CONVERSION_ERROR: 'Create conversion error',
  DELETE_CONVERSION_SUCCESS: 'Delete conversion successfully',
  DELETE_CONVERSION_ERROR: 'Delete conversion error',
  UPDATE_CONVERSION_SUCCESS: 'Update conversion successfully',
  UPDATE_CONVERSION_ERROR: 'Update conversion error',

  // option
  GETLIST_OPTION_ERROR: 'Error when get basis option data',
  CREATE_OPTION_SUCCESS: 'Create option successfully',
  CREATE_OPTION_ERROR: 'Create option error',
  DELETE_OPTION_SUCCESS: 'Delete option successfully',
  DELETE_OPTION_ERROR: 'Delete option error',
  UPDATE_OPTION_SUCCESS: 'Update option successfully',
  UPDATE_OPTION_ERROR: 'Update option error',
  GET_ONE_OPTION_ERROR: 'Get one option error',

  //preset
  CREATE_PRESET_SUCCESS: 'Create preset successfully',
  CREATE_PRESET_ERROR: 'Create preset error',
  DELETE_PRESET_SUCCESS: 'Delete preset successfully',
  DELETE_PRESET_ERROR: 'Delete preset error',
  UPDATE_PRESET_SUCCESS: 'Update preset successfully',
  UPDATE_PRESET_ERROR: 'Update preset error',
  GET_ONE_PRESET_ERROR: 'Get one preset error',

  // department
  GET_LIST_DEPARTMENT_ERROR: 'Get list department error',

  // team profile
  GET_LIST_TEAM_PROFILE_ERROR: 'Get list team profile error',
  GET_ONE_TEAM_PROFILE_ERROR: 'Get one team profile error',
  CREATE_TEAM_PROFILE_SUCCESS: 'Create team profile successfully',
  CREATE_TEAM_PROFILE_ERROR: 'Create team profile error',
  DELETE_TEAM_PROFILE_SUCCESS: 'Delete team profile successfully',
  DELETE_TEAM_PROFILE_ERROR: 'Delete team profile error',
  UPDATE_TEAM_PROFILE_SUCCESS: 'Update team profile successfully',
  UPDATE_TEAM_PROFILE_ERROR: 'Update team profile error',
  SEND_INVITE_SUCCESS: 'Send invitation successfully',
  SEND_INVITE_ERROR: 'Failed to send invitation',

  // email auto
  GET_ONE_EMAIL_AUTO_ERROR: 'Get one email auto error',
  GET_LIST_EMAIL_AUTO_ERROR: 'Get list email auto error',
  GET_TARGETEDFOR_LIST_EMAIL_AUTO_ERROR: 'Get list targeted-for  error',
  GET_TOPIC_LIST_EMAIL_AUTO_ERROR: 'Get list topic  error',
  CREATE_EMAIL_AUTO_SUCCESS: 'Create email auto successfully',
  CREATE_EMAIL_AUTO_ERROR: 'Create email auto error',
  DELETE_EMAIL_AUTO_SUCCESS: 'Delete email auto successfully',
  DELETE_EMAIL_AUTO_ERROR: 'Delete email auto error',
  UPDATE_EMAIL_AUTO_SUCCESS: 'Update email auto successfully',
  UPDATE_EMAIL_AUTO_ERROR: 'Update email auto error',

  // configuration
  GET_BRAND_DATA_ERROR: 'Failed to get Brand data',
  GET_BRAND_SUMMARY_DATA_ERROR: 'Failed to get Brand summary data',
  CREATE_BRAND_COLLECTION_ERROR: 'Failed to create Brand collection',
  GET_BRAND_COLLECTION_ERROR: 'Failed to get Brand collection data',
  DELETE_BRAND_COLLECTION_SUCCESS: 'Delete collection successfully',
  DELETE_BRAND_COLLECTION_ERROR: 'Failed to delete collection',

  // market availability
  GET_LIST_MARKET_AVAILABILITY_ERROR: 'Get list market availability error',
  GET_ONE_MARKET_AVAILABILITY_ERROR: 'Get one market availability error',
  UPDATE_MARKET_AVAILABILITY_SUCCESS: 'Update market availability successfully',
  UPDATE_MARKET_AVAILABILITY_ERROR: 'Failed to update market availability',

  // permission
  GET_PERMISSION_DATA_ERROR: 'Failed to get permission data',
  UPDATE_PERMISSION_DATA_ERROR: 'Failed to update permission data',

  // inspirational quotes
  GET_LIST_INSPIRATIONAL_QUOTES_ERROR: 'Get list inspirational quotes error',
  GET_ONE_INSPIRATIONAL_QUOTES_ERROR: 'Get one inspirational quotes error',
  CREATE_INSPIRATIONAL_QUOTES_SUCCESS: 'Create inspirational quotes successfully',
  CREATE_INSPIRATIONAL_QUOTES_ERROR: 'Create inspirational quotes error',
  DELETE_INSPIRATIONAL_QUOTES_SUCCESS: 'Delete inspirational quotes successfully',
  DELETE_INSPIRATIONAL_QUOTES_ERROR: 'Delete inspirational quotes error',
  UPDATE_INSPIRATIONAL_QUOTES_SUCCESS: 'Update inspirational quotes successfully',
  UPDATE_INSPIRATIONAL_QUOTES_ERROR: 'Update inspirational quotes error',

  //location
  GET_LIST_LOCATION_ERROR: 'Get list location error',
  GET_LIST_WITH_COUNTRY_GROUP_ERROR: 'Get list with country group error',
  GET_COUNTRIES_ERROR: 'Failed to get countries data',
  GET_STATES_ERROR: 'Failed to get states data',
  GET_CITIES_ERROR: 'Failed to get cities data',
  GET_LIST_COUNTRY_GROUP: 'Failed to get list country group data',
  GET_ONE_COUNTRY_ERROR: 'Failed to get one country',
  CREATE_LOCATION_SUCCESS: 'Create location successfully',
  CREATE_LOCATION_FAILED: 'Failed to create new location',
  UPDATE_LOCATION_SUCCESS: 'Update location successfully',
  UPDATE_LOCATION_FAILED: 'Failed to update location',
  DELETE_LOCATION_SUCCESS: 'Delete location successfully',
  DELETE_LOCATION_FAILED: 'Failed to delete location',
  GET_LOCATION_FAILED: 'Failed to get location data',
  GET_REGIONS_ERROR: 'Failed to get regions',

  //distributor
  CREATE_DISTRIBUTOR_SUCCESS: 'Create distributor successfully',
  CREATE_DISTRIBUTOR_ERROR: 'Create distributor error',
  DELETE_DISTRIBUTOR_SUCCESS: 'Delete distributor successfully',
  DELETE_DISTRIBUTOR_ERROR: 'Delete distributor error',
  UPDATE_DISTRIBUTOR_SUCCESS: 'Update distributor successfully',
  UPDATE_DISTRIBUTOR_ERROR: 'Update distributor error',
  GET_ONE_DISTRIBUTOR_ERROR: 'Get one distributor error',

  //brand-profile
  UPDATE_BRAND_PROFILE_SUCCESS: 'Update profile successfully',
  UPDATE_BRAND_PROFILE_ERROR: 'Update profile error',
  UPDATE_LOGO_BRAND_PROFILE_SUCCESS: 'Update logo brand profile successfully',
  UPDATE_LOGO_BRAND_PROFILE_ERROR: 'Update logo brand profile error',

  //FAQ
  GET_FAQ_ERROR: 'Failed to get FAQ data',
  UPDATE_FAQ_SUCCESS: 'Update FAQ successfully',
  UPDATE_FAQ_ERROR: 'Update FAQ error',
  GET_ONE_FAQ_ERROR: 'Get one FAQ error',

  //project_type
  GET_PROJECT_LIST_FAILED: 'Failed to get projects data',
  GET_PROJECT_BUILDING_TYPE_FAILED: 'Failed to get project building types',
  GET_PROJECT_TYPE_FAILED: 'Failed to get project types',
  GET_PROJECT_MEASUREMENT_UNIT_FAILED: 'Failed to get project measurement units',
  CREATE_PROJECT_FAILED: 'Failed to create project',
  CREATE_PROJECT_SUCCESS: 'Create project successfully',
  UPDATE_PROJECT_FAILED: 'Failed to update project',
  UPDATE_PROJECT_SUCCESS: 'Update project successfully',
  DELETE_PROJECT_FAILED: 'Failed to delete project',
  DELETE_PROJECT_SUCCESS: 'Delete project successfully',
  GET_PROJECT_DATA_FAILED: 'Failed to get project data',
  GET_PROJECT_SUMMARY_DATA_FAILED: 'Failed to get project summary data',
};

export const MESSAGE_TOOLTIP = {
  PERSONAL_PROFILE:
    'We value user personal privacy. However, the platform will require individual information for verification purpose from time to time.',
  STATUS_DESING_FIRMS: 'Active: Fully activated. Inactive: Removed & archived',
};

export const EMPTY_DATA_MESSAGE = {
  product: 'No product data yet',
};

export const MESSAGE_ERROR = {
  EMAIL: 'Unknown email',
  PASSWORD: 'Password error',
  CONFIRM_PASSWORD: 'Passwords do not match',
  PHONE_INPUT: 'Invalid phone number',
  POSTAL_CODE: 'You are allowed to enter 10 characters only',
  reachLogoSizeLimit: 'Logo size limit reached (240 KB)',
  reachSizeLimit: 'Image size limit reached (240 KB)',
  WORK_EMAIL: 'Work email is required',
  GENERAL_EMAIL: 'General email is required',
  MESSAGE: 'Message is required',
  EMAIL_INVALID: 'Invalid Email',
  EMAIL_INVALID_INCORRECT: 'Email invalid is not incorrect',
  URL_INVALID: 'Some download urls are not valid',
  AGREE_TISC: 'Click to proceed',
  VERIFY_TOKEN_EXPIRED: 'Verification link has expired',
  PASSWORD_CHARACTER: 'Password must be more than 8 characters',
  FIRST_NAME: 'First name is required',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_ALREADY_USED: 'Email already taken',
  NO_TEAMPROFILE: 'Add member to invite',
  DOCUMENT_TITLE: 'You are allowed to enter 50 characters only',
  DISTRIBUTOR_UNAVAILABLE:
    'The product seems not available for the project location, please verify with the Brand company for more information.',
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
  CONTACT_SUCCESS: 'Contact successfully',
  CONTACT_ERROR: 'Contact error',
  GET_LIST_POLICY: 'Get list policy error',

  // Category
  CREATE_CATEGORY_SUCCESS: 'Create the category successfully',
  CREATE_CATEGORY_ERROR: 'Create the category error',
  DELETE_CATEGORY_SUCCESS: 'Delete the category successfully',
  DELETE_CATEGORY_ERROR: 'Delete the category error',
  UPDATE_CATEGORY_SUCCESS: 'Update the category successfully',
  UPDATE_CATEGORY_ERROR: 'Update the category error',
  GET_LIST_CATEGORY_ERROR: 'Failed to get list category',
  MOVE_CATEGORY_TO_SUB_CATEGORY_SUCCESS: 'Move category successfully',
  MOVE_CATEGORY_TO_SUB_CATEGORY_ERROR: 'Move category unsuccessfully',

  // Inventory
  CREATE_INVENTORY_SUCCESS: 'Create inventory successfully',
  CREATE_INVENTORY_ERROR: 'Create inventory error',
  DELETE_INVENTORY_SUCCESS: 'Delete inventory successfully',
  DELETE_INVENTORY_ERROR: 'Delete inventory error',
  UPDATE_INVENTORY_SUCCESS: 'Update inventory successfully',
  UPDATE_INVENTORY_ERROR: 'Update inventory error',
  GET_INVENTORY_ERROR: 'Get inventory error',
  MOVE_INVENTORY_SUCCESS: 'Move inventory successfully',
  MOVE_INVENTORY_ERROR: 'Move inventory error',

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
  /// share via email
  GET_SHARING_GROUPS_ERROR: 'Failed to get sharing groups',
  GET_SHARING_PURPOSES_ERROR: 'Failed to get sharing purposes',
  CREATE_SHARE_VIA_EMAIL_SUCCESS: 'Shared via email successfully',
  CREATE_SHARE_VIA_EMAIL_ERROR: 'Failed to share via email',
  /// inquiry/request
  GET_INQUIRY_REQUEST_FOR_ERROR: 'Failed to get inquiry/request for list',
  GET_PROJECT_NAME_ERROR: 'Failed to get project name',
  CREATE_GENERAL_INQUIRY_SUCCESS: 'Create general inquiry successfully',
  CREATE_GENERAL_INQUIRY_ERROR: 'Failed to create general inquiry',
  CREATE_PROJECT_REQUEST_SUCCESS: 'Create project request successfully',
  CREATE_PROJECT_REQUEST_ERROR: 'Failed to create project request',

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

  // product dimension weight
  GET_LIST_DIMENSION_WEIGHT_ERROR: 'Get list dimension and weight error',

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
  GET_ONE_CONVERSION_ERROR: 'Get one conversion error',

  // option
  GETLIST_OPTION_ERROR: 'Error when get basis option data',
  CREATE_OPTION_SUCCESS: 'Create option successfully',
  CREATE_OPTION_ERROR: 'Create option error',
  DELETE_OPTION_SUCCESS: 'Delete option successfully',
  DELETE_OPTION_ERROR: 'Delete option error',
  UPDATE_OPTION_SUCCESS: 'Update options successfully',
  UPDATE_OPTION_ERROR: 'Failed to update options',
  GET_ONE_OPTION_ERROR: 'Get one option error',
  GET_LINKAGE_OPTION_ERROR: 'Get linkage option data error',
  CREATE_LINKAGE_OPTION_ERROR: 'Failed to create new linkage',
  CREATE_LINKAGE_OPTION_SUCCESS: 'Created linkage successfully ',
  UPDATE_LINKAGE_OPTION_ERROR: 'Failed to update linkage',
  UPDATE_LINKAGE_OPTION_SUCCESS: 'Updated linkage successfully ',
  CHANGE_ID_TYPE_OPTION_SUCCESS: 'Change the ID type successfully',
  CHANGE_ID_TYPE_OPTION_ERROR: 'Change ID type unsuccessfully',

  //preset
  CREATE_PRESET_SUCCESS: 'Create preset successfully',
  CREATE_PRESET_ERROR: 'Create preset error',
  DELETE_PRESET_SUCCESS: 'Delete preset successfully',
  DELETE_PRESET_ERROR: 'Delete preset error',
  UPDATE_PRESET_SUCCESS: 'Update preset successfully',
  UPDATE_PRESET_ERROR: 'Update preset error',
  GET_ONE_PRESET_ERROR: 'Get one preset error',
  COPY_ONE_PRESET_SUCCESS: 'Copy preset successfully',
  COPY_ONE_PRESET_ERROR: 'Copy preset error',

  /// general inquiry
  GET_GENERAL_INQUIRY_SUMMARY_ERROR: 'Failed to get general inquiry summary',
  GET_GENERAL_INQUIRY_LIST_FAILED: 'Failed to get general inquiry data',

  // actions/tasks
  GET_ACTION_TASK_DATA_ERROR: 'Failed to get action task data',
  GET_ACTION_TASK_LIST_ERROR: 'Failed to get action task list',
  CREATE_ACTION_TASK_SUCCESS: 'Create action task successfully',
  CREATE_ACTION_TASK_ERROR: 'Failed to create action task',
  UPDATE_ACTION_TASK_STATUS_ERROR: 'Failed to update action task status',

  // department
  GET_LIST_DEPARTMENT_ERROR: 'Get list department error',

  // partner
  GET_LIST_COMMON_PARTNER_TYPE_ERROR: 'Get list common partner type error',
  GET_PARTNER_ERROR: 'Get partner error',

  /// user group
  // brand
  GET_LIST_BRAND_SUMMARY_ERROR: 'Get list brand summary error',
  GET_LIST_ASSIGN_TEAM_ERROR: 'Get list assign team error',
  GET_BRAND_STATUSES_ERROR: 'Get brand statuses error',
  UPDATE_LIST_ASSIGN_TEAM_ERROR: 'Update list assign team error',
  UPDATE_LIST_ASSIGN_TEAM_SUCCESS: 'Update list assign team successfully',
  UPDATE_BRAND_STATUS_SUCCESS: 'Update brand status successfully',
  UPDATE_BRAND_STATUS_ERROR: 'Update brand status error',
  COPY_TO_BRAND_SUCCESS: 'Copy to brand successfully',
  COPY_TO_BRAND_ERROR: 'Failed to copy to brand',

  //user-group / design firms
  GET_ONE_DESIGN_FIRM_ERROR: 'Failed to get one design firm',
  GET_SUMMARY: 'Failed to get summary',
  GET_LOCATIONS_BY_DESIGN_FIRM: 'Failed to get locations by design firm',
  GET_TEAMS_BY_DESIGN_FIRM: 'Failed to get teams by design firm',
  GET_PROJECTS_BY_DESIGN_FIRM: 'Failed to get projects by design firm',
  GET_MATERIAL_CODE_BY_DESIGN_FIRM: 'Failed to get material code by design firm',
  GET_DESIGN_STATUSES_ERROR: 'Failed to get statuses',
  UPDATE_STATUS_DESIGN_FIRM_SUCCESS: 'Update design firm status successfully',
  UPDATE_STATUS_DESIGN_FIRM_ERROR: 'Update design firm status error',

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
  CREATE_BRAND_COLLECTION_SUCCESS: 'Create new Brand collection successfully',
  CREATE_BRAND_COLLECTION_ERROR: 'Failed to create Brand collection',
  UPDATE_BRAND_COLLECTION_SUCCESS: 'Update Brand collection successfully',
  UPDATE_BRAND_COLLECTION_ERROR: 'Failed to update Brand collection',
  GET_BRAND_COLLECTION_ERROR: 'Failed to get Brand collection data',
  DELETE_BRAND_COLLECTION_SUCCESS: 'Delete collection successfully',
  DELETE_BRAND_COLLECTION_ERROR: 'Failed to delete collection',
  CREATE_LABEL_SUCCESS: 'Create new label successfully',
  CREATE_LABEL_ERROR: 'Failed to create label',
  UPDATE_LABEL_SUCCESS: 'Update label successfully',
  UPDATE_LABEL_ERROR: 'Failed to update label',
  GET_LABEL_ERROR: 'Failed to get label data',
  DELETE_LABEL_SUCCESS: 'Delete label successfully',
  DELETE_LABEL_ERROR: 'Failed to delete label',
  MOVE_SUB_LABEL_TO_LABEL_SUCCESS: 'Move sub-label to another label successfully',
  MOVE_SUB_LABEL_TO_LABEL_ERROR: 'Move sub-label to another label unsuccessfully',
  // market availability
  GET_LIST_MARKET_AVAILABILITY_ERROR: 'Get list market availability error',
  GET_LIST_AVAILABILITY_GROUP_COLLECTION_ERROR: 'Get list group availability collection error',
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
  GET_LOCATION_DISTRIBUTOR_ERROR: 'Failed to get distributor location',
  GET_LOCATION_BRAND_ERROR: 'Failed to get brand location',

  //distributor
  CREATE_DISTRIBUTOR_SUCCESS: 'Create distributor successfully',
  CREATE_DISTRIBUTOR_ERROR: 'Create distributor error',
  DELETE_DISTRIBUTOR_SUCCESS: 'Delete distributor successfully',
  DELETE_DISTRIBUTOR_ERROR: 'Delete distributor error',
  UPDATE_DISTRIBUTOR_SUCCESS: 'Update distributor successfully',
  UPDATE_DISTRIBUTOR_ERROR: 'Update distributor error',
  GET_ONE_DISTRIBUTOR_ERROR: 'Get one distributor error',
  GET_LIST_DISTRIBUTOR_GROUP_COUNTRY_ERROR: 'Get list group distributor country error',

  //brand-profile // office profile
  GET_PROFILE_ERROR: 'Get profile error',
  UPDATE_PROFILE_SUCCESS: 'Update profile successfully',
  UPDATE_PROFILE_ERROR: 'Update profile error',
  UPDATE_LOGO_PROFILE_SUCCESS: 'Update logo profile successfully',
  UPDATE_LOGO_PROFILE_ERROR: 'Update logo profile error',

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

  GET_PROJECT_SPACE_DATA_FAILED: 'Failed to get project space data',
  CREATE_PROJECT_SPACE_FAILED: 'Failed to create project space',
  CREATE_PROJECT_SPACE_SUCCESS: 'Create project space successfully',
  UPDATE_PROJECT_SPACE_FAILED: 'Failed to update project space',
  UPDATE_PROJECT_SPACE_SUCCESS: 'Update project space successfully',
  DELETE_PROJECT_SPACE_FAILED: 'Failed to delete project space',
  DELETE_PROJECT_SPACE_SUCCESS: 'Delete project space successfully',

  // favourite
  GET_FAVOURITE_PRODUCT_SUMMARY_ERROR: 'Get product summary error',
  GET_FAVOURITE_BRAND_PRODUCT_LIST_ERROR: 'Get favourite brand product error',
  GET_FAVOURITE_CATEGORY_PRODUCT_SUMMARY_ERROR: 'Get favourite category product error',
  CREATE_FAVOURITE_RETRIEVE_SUCCESS: 'Now you can have your own favourite product',
  CREATE_FAVOURITE_RETRIEVE_ERROR: 'Failed to create your favourite product',
  RETRIEVE_FAVOURITE_PRODUCT_SUCCESS: 'Retrieve favourite product successfully',
  RETRIEVE_FAVOURITE_PRODUCT_ERROR: 'Retrieve favourite product error',
  SKIP_FAVOURITE_SUCCESS: 'Skipped Successfully',
  SKIP_FAVOURITE_ERROR: 'Failed to skip',

  //material/product code
  CREATE_MATERIAL_PRODUCT_CODE_SUCCESS: 'Create material product code successfully',
  CREATE_MATERIAL_PRODUCT_CODE_ERROR: 'Create material product code error',
  GET_ONE_MATERIAL_PRODUCT_CODE_ERROR: 'Get one material product code error',
  DELETE_MATERIAL_PRODUCT_CODE_SUCCESS: 'Delete material product code successfully',
  DELETE_MATERIAL_PRODUCT_CODE_ERROR: 'Delete material product code error',
  UPDATE_MATERIAL_PRODUCT_CODE_SUCCESS: 'Update material product code successfully',
  UPDATE_MATERIAL_PRODUCT_CODE_ERROR: 'Update material product code error',

  //project tracking
  GET_PROJECT_TRACKING_LIST_FAILED: 'Failed to get project tracking data',
  UPDATE_PROJECT_TRACKING_INFO_SUCCESS: 'Update project tracking information successfully',
  UPDATE_PROJECT_TRACKING_INFO_ERROR: 'Update project tracking info error',
  GET_PROJECT_TRACKING_SUMMARY_ERROR: 'Get project tracking summary error',
  GET_ONE_PROJECT_TRACKING_ERROR: 'Get one project tracking error',

  //project listing
  GET_PROJECT_LISTING_FAILED: 'Failed to get project listing data',
  GET_PROJECT_LISTING_SUMMARY_ERROR: 'Get project listing summary error',
  GET_ONE_PROJECT_LISTING_ERROR: 'Get one project listing error',

  // custom product
  GET_LIST_CUSTOM_PRODUCT_LIST_ERROR: 'Failed to get product list',
  GET_ONE_CUSTOM_PRODUCT_LIST_ERROR: 'Failed to get product',
  CREATE_CUSTOM_PRODUCT_SUCCESS: 'Create product successfully',
  CREATE_CUSTOM_PRODUCT_ERROR: 'Failed to create product',
  UPDATE_CUSTOM_PRODUCT_SUCCESS: 'Update product successfully',
  UPDATE_CUSTOM_PRODUCT_ERROR: 'Failed to update product',
  DELETE_CUSTOM_PRODUCT_SUCCESS: 'Delete product successfully',
  DELETE_CUSTOM_PRODUCT_ERROR: 'Failed to delete product',
  DUPLICATE_CUSTOM_PRODUCT_SUCCESS: 'Duplicate product successfully',
  DUPLICATE_CUSTOM_PRODUCT_ERROR: 'Failed to duplicate product',
  GET_LIST_VENDOR: 'Failed to get list vendor by brand or distributor',
  CREATE_CUSTOM_RESOURCE_SUCCESS: 'Create vendor information successfully',
  UPDATE_CUSTOM_RESOURCE_SUCCESS: 'Update vendor information successfully',
  DELETE_CUSTOM_RESOURCE_SUCCESS: 'Delete vendor information successfully',

  //service
  CREATE_SERVICE_SUCCESS: 'Create service successfully',
  UPDATE_SERVICE_SUCCESS: 'Update service successfully',
  SENT_BILL_SUCCESS: 'Sent bill to brand successfully',
  SENT_REMIND_SUCCESS: 'Sent reminder to brand successfully',
  MARK_AS_PAID_SUCCESS: 'Mark as paid successfully',
  DELETE_SERVICE_SUCCESS: 'Delete service successfully',

  /// billed services // payment intent
  CREATE_PAYMENT_INTENT_SUCCESS: 'Create payment intent successfully',
  CREATE_PAYMENT_INTENT_ERROR: 'Failed to create payment intent',
  UPDATE_PAID_TEMPRORARILY_ERROR: 'Failure to temporarily update paid for payment intent',

  //schedule booking
  CREATE_BOOKING_SUCCESS: 'Book a demo successfully',
  CANCEL_BOOKING_SUCCESS: 'Cancel booking successfully',
  UPDATE_BOOKING_SUCCESS: 'Update booking successfully',

  // partner
  CREATE_PARTNER_COMPANY_SUCCESS: 'Create partner company successfully',
  CREATE_PARTNER_COMPANY_ERROR: 'Create partner company unsuccessfully',
  UPDATE_PARTNER_COMPANY_SUCCESS: 'Update partner company successfully',
  UPDATE_PARTNER_COMPANY_ERROR: 'Update partner company unsuccessfully',
  DELETE_PARTNER_COMPANY_SUCCESS: 'Delete partner company successfully',
  DELETE_PARTNER_COMPANY_ERROR: 'Delete partner company unsuccessfully',
  CREATE_PARTNER_CONTACT_SUCCESS: 'Create partner contact successfully',
  CREATE_PARTNER_CONTACT_ERROR: 'Create partner contact unsuccessfully',
  UPDATE_PARTNER_CONTACT_SUCCESS: 'Update partner contact successfully',
  UPDATE_PARTNER_CONTACT_ERROR: 'Update partner contact unsuccessfully',
  DELETE_PARTNER_CONTACT_SUCCESS: 'Delete partner contact successfully',
  DELETE_PARTNER_CONTACT_ERROR: 'Delete partner contact unsuccessfully',

  // warehouse
  CREATE_WAREHOUSE_SUCCESS: 'Create warehouse successfully',
  CREATE_WAREHOUSE_ERROR: 'Create warehouse unsuccessfully',
  UPDATE_WAREHOUSE_SUCCESS: 'Update warehouse successfully',
  UPDATE_WAREHOUSE_ERROR: 'Update warehouse unsuccessfully',
  DELETE_WAREHOUSE_SUCCESS: 'Delete warehouse successfully',
  DELETE_WAREHOUSE_ERROR: 'Delete warehouse unsuccessfully',

  // company
  GET_COMPANY_SUMMARY_ERROR: 'Get company unsuccessfully',
};

export const MESSAGE_TOOLTIP = {
  PERSONAL_PROFILE:
    'We value user personal privacy. However, the platform will require individual information for verification purpose from time to time.',
};

export const EMPTY_DATA_MESSAGE = {
  product: 'No product data yet',
};

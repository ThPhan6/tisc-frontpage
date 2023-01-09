/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  const isBrand = currentUser?.type === 2;
  const isTisc = currentUser?.type === 1;
  const isDesigner = currentUser?.type === 3;
  const permissions = currentUser?.permissions.data;

  const getAccessable = (name: string, subname?: string) => {
    const found = permissions.find((item: any) => item.name.toLowerCase().includes(name));
    if (found) {
      if (subname) {
        const foundsub = found.subs.find((sub: any) => sub.name.toLowerCase().includes(subname));
        if (foundsub) {
          return foundsub.items[0].accessable;
        }
      }
      return found.items[0].accessable;
    }
    return false;
  };

  const isAccessableForTisc = (name: string, subname?: string) =>
    isTisc && getAccessable(name, subname);

  const isAccessableForDesigner = (name: string, subname?: string) =>
    isDesigner && getAccessable(name, subname);

  const isAccessableForBrand = (name: string, subname?: string) =>
    isBrand && getAccessable(name, subname);

  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    tisc_workspace: isAccessableForTisc('workspace'),
    tisc_user_group: isAccessableForTisc('user'),
    tisc_user_group_brand: isAccessableForTisc('user', 'brand'),
    tisc_user_group_design: isAccessableForTisc('user', 'design'),
    tisc_project: isAccessableForTisc('project'),
    tisc_project_list: isAccessableForTisc('project', 'list'),
    tisc_product: isAccessableForTisc('product'),
    tisc_product_category: isAccessableForTisc('product', 'categories'),
    tisc_product_basis: isAccessableForTisc('product', 'basis'),
    tisc_product_attribute: isAccessableForTisc('product', 'attribute'),
    tisc_product_configuration: isAccessableForTisc('product', 'configuration'),
    tisc_administration: isAccessableForTisc('administration'),
    tisc_administration_documentation: isAccessableForTisc('administration', 'documentation'),
    tisc_administration_location: isAccessableForTisc('administration', 'location'),
    tisc_administration_team_profile: isAccessableForTisc('administration', 'team profile'),
    tisc_administration_message: isAccessableForTisc('administration', 'message'),
    tisc_administration_revenue: isAccessableForTisc('administration', 'revenue'),

    brand_workspace: isAccessableForBrand('workspace'),
    brand_product: isAccessableForBrand('product'),
    brand_genenral_inquiry: isAccessableForBrand('general'),
    brand_project_tracking: isAccessableForBrand('project tracking'),
    brand_administration: isAccessableForBrand('administration'),
    brand_administration_brand_profile: isAccessableForBrand('administration', 'brand profile'),
    brand_administration_location: isAccessableForBrand('administration', 'location'),
    brand_administration_team_profile: isAccessableForBrand('administration', 'team profile'),
    brand_administration_distributor: isAccessableForBrand('administration', 'distributor'),
    brand_administration_market_availability: isAccessableForBrand(
      'administration',
      'market availability',
    ),
    brand_administration_billed_services: isAccessableForBrand('administration', 'billed services'),

    design_workspace: isAccessableForDesigner('workspace'),
    design_my_favourite: isAccessableForDesigner('favourite'),
    design_product: isAccessableForDesigner('product'),
    design_product_brand_product: isAccessableForDesigner('product', 'brand product'),
    design_product_custom_library: isAccessableForDesigner('product', 'custom library'),
    // for access to project
    design_project_overal_listing: isAccessableForDesigner('project', 'overall listing'),

    design_project_updating:
      isAccessableForDesigner('project', 'basic information') ||
      isAccessableForDesigner('project', 'zone/area/room') ||
      isAccessableForDesigner('project', 'product considered') ||
      isAccessableForDesigner('project', 'product specified'),
    // project tabs
    design_project_basic_information: isAccessableForDesigner('project', 'basic information'),
    design_project_zone_area_zoom: isAccessableForDesigner('project', 'zone/area/room'),
    design_project_product_considered: isAccessableForDesigner('project', 'product considered'),
    design_project_product_specified: isAccessableForDesigner('project', 'product specified'),
    ///
    design_administration: isAccessableForDesigner('administration'),
    design_administration_office_profile: isAccessableForDesigner(
      'administration',
      'office profile',
    ),
    design_administration_location: isAccessableForDesigner('administration', 'location'),
    design_administration_team_profile: isAccessableForDesigner('administration', 'team profile'),
    design_administration_material_product_code: isAccessableForDesigner(
      'administration',
      'material/product code',
    ),
  };
}

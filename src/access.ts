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
          return foundsub.accessable;
        }
      }
      return found.accessable;
    }
    return false;
  };
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    tisc_workspace: isTisc && getAccessable('workspace'),
    tisc_user_group: isTisc && getAccessable('user'),
    tisc_user_group_brand: isTisc && getAccessable('user', 'brand'),
    tisc_user_group_design: isTisc && getAccessable('user', 'design'),
    tisc_project: isTisc && getAccessable('project'),
    tisc_project_list: isTisc && getAccessable('project', 'list'),
    tisc_product: isTisc && getAccessable('product'),
    tisc_product_category: isTisc && getAccessable('product', 'category'),
    tisc_product_basis: isTisc && getAccessable('product', 'basis'),
    tisc_product_attribute: isTisc && getAccessable('product', 'attribute'),
    tisc_product_configuration: isTisc && getAccessable('product', 'configuration'),
    tisc_administration: isTisc && getAccessable('administration'),
    tisc_administration_documentation: isTisc && getAccessable('administration', 'documentation'),
    tisc_administration_location: isTisc && getAccessable('administration', 'location'),
    tisc_administration_team_profile: isTisc && getAccessable('administration', 'team profile'),
    tisc_administration_message: isTisc && getAccessable('administration', 'message'),
    tisc_administration_revenue: isTisc && getAccessable('administration', 'revenue'),

    brand_workspace: isBrand && getAccessable('workspace'),
    brand_product: isBrand && getAccessable('product'),
    brand_genenral_inquiry: isBrand && getAccessable('general'),
    brand_project_tracking: isBrand && getAccessable('project tracking'),
    brand_administration: isBrand && getAccessable('administration'),
    brand_administration_brand_profile: isBrand && getAccessable('administration', 'brand profile'),
    brand_administration_location: isBrand && getAccessable('administration', 'location'),
    brand_administration_team_profile: isBrand && getAccessable('administration', 'team profile'),
    brand_administration_distributor: isBrand && getAccessable('administration', 'distributor'),
    brand_administration_market_availability:
      isBrand && getAccessable('administration', 'market availability'),
    brand_administration_subscription: isBrand && getAccessable('administration', 'subscription'),

    designer_workspace: isDesigner && getAccessable('workspace'),
    designer_my_favourite: isDesigner && getAccessable('favourite'),
    designer_product: isDesigner && getAccessable('product'),
    designer_product_brand_product: isDesigner && getAccessable('product', 'brand product'),
    designer_product_custom_library: isDesigner && getAccessable('product', 'custom library'),
    designer_project: isDesigner && getAccessable('project'),
    designer_administration: isDesigner && getAccessable('administration'),
    designer_administration_office_profile:
      isDesigner && getAccessable('administration', 'office profile'),
    designer_administration_location: isDesigner && getAccessable('administration', 'location'),
    designer_administration_team_profile:
      isDesigner && getAccessable('administration', 'team profile'),
    designer_administration_material_product_code:
      isDesigner && getAccessable('administration', 'material/product code'),
  };
}

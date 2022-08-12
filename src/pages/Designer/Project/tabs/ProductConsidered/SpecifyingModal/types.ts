import { SpecificationAttributeGroup } from '@/types';

export type SpecifyingProductRequestBody = {
  considered_product_id: String;
  specification: {
    is_refer_document: boolean;
    specification_attribute_groups: SpecificationAttributeGroup[];
  };
  brand_location_id: String;
  distributor_location_id: String;
  is_entire: boolean;
  project_zone_ids: String[];
  material_code_id: String;
  suffix_code: String;
  description: String;
  quantity: number;
  unit_type_id: String;
  order_method: number;
  requirement_type_ids: String[];
  instruction_type_ids: String[];
};

export type OnChangeSpecifyingProductFnc = (
  newStateParts: Partial<SpecifyingProductRequestBody>,
) => void;

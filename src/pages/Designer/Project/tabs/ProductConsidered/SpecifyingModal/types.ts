import { SpecificationAttributeGroup } from '@/features/project/types';

export type CodeOrderRequestParams = {
  material_code_id: string;
  suffix_code: string;
  description: string;
  quantity: number;
  unit_type_id: string;
  order_method: number;
  requirement_type_ids: string[];
  instruction_type_ids: string[];
  finish_schedules: string[];
  special_instructions: string;
};

export type SpecifyingProductRequestBody = {
  considered_product_id: string;
  specification: {
    is_refer_document: boolean;
    attribute_groups: SpecificationAttributeGroup[];
  };
  brand_location_id: string;
  distributor_location_id: string;
  entire_allocation: boolean;
  allocation: string[];
} & CodeOrderRequestParams;

export type OnChangeSpecifyingProductFnc = (
  newStateParts: Partial<SpecifyingProductRequestBody>,
) => void;

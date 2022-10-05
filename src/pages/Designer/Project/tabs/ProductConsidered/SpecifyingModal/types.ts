import { ORDER_METHOD } from '@/constants/util';

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
    specification_attribute_groups: SpecificationAttributeGroup[];
  };
  brand_location_id: string;
  distributor_location_id: string;
  entire_allocation: boolean;
  allocation: string[];
} & CodeOrderRequestParams;

export type OnChangeSpecifyingProductFnc = (
  newStateParts: Partial<SpecifyingProductRequestBody>,
) => void;

export const DEFAULT_STATE: SpecifyingProductRequestBody = {
  considered_product_id: '',
  specification: {
    is_refer_document: true,
    specification_attribute_groups: [],
  },
  brand_location_id: '',
  distributor_location_id: '',
  entire_allocation: true,
  allocation: [],
  material_code_id: '',
  suffix_code: '',
  description: '',
  quantity: 0,
  unit_type_id: '',
  order_method: ORDER_METHOD['directPurchase'],
  requirement_type_ids: [],
  instruction_type_ids: [],
  finish_schedules: [],
  special_instructions: '',
};

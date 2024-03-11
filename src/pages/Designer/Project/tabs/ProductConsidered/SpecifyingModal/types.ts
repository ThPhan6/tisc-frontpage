import { SpecificationAttributeGroup } from '@/features/project/types';

export interface FinishScheduleRequestBody {
  floor: boolean;
  base: {
    ceiling: boolean;
    floor: boolean;
  };
  front_wall: boolean;
  left_wall: boolean;
  back_wall: boolean;
  right_wall: boolean;
  ceiling: boolean;
  door: {
    frame: boolean;
    panel: boolean;
  };
  cabinet: {
    carcass: boolean;
    door: boolean;
  };
}

export interface FinishScheduleResponse extends FinishScheduleRequestBody {
  id: string;
  project_product_id: string;
  room_id: string;
  room_id_text: string;
  room_name: string;
}

export type CodeOrderRequestParams = {
  material_code_id: string;
  suffix_code: string;
  description: string;
  quantity: number;
  unit_type_id: string;
  order_method: number;
  requirement_type_ids: string[];
  instruction_type_ids: string[];
  finish_schedules: FinishScheduleRequestBody[];
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
  custom_product?: boolean;
  is_done_assistance_request?: boolean;
} & CodeOrderRequestParams;

export type OnChangeSpecifyingProductFnc = (
  newStateParts: Partial<SpecifyingProductRequestBody>,
) => void;

export interface OptionReplicateRequest {
  id?: string;
  replicate: number;
  pre_option?: string;
  picked?: boolean;
}

export interface AutoStepOnAttributeGroupRequest {
  name: string;
  order: number;
  options: OptionReplicateRequest[];
}

export interface OptionReplicateResponse {
  id: string;
  replicate: number;
  pre_option?: string;
  pre_option_id?: string;
  pre_option_name?: string;
  picked?: boolean;
  value_1: string;
  value_2?: string;
  unit_1?: string;
  unit_2?: string;
  image?: string;
  product_id: string;
  sub_id: string;
  sub_name: string;
  // order?: number;
}

export interface AutoStepOnAttributeGroupResponse {
  id?: string;
  specification_id?: string;
  product_id?: string;
  name: string;
  order: number;
  options: OptionReplicateResponse[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

/// linked option repsonse
export interface LinkedSubOptionProps {
  id: string;
  product_id: string;
  replicate: number;
  image?: string;
  value_1: string;
  value_2?: string;
  unit_1?: string;
  unit_2?: string;
  pre_option?: string;
}

export interface LinkedOptionProps {
  id: string;
  name: string;
  subs: OptionReplicateResponse[];
}

export interface AutoStepLinkedOptionResponse {
  id: string;
  name: string;
  subs: LinkedOptionProps[];
}
///

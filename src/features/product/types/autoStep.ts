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

/// pre-select auto-step interface
export interface OptionQuantityProps {
  id: string;
  quantity: number;
  replicate: number;
  pre_option?: string;
  pre_option_name?: string;
  picked?: boolean;
  yours: number; /// FE
  value_1: string;
  value_2?: string;
  unit_1?: string;
  unit_2?: string;
  image?: string;
  product_id: string;
  sub_id: string;
  sub_name: string;
}

export interface AutoStepPreSelectOptionProps {
  id: string;
  name: string;
  subs: OptionQuantityProps[];
}

export interface AutoStepPreSelectLinkedOptionResponse {
  id: string;
  name: string;
  subs: AutoStepPreSelectOptionProps[];
}

export interface OptionQuantityResponse {
  id: string;
  pre_option: string;
  quantity: number;
}

export interface AutoStepPreSelectOnAttributeGroupResponse {
  id?: string;
  specification_id?: string;
  product_id?: string;
  name: string;
  order: number;
  options: OptionQuantityProps[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AutoStepPreSelectOptionResponse {
  id: string;
  step_id: string;
  product_id: string;
  project_id: string;
  user_id: string;
  options: OptionQuantityResponse[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AutoStepPreSelectOptionProps {
  step_id: string;
  options: OptionQuantityResponse[];
}

export interface AutoStepPreSelectDataRequest {
  project_id: string;
  product_id: string;
  user_id: string;
  data: AutoStepPreSelectOptionProps[];
}

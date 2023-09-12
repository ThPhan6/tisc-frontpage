export interface OptionReplicate {
  id: string;
  replicate: number;
  pre_option?: string;
}

export interface AutoStepOnAttributeGroupResponse {
  id: string;
  specification_id: string;
  product_id: string;
  name: string;
  order: number;
  options: OptionReplicate[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AutoStepOnAttributeGroupBody {
  name: string;
  order: number;
  options: OptionReplicate[];
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
}

export interface LinkedOptionProps {
  id: string;
  name: string;
  subs: LinkedSubOptionProps[];
}

export interface AutoStepLinkedOptionResponse {
  id: string;
  name: string;
  subs: LinkedOptionProps[];
}
///

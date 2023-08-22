export interface SubBasisOption {
  id: string;
  image?: string;
  option_code?: string;
  value_1: string;
  value_2: string;
  unit_1: string;
  unit_2: string;
  isBase64?: boolean;
  product_id: string;
  paired: number;
}
export interface BasisOptionListResponse {
  id: string;
  name: string;
  master: boolean;
  count: number;
  subs: {
    id: string;
    name: string;
    count: number;
    subs: SubBasisOption[];
  }[];
  created_at: string;
}

export interface BasisOptionSubForm {
  id: string;
  name: string;
  collapse?: string | string[];
  subs: SubBasisOption[];
  count?: number;
  main_id: string;
}

export interface MainBasisOptionSubForm {
  id: string;
  name: string;
  collapse?: string;
  subs: BasisOptionSubForm[];
  count: number;
}

export interface BasisOptionForm {
  id: string;
  name: string;
  count: number;
  subs: BasisOptionSubForm[];
}

export interface ConnectionListResponse {
  from: string;
  from_product_id: string;
  to: string;
  to_product_id: string;
  is_pair: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface LinkageUpsertBody {
  pair: string;
  is_pair: boolean;
}

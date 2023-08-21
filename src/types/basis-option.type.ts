export interface SubBasisOption {
  id?: string;
  image?: string;
  option_code?: string;
  value_1: string;
  value_2: string;
  unit_1: string;
  unit_2: string;
  isBase64?: boolean;
  product_id: string;
  paired: number;
  // count: number;
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
  id?: string;
  name: string;
  is_collapse?: string;
  subs: SubBasisOption[];
}

export interface MainBasisOptionSubForm {
  id?: string;
  name: string;
  is_collapse?: string;
  subs: BasisOptionSubForm[];
}

export interface BasisOptionForm {
  id?: string;
  name: string;
  subs: BasisOptionSubForm[];
}

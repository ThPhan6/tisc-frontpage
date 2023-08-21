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
  count: number;
  select?: boolean; // UI
  disabled?: boolean; // UI //?! delete? this attribute, use select! to set instead
  main_id?: string; // UI
  sub_id?: string; // UI
  paired?: boolean; // UI
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
  is_collapse?: string | string[];
  subs: SubBasisOption[];
  count?: number;
  main_id: string;
  select?: boolean; // UI
  disabled?: boolean; // UI
}

export interface MainBasisOptionSubForm {
  id?: string;
  name: string;
  is_collapse?: string;
  subs: BasisOptionSubForm[];
}

export interface BasisOptionForm {
  id: string;
  name: string;
  select?: boolean; // UI
  disabled?: boolean; // UI
  count: number;
  subs: BasisOptionSubForm[];
}

export interface DatasetLinkagePreSelectSummaryProps {
  'Main Options': number;
  'Sub Options': number;
  Products: number;
}

export interface DatasetLinkageSelectSummaryProps {
  Dataset: number;
  Products: number;
  'Connection Pairs': number;
}

export type ConnectionListStatus = 'inactive' | 'paired' | 'unpaired';
export interface ConnectionListResponse {
  from: string;
  from_product_id: string;
  to: string;
  to_product_id: string;
  is_pair: boolean;
  pair_status?: ConnectionListStatus; /// UI
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface LinkageUpsertBody {
  pair: string;
  is_pair: boolean;
}

export interface LinkageUpdateBody {
  pair: string;
  is_pair: boolean;
}

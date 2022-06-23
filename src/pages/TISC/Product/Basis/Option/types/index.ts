export interface ISubBasisOption {
  id?: string;
  image?: string;
  value_1: string;
  value_2: string;
  unit_1: string;
  unit_2: string;
  isBase64?: boolean;
}
export interface IBasisOptionListResponse {
  id: string;
  name: string;
  count: number;
  subs: {
    id: string;
    name: string;
    count: number;
    subs: ISubBasisOption[];
  }[];
  created_at: string;
}

export interface IBasisOptionSubForm {
  id?: string;
  name: string;
  isUsingImage?: boolean;
  subs: ISubBasisOption[];
}

export interface IBasisOptionForm {
  id?: string;
  name: string;
  subs: IBasisOptionSubForm[];
}

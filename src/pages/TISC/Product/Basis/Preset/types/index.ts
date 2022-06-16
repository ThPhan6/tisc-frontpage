export interface ISubBasisPreset {
  id: string;
  value_1: string;
  value_2: string;
  unit_1: string;
  unit_2: string;
}
export interface IBasisPresetListResponse {
  id: string;
  name: string;
  count: number;
  subs: {
    id: string;
    name: string;
    count: number;
    subs: ISubBasisPreset[];
  }[];
  created_at: string;
}

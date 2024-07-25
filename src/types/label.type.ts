export type Label = {
  id: string;
  name: string;
  brand_id: string;
  created_at: string;
};

export type LabelInput = {
  name: string;
  brand_id: string;
};

export interface SubLabel {
  id: string;
  name: string;
  parent_id: string;
}

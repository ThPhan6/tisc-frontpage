export enum CollectionRelation {
  Brand,
  CustomLibrary,
}

export type CollectionRelationType = 0 | 1;

export interface Collection {
  id: string;
  relation_id: string;
  relation_type: CollectionRelationType;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CollectionAddPayload
  extends Pick<Collection, 'relation_id' | 'relation_type' | 'name'> {}

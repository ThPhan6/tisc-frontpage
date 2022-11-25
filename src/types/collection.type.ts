export enum CollectionRelationType {
  Brand,
  CustomLibrary,
}

export interface Collection {
  id: string;
  relation_id: string;
  relation_type: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CollectionAddPayload
  extends Pick<Collection, 'relation_id' | 'relation_type' | 'name'> {}

export interface CategoryEntity {
  id: string;
  name: string;
  parent_id: string | null;
  level: number;
  type: CategoryTypeEnum;
}

export enum CategoryTypeEnum {
  Inventory,
}

import { IGeneralData } from '@/types';

export interface IProductSummary {
  categories: IGeneralData[];
  collections: IGeneralData[];
  category_count: number;
  collection_count: number;
  card_count: number;
  product_count: number;
}

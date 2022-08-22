import { ProductItemValue } from '@/features/product/types';

export interface FavouriteProductSummary {
  categories: ProductItemValue[];
  brands: ProductItemValue[];
  category_count: number;
  brand_count: number;
  card_count: number;
}

export interface FavouriteRetrieve {
  personal_email: string;
  mobile: string;
  phone_code: string;
}

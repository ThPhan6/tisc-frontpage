export interface IBrandAlphabetItem {
  id: string;
  logo: string;
  name: string;
}
export interface IBrandAlphabet {
  [key: string]: IBrandAlphabetItem[];
}

export interface IGeneralData {
  id: string;
  name: string;
}

export interface IProductSummary {
  categories: IGeneralData[];
  collections: IGeneralData[];
  category_count: number;
  collection_count: number;
  card_count: number;
  product_count: number;
}

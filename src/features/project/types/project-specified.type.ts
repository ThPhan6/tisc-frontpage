interface SpecifiedProductResponse {
  id: string;
  name: string;
  count: number;
}

// View By Brand Table
export interface ProductItemBrand {
  id: string;
  name: string;
  collection_name: string;
  variant: string;
  product_id: string;
  image: string;
  status: number;
}

export interface SpecifiedProductByBrand extends SpecifiedProductResponse {
  products: ProductItemBrand[];
}

// View By Space Table
export interface SpecifiedProductArea {
  id?: string;
  name: string;
  rooms: SpecifiedProductRoom[];
}
export interface SpecifiedProductRoom {
  id: string;
  count: number;
  room_name: string;
  room_id: string;
  room_size: number;
  quantity: number;
  products: ProductItemSpace[];
}
export interface ProductItemSpace {
  id: string;
  image: string;
  brand_name: string;
  product_id: string;
  material_code: string;
  description: string;
  status: number;
}
export interface SpecifiedProductBySpace extends SpecifiedProductResponse {
  products: ProductItemSpace[];
  area?: SpecifiedProductArea[];
}

// View By Material Table
export interface SpecifiedProductByMaterial {
  id: string;
  material_code: string;
  description: string;
  image: string;
  brand_name: string;
  product_name: string;
  quantity: number;
  unit: string;
  order_method: number;
  status: number;
}

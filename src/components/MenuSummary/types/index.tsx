export interface MenuSummaryProps {
  containerClass?: string;
  typeMenu: 'brand' | 'subscription' | 'project';
  menuSummaryData: DataBrandProp[];
  height?: string;
  typeMenuData?: BrandsProps[];
}

export interface ElementSummaryProps {
  dataBrands: DataBrandProp;
  activeId: string;
  handleActiveTab: (id: string) => void;
}

export interface DataBrandProp extends BrandsProps {
  brands: BrandsProps[];
}

export interface ItemSummaryProps {
  brand: BrandsProps;
}

export interface BrandsProps {
  id: string;
  quantity: number | string;
  label: string;
}

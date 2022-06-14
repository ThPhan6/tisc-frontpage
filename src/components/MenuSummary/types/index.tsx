export interface MenuSummaryProps {
  containerClass?: string;
  dataBrands: ElementSummaryProps['data'][];
  height?: string;
}

export interface BrandsProps {
  id: string;
  quantity: number;
  brandName: string;
}

export interface ElementSummaryProps {
  data: {
    id: string;
    quantity: number;
    brandName: string;
    brands: BrandsProps[];
  };
  activeId: string;
  handleActiveTab: (id: string) => void;
}

export interface ItemSummaryProps {
  brand: BrandsProps;
}

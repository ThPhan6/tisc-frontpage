export interface BrandsProps {
  id: string;
  quantity: number;
  brandName: string;
}

export interface MenuSummaryProps {
  containerClass?: string;
  dataBrands: ElementSummaryProps['dataBrands'][];
  typeMenu: 'brand' | 'subscription' | 'project' | 'services';
  height?: string;
}

export interface DataSubscriptionProps extends BrandsProps {
  dataProduct: {};
}

export interface ElementSummaryProps {
  dataBrands: {
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

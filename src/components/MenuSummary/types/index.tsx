export interface BrandsProps {
  id: string;
  quantity: number;
  brandName: string;
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

export interface MenuSummaryProps {
  containerClass?: string;
  dataBrands: ElementSummaryProps['dataBrands'][] | DataSubscriptionProps | DataProjectProps;
  typeMenu: 'brand' | 'subscription' | 'project' | 'services';
  height?: string;
}

export interface DataSubscriptionProps {
  dataSubscription: [ElementSummaryProps['dataBrands'][], BrandsProps[]];
}

export interface DataProjectProps {
  dataProduct: [ElementSummaryProps['dataBrands'][], BrandsProps[]];
}

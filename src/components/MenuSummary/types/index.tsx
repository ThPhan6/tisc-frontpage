export interface MenuSummaryProps {
  containerClass?: string;
}

export interface ElementSummaryProps {
  data: {
    id: string;
    quantity: number;
    brandName: string;
    brands: { id: string; quantity: number; brandName: string }[];
  };
  idElement: string;
  onClick: (id: string) => void;
}

export interface ItemSummaryProps {
  brand?: { id: string; quantity: number; brandName: string };
}

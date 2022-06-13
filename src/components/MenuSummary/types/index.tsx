export interface MenuSummaryProps {}

export interface ElementSummaryProps {
  data: {
    id: string;
    quantity: number;
    brandName: string;
    brands: { id: string; quantity: number; brandName: string }[];
  };
  idElement: string;
  toggle?: boolean;
  onClick: (id: string) => void;
  customClass?: string;
}

export interface ItemSummaryProps {
  brand?: { id: string; quantity: number; brandName: string };
  customClass?: string;
}

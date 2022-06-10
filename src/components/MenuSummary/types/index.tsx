export interface MenuSummaryProps {}

export interface ElementSummaryProps {
  data: any;
  idElement?: string;
  // onClick: (event: React.MouseEvent<Element>) => void;

  toggle?: boolean;
}

export interface ItemSummaryProps {
  //   brand?: { id: number; quantity: number; brandName: string };
  brand?: any;
  active?: boolean;
}

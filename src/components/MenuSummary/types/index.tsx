export interface MenuSummaryProps {
  containerClass?: string;
  typeMenu: 'brand' | 'subscription' | 'project';
  menuSummaryData: DataMenuSummaryProps[];
  height?: string;
  typeMenuData?: SummaryProps[];
}

export interface ElementSummaryProps {
  dataElementSummary: DataMenuSummaryProps;
  activeId: string;
  handleActiveTab: (id: string) => void;
}

export interface DataMenuSummaryProps extends SummaryProps {
  subs: SummaryProps[];
}

export interface SummaryProps {
  id: string;
  quantity: number | string;
  label: string;
}

export interface DropDownFilterValueProps {
  id: number;
  name: string;
  icon?: React.ReactNode;
}

export interface DropDownFilterProps {
  selectedFilter: DropDownFilterValueProps;
  setSelectedFilter: (filter: DropDownFilterValueProps) => void;
}

export interface TopBarSummaryProps {
  state: any;
  setState: (state: any) => void;
  summaryData: any;
  summaryType: 'projects' | 'inquires';
}

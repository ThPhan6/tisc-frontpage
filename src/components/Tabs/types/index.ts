export interface TabProp {
  tab: string;
  key: string;
  icon?: JSX.Element;
  disable?: boolean;
}
export interface CustomTabsProps {
  listTab: TabProp[];
  tabDisplay?: 'start' | 'end' | 'space';
  onChange?: (value: TabProp) => void;
  activeTab: TabProp;
  tabPosition?: 'left' | 'right' | 'top' | 'bottom';
  heightItem?: string;
  widthItem?: string;
}

export interface TabProp {
  tab: string;
  key: string;
  icon?: JSX.Element;
}
export interface CustomTabsProps {
  listTab: TabProp[];
  tabsDisplay?: 'flex-start';
  classCustomDisplayTab?: string;
  onChange?: (value: TabProp) => void;
  activeTab: TabProp;
  classCustomSizeTab?: string;
  tabPositon: 'left' | 'right' | 'top' | 'bottom';
}

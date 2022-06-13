export interface TabValue {
  tab: string;
  key: string;
  icon?: JSX.Element;
}
export interface CustomTabsProps {
  listTab: TabValue[];
  direction?: string;
  tabsContent?: string;
  classCustomTab?: string;
  onChange?: (value: TabValue) => void;
  activeTab: TabValue;
}

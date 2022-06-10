import { TabPaneProps } from 'antd';
export interface TabValue {
  tab?: string;
  key?: string;
}
export interface CustomTabsProps extends TabPaneProps {
  options: TabValue[];
  direction?: string;
  tabsContent?: string;
  classCustomTab?: string;
  onChange?: (value: TabValue) => void;
  defaultActiveKey?: TabValue;
}

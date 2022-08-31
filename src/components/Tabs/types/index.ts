import type { TabsProps } from 'antd';

export interface TabItem {
  tab: string;
  key: string;
  icon?: JSX.Element;
  disable?: boolean;
}

export interface CustomTabsProps extends TabsProps {
  listTab: TabItem[];
  tabDisplay?: 'start' | 'end' | 'space';
  tabPosition?: 'left' | 'right' | 'top' | 'bottom';
  heightItem?: string;
  widthItem?: string;
  customClass?: string;
}

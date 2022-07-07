import type { TabsProps } from 'antd';

export interface TabProp {
  tab: string;
  key: string;
  icon?: JSX.Element;
  disable?: boolean;
}

export interface CustomTabsProps extends TabsProps {
  listTab: TabProp[];
  tabDisplay?: 'start' | 'end' | 'space';
  tabPosition?: 'left' | 'right' | 'top' | 'bottom';
  heightItem?: string;
  widthItem?: string;
}

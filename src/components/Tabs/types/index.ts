import type { TabsProps } from 'antd';

export interface TabItem {
  tab: string;
  key: string;
  icon?: JSX.Element;
  disable?: boolean;
  collapseOnMobile?: boolean;
  mobileTabTitle?: string;
  tabletTabTitle?: string;
}

export interface CustomTabsProps extends TabsProps {
  listTab: TabItem[];
  tabDisplay?: 'start' | 'end' | 'space';
  tabPosition?: 'left' | 'right' | 'top' | 'bottom';
  heightItem?: string;
  widthItem?: string;
  customClass?: string;
  hideTitleOnMobile?: boolean;
  hideTitleOnTablet?: boolean;
  outlineOnMobile?: boolean;
}

import { FC, HTMLAttributes, memo, useEffect, useState } from 'react';

import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { Tabs } from 'antd';

import { useScreen } from '@/helper/common';

import { CustomTabsProps } from './types';

import CustomCollapse from '../Collapse';
import style from './styles/index.less';

export const CustomTabs: FC<CustomTabsProps> = ({
  listTab,
  tabDisplay = 'start',
  tabPosition = 'top',
  heightItem = '40px',
  widthItem = '128px',
  customClass = '',
  ...props
}) => {
  const isMobile = useScreen().isMobile;

  const tabs = isMobile ? listTab.filter((el) => !el.collapseOnMobile) : listTab;

  return (
    <div
      className={`${style[`tabs-${tabPosition}`]} ${style['tab-list']} ${
        style[`tabs-${tabDisplay}`]
      } ${customClass}`}>
      <Tabs {...props} tabPosition={tabPosition}>
        {tabs.map((item) => (
          <TabPane
            tab={
              <div
                style={{
                  height: heightItem,
                  width: tabDisplay !== 'space' ? widthItem : '',
                  padding: '0 8px',
                }}
                className={`${style['item-tab']} ${item?.disable && style['custom-color']}`}>
                {item?.icon && <span className={style['custom-icon']}>{item.icon}</span>}
                {isMobile ? item.mobileTabTitle : item.tab}
              </div>
            }
            key={item.key}
            disabled={item?.disable}
          />
        ))}
      </Tabs>
    </div>
  );
};

interface TabPaneProps extends HTMLAttributes<HTMLDivElement> {
  active: boolean;
  lazyLoad?: boolean;
  disable?: boolean;
  forceReload?: boolean;
  collapseOnMobile?: boolean;
}
export const CustomTabPane: FC<TabPaneProps> = memo(
  ({ active, lazyLoad, disable, forceReload, collapseOnMobile, title, ...props }) => {
    const isMobile = useScreen().isMobile;

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      if (lazyLoad && active && loaded === false) {
        setLoaded(true);
      }
    }, [loaded, lazyLoad, active]);

    if (
      disable ||
      (collapseOnMobile && !isMobile) ||
      (lazyLoad && active === false && (forceReload || loaded === false))
    ) {
      return null;
    }

    if (collapseOnMobile) {
      return <CustomCollapse header={title}>{props.children}</CustomCollapse>;
    }
    return <div {...props} style={{ display: !active ? 'none' : undefined }} />;
  },
);

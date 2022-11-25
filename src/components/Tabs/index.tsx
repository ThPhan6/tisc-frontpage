import { FC, HTMLAttributes, memo, useEffect, useState } from 'react';

import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { Tabs } from 'antd';

import { CustomTabsProps } from './types';

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
  return (
    <div
      className={`${style[`tabs-${tabPosition}`]} ${style['tab-list']} ${
        style[`tabs-${tabDisplay}`]
      } ${customClass}`}>
      <Tabs {...props} tabPosition={tabPosition}>
        {listTab.map((tab) => (
          <TabPane
            tab={
              <div
                style={{
                  height: heightItem,
                  width: tabDisplay !== 'space' ? widthItem : '',
                }}
                className={`${style['item-tab']} ${tab?.disable && style['custom-color']}`}>
                {tab?.icon && <span className={style['custom-icon']}>{tab.icon}</span>}
                {tab.tab}
              </div>
            }
            key={tab.key}
            disabled={tab?.disable}
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
}
export const CustomTabPane: FC<TabPaneProps> = memo(({ active, lazyLoad, disable, ...props }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (lazyLoad && active && loaded === false) {
      setLoaded(true);
    }
  }, [loaded, lazyLoad, active]);

  if ((lazyLoad && active === false && loaded === false) || disable) {
    return null;
  }

  return <div {...props} style={{ display: !active ? 'none' : undefined }} />;
});

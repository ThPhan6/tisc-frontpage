import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { Tabs } from 'antd';
import { FC } from 'react';
import { CustomTabsProps } from './types';
import style from './styles/index.less';

export const CustomTabs: FC<CustomTabsProps> = ({
  listTab,
  tabDisplay = 'start',
  tabPosition = 'top',
  heightItem = '40px',
  widthItem = '128px',
  ...props
}) => {
  return (
    <div
      className={`
        ${style[`tabs-${tabPosition}`]}
        ${style['tab-list']}
        ${style[`tabs-${tabDisplay}`]}
      `}
    >
      <Tabs {...props} tabPosition={tabPosition}>
        {listTab.map((tab) => (
          <TabPane
            tab={
              <div
                style={{
                  height: heightItem,
                  width: tabDisplay !== 'space' ? widthItem : '',
                }}
                className={`${style['item-tab']} ${tab?.disable && style['custom-color']}`}
              >
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

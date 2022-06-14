import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { Tabs } from 'antd';
import { FC } from 'react';
import { CustomTabsProps } from './types';
import style from './styles/index.less';
import classNames from 'classnames';

export const CustomTabs: FC<CustomTabsProps> = ({
  listTab,
  tabDisplay = 'start',
  onChange,
  activeTab,
  tabPosition = 'top',
  heightItem = '40px',
  widthItem = '125px',
  ...props
}) => {
  const handleChangeValue = (key: string) => {
    const value = listTab.filter((item) => item.key === key)[0];
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div
      className={classNames(
        style[`tabs-${tabPosition}`],
        style['tab-list'],
        style[`tabs-${tabDisplay}`],
      )}
    >
      <Tabs
        {...props}
        tabPosition={tabPosition}
        onChange={handleChangeValue}
        activeKey={activeTab.key}
      >
        {listTab.map((tab) => (
          <TabPane
            tab={
              <div
                style={{
                  height: heightItem,
                  width: tabDisplay !== 'space' ? widthItem : '',
                }}
                className={classNames(style['item-tab'], tab.disable && style['custom-color'])}
              >
                {tab.icon && <span className={style['custom-icon']}>{tab.icon}</span>}
                {tab.tab}
              </div>
            }
            key={tab.key}
            disabled={tab.disable}
          />
        ))}
      </Tabs>
    </div>
  );
};

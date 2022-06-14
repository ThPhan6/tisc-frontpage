import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { Tabs } from 'antd';
import { FC } from 'react';
import { CustomTabsProps } from './types';
import style from './styles/index.less';
import classNames from 'classnames';

export const CustomTabs: FC<CustomTabsProps> = ({
  listTab,
  tabsDisplay,
  classCustomDisplayTab,
  onChange,
  activeTab,
  classCustomSizeTab,
  tabPositon,
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
        style[`tabs-${tabPositon}`],
        style['tab-list'],
        style[`tabs-${tabsDisplay}`],
        classCustomDisplayTab,
        classCustomSizeTab,
      )}
    >
      <Tabs
        {...props}
        tabPosition={tabPositon}
        onChange={handleChangeValue}
        activeKey={activeTab.key}
      >
        {listTab.map((tab) => (
          <TabPane
            tab={
              <span className={style['flex-item-tab']}>
                {tab.icon && <span className={style['custom-icon']}>{tab.icon}</span>}
                {tab.tab}
              </span>
            }
            key={tab.key}
          />
        ))}
      </Tabs>
    </div>
  );
};

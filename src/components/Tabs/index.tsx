import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { Tabs } from 'antd';
import { FC } from 'react';
import { CustomTabsProps } from './types';
import style from './styles/index.less';
import classNames from 'classnames';

export const CustomTabs: FC<CustomTabsProps> = ({
  listTab,
  direction,
  tabsContent = 'content-space-between',
  classCustomTab,
  onChange,
  activeTab,
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
        style[`tabs-${direction}`],
        style['tab-list'],
        style[`tabs-${tabsContent}`],
        classCustomTab,
      )}
    >
      <Tabs
        {...props}
        tabPosition={direction === 'horizontal' ? 'top' : 'left'}
        onChange={handleChangeValue}
        activeKey={activeTab.key}
      >
        {listTab.map((tab) => (
          <TabPane
            tab={
              <span style={{ display: 'inline-flex' }}>
                {tab.icon}
                <span style={{ marginLeft: '10px' }}>{tab.tab}</span>
              </span>
            }
            key={tab.key}
          />
        ))}
      </Tabs>
    </div>
  );
};

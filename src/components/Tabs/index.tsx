import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { Tabs } from 'antd';
import { FC, useState } from 'react';
import { CustomTabsProps } from './types';
import style from './styles/index.less';
import classNames from 'classnames';

export const CustomTabs: FC<CustomTabsProps> = ({
  options,
  direction,
  tabsContent = 'content-space-between',
  classCustomTab,
  onChange,
  defaultActiveKey,
  ...props
}) => {
  const [tabValue, setTabValue] = useState(defaultActiveKey);
  const handleChangeValue = (key: string) => {
    const value = options.filter((item) => item.key === key)[0];
    setTabValue(value);
    if (onChange) {
      onChange(value);
    }
  };
  console.log(tabValue);
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
        defaultActiveKey={defaultActiveKey?.key}
      >
        {options.map((option) => (
          <TabPane {...option} />
        ))}
      </Tabs>
    </div>
  );
};

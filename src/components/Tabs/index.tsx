import { FC, HTMLAttributes, memo, useEffect, useState } from 'react';

import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { Tabs } from 'antd';

import { useScreen } from '@/helper/common';

import { CustomTabsProps } from './types';
import { CollapseGroup, useCollapseGroupActiveCheck } from '@/reducers/active';

import CustomCollapse from '../Collapse';
import { BodyText } from '../Typography';
import style from './styles/index.less';

export const CustomTabs: FC<CustomTabsProps> = ({
  listTab,
  tabDisplay = 'start',
  tabPosition = 'top',
  heightItem = '40px',
  widthItem = '128px',
  customClass = '',
  hideTitleOnMobile,
  outlineOnMobile,
  hideTitleOnTablet,
  ...props
}) => {
  const { isMobile, isTablet } = useScreen();

  const tabs = isMobile ? listTab.filter((el) => !el.collapseOnMobile) : listTab;

  const hideTitle =
    (isMobile && hideTitleOnMobile) || (hideTitleOnTablet && (isTablet || isMobile));

  const outline = isMobile && outlineOnMobile;

  return (
    <div
      className={`${style[`tabs-${tabPosition}`]} ${style['tab-list']} ${
        style[`tabs-${tabDisplay}`]
      } ${customClass} ${hideTitle ? style.lightTheme : ''} ${outline ? style.outline : ''}`}
    >
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
                className={`${style['item-tab']} ${item?.disable && style['custom-color']}`}
              >
                {item?.icon && (
                  <span style={{ paddingTop: 5, paddingRight: hideTitle ? 0 : 10 }}>
                    {item.icon}
                  </span>
                )}
                {hideTitle
                  ? null
                  : (isTablet && item.tabletTabTitle) ||
                    (isMobile && item.mobileTabTitle) ||
                    item.tab}
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
  groupType?: CollapseGroup;
  groupIndex?: number; // distinct index for handling active collapse item
}
export const CustomTabPane: FC<TabPaneProps> = memo(
  ({
    active,
    lazyLoad,
    disable,
    forceReload,
    collapseOnMobile,
    title,
    groupType,
    groupIndex,
    ...props
  }) => {
    const isMobile = useScreen().isMobile;

    const [loaded, setLoaded] = useState(false);

    const { curActiveKey, onKeyChange } = useCollapseGroupActiveCheck(groupType, groupIndex);

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
      return (
        <CustomCollapse
          activeKey={curActiveKey}
          onChange={onKeyChange}
          header={<BodyText level={3}>{title}</BodyText>}
          noPadding
          noBorder
          arrowAlignRight
          style={{ marginBottom: 8 }}
        >
          {props.children}
        </CustomCollapse>
      );
    }
    return <div {...props} style={{ display: !active ? 'none' : undefined }} />;
  },
);

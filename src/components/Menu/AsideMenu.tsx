import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { MenuDataItem } from '@ant-design/pro-layout';
import type { HeaderViewProps } from '@ant-design/pro-layout/lib/Header';
import { Layout, Menu, MenuProps } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

import { ReactComponent as AlignLeftIcon } from '@/assets/icons/align-left-icon.svg';
import { ReactComponent as AlignRightIcon } from '@/assets/icons/align-right-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';

import { pushTo } from '@/helper/history';

import { renderIconByName } from './Icon/index';
import styles from './styles/aside.less';

type MenuItem = Required<MenuProps>['items'][number];

const getMenuItems = (menuItems?: MenuDataItem[]): ItemType[] | undefined => {
  if (!menuItems) {
    return undefined;
  }
  const showedMenuItems = menuItems.filter((el) => !el.unaccessible && !el.hideInMenu);
  if (showedMenuItems.length) {
    return showedMenuItems.map((item) => {
      const children = getMenuItems(item.children);
      return {
        key: item.key,
        children,
        icon: renderIconByName(item.icon, item.unaccessible),
        label: item.name,
        onClick: () => (children ? undefined : pushTo(item.path || '')),
        title: '',
      } as MenuItem;
    });
  }
  return undefined;
};

const AsideMenu: React.FC = (props: HeaderViewProps) => {
  const rootKeys: string[] = [];
  const defaultOpenKeys: string[] = [];
  const appProps: any = props.children;
  //
  const [openKeys, setOpenKeys] = useState<string[]>([
    appProps.props.currentPathConfig?.path ?? location.pathname,
    ...(appProps.props.currentPathConfig?.pro_layout_parentKeys ?? []),
  ]);

  const [collapsed, setCollapsed] = useState(false);
  /// get menu data
  const menuData = props.menuData?.filter((menu) => {
    if (menu.children && menu.key) {
      rootKeys.push(menu.key);
    }
    return (
      menu.unaccessible === false && // only accessible
      menu.name !== undefined
    );
  });

  const menuItems = getMenuItems(menuData);

  useEffect(() => {
    setOpenKeys([
      appProps.props.currentPathConfig?.path ?? location.pathname,
      ...(appProps.props.currentPathConfig?.pro_layout_parentKeys ?? []),
    ]);
  }, [appProps]);

  // Open only one submenu at a time
  const onOpenChange = (items: any) => {
    const latestOpenKey = items.find((key: any) => openKeys.indexOf(key) === -1);
    if (rootKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(items);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : defaultOpenKeys);
    }
  };
  // called when a menu item is clicked
  const onClick = (item: any) => {
    setOpenKeys(item.keyPath);
  };

  const customExpandIcon = useCallback((data: any) => {
    if (data.isSubMenu) {
      return (
        <DropdownIcon
          className={`${styles['ant-menu-expand-icon']} ${data.isOpen ? styles['item-open'] : ''}`}
        />
      );
    }
    return null;
  }, []);

  return (
    <>
      <div
        style={{
          overflow: 'hidden',
          width: collapsed ? 60 : '16.66666667%',
          flex: `0 0 ${collapsed ? '60px' : '16.66666667%'}`,
          maxWidth: collapsed ? 60 : '16.66666667%',
          transition:
            'background-color 0.3s ease 0s, min-width 0.3s ease 0s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s',
        }}
      />
      <Layout.Sider
        breakpoint={'md'}
        collapsible
        collapsedWidth={60}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className={styles.customAsideSider}
        trigger={collapsed ? <AlignRightIcon /> : <AlignLeftIcon />}>
        <div className="menu-sider-wrapper">
          {useMemo(
            () => (
              <Menu
                theme={props.headerTheme}
                openKeys={openKeys}
                selectedKeys={openKeys}
                onOpenChange={onOpenChange}
                style={{ height: '100%' }}
                mode={'inline'}
                onClick={onClick}
                inlineIndent={16}
                expandIcon={customExpandIcon}
                items={menuItems}
              />
            ),
            [openKeys, menuItems],
          )}
        </div>
      </Layout.Sider>
    </>
  );
};

export default AsideMenu;

import type { HeaderViewProps } from '@ant-design/pro-layout/lib/Header';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import type { MenuDataItem } from '@ant-design/pro-layout';
import styles from './styles/aside.less';
import { ReactComponent as DropdownIcon } from '../../assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '../../assets/icons/drop-up-icon.svg';
import { ReactComponent as AlignLeftIcon } from '../../assets/icons/align-left-icon.svg';
import { ReactComponent as AlignRightIcon } from '../../assets/icons/align-right-icon.svg';
import { renderIconByName } from './Icon/index';
import { isEmpty } from 'lodash';
// import umi, { useLocation, useRouteMatch } from 'umi';

const renderMenuItem = (menu: MenuDataItem) => {
  return (
    <Menu.Item key={menu.key} className={styles.customAsideMenu}>
      <Link to={menu.path}>
        <span className="ant-pro-menu-item">
          {renderIconByName(menu.icon)}
          <span className="ant-pro-menu-item-title">{menu.name}</span>
        </span>
      </Link>
    </Menu.Item>
  );
};

const renderSubMenu = (menu: MenuDataItem) => {
  const children = menu.children && menu.children.filter((item) => !item.hideInMenu);
  if (isEmpty(children)) {
    return renderMenuItem(menu);
  }
  return (
    <Menu.SubMenu
      title={menu.name}
      key={menu.key}
      icon={renderIconByName(menu.icon)}
      className={styles.customAsideSubMenu}
    >
      {children?.map((child) => {
        const childrenLevel2 = child.children && child.children.filter((item) => !item.hideInMenu);

        if (childrenLevel2) {
          return renderSubMenu(child);
        }
        return renderMenuItem(child);
      })}
    </Menu.SubMenu>
  );
};

const AsideMenu: React.FC = (props: HeaderViewProps) => {
  // const location = useLocation();
  const rootKeys: string[] = [];
  const defaultOpenKeys: string[] = [];
  const appProps: any = props.children;
  //
  const [openKeys, setOpenKeys] = useState<string[]>([
    appProps.props.currentPathConfig.path,
    ...appProps.props.currentPathConfig.pro_layout_parentKeys,
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

  // useEffect(() => {
  //   // console.log('changed location', location);
  //   // console.log('openKeys', openKeys);
  //   // console.log('routerMatch', routerMatch);
  //   // console.log('umi', umi);
  // }, [location]);

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
  const customExpandIcon = (data: any) => {
    if (data.isSubMenu) {
      if (data.isOpen) {
        return <DropupIcon />;
      }
      return <DropdownIcon />;
    }
    return undefined;
  };

  return (
    <Layout.Sider
      width={props.siderWidth ?? 240}
      breakpoint={'md'}
      style={{
        paddingTop: 48,
        overflow: 'auto',
      }}
      collapsible
      collapsedWidth={60}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className={styles.customAsideSider}
    >
      <div className="menu-sider-wrapper">
        <Menu
          theme={props.headerTheme}
          selectedKeys={openKeys}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          style={{ height: '100%' }}
          mode={'inline'}
          onClick={onClick}
          inlineIndent={16}
          expandIcon={customExpandIcon}
          triggerSubMenuAction={'click'}
        >
          {menuData?.map((menu) => {
            const children = menu.children && menu.children.filter((item) => !item.hideInMenu);
            if (children) {
              return renderSubMenu(menu);
            } else {
              return renderMenuItem(menu);
            }
          })}
        </Menu>
        {collapsed ? (
          <AlignRightIcon className={styles.siderCollapseIcon} />
        ) : (
          <AlignLeftIcon className={styles.siderCollapseIcon} />
        )}
      </div>
    </Layout.Sider>
  );
};

export default AsideMenu;

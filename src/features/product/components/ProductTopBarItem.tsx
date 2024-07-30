import { CSSProperties, FC, useEffect, useState } from 'react';

import { DropDownProps, Menu, Row } from 'antd';
import Dropdown from 'antd/es/dropdown';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { useScreen } from '@/helper/common';
import { useBoolean } from '@/helper/hook';
import { capitalize, sortBy, truncate } from 'lodash';

import CustomButton from '@/components/Button';
import CustomCollapse from '@/components/Collapse';
import { FilterDrawer } from '@/components/Modal/Drawer';
import { BodyText } from '@/components/Typography';

import styles from './ProductTopBarItem.less';

interface ProductTopBarProps {
  topValue?: string | number | React.ReactNode;
  disabled?: boolean;
  bottomValue?: string | React.ReactNode;
  bottomEnable?: boolean;
  icon?: React.ReactNode;
  customClass?: string;
  onClick?: () => void;
  style?: CSSProperties;
  cursor?: 'pointer' | 'default';
}

export const TopBarItem: React.FC<ProductTopBarProps> = ({
  topValue,
  bottomValue,
  icon,
  disabled,
  bottomEnable,
  customClass,
  onClick,
  style,
  cursor,
}) => {
  const renderTopValue = () => {
    if (typeof topValue === 'string' || typeof topValue === 'number') {
      return (
        <BodyText level={5} fontFamily="Roboto" customClass={disabled ? 'disabled ' : 'active'}>
          {topValue}
        </BodyText>
      );
    }

    if (topValue) return topValue;

    return <span style={{ opacity: 0 }}>.</span>;
  };

  return (
    <div className={`item ${customClass ?? ''}`} onClick={onClick} style={style}>
      {renderTopValue()}
      <BodyText
        level={6}
        fontFamily="Roboto"
        customClass={`topbar-group-btn ${disabled && !bottomEnable ? 'disabled' : ''}`}
        style={{ cursor: cursor }}
      >
        <span>{bottomValue}</span>
        {icon ? icon : null}
      </BodyText>
    </div>
  );
};

interface FilterItemProps {
  title: string;
  onDelete?: () => void;
}
export const FilterItem: React.FC<FilterItemProps> = ({ title, onDelete }) => {
  return (
    <span className={styles.filterItem}>
      {capitalize(title)}
      <DeleteIcon onClick={onDelete} />
    </span>
  );
};

interface TopBarContainerProps {
  LeftSideContent?: JSX.Element;
  RightSideContent?: JSX.Element;
  BottomContent?: JSX.Element;
  customClass?: string;
}

export const TopBarContainer: React.FC<TopBarContainerProps> = ({
  LeftSideContent,
  RightSideContent,
  BottomContent,
  customClass = '',
}) => {
  const { isMobile } = useScreen();
  return (
    <>
      <div className={`${styles.topbarContainer} ${isMobile ? 'border-top' : ''} ${customClass}`}>
        <div className="left-side">{LeftSideContent}</div>
        <div className="right-side">{RightSideContent}</div>
      </div>
      {BottomContent ? <div className={styles.topbarBottomContainer}>{BottomContent}</div> : null}
    </>
  );
};

interface CascadingMenuProps {
  items: ItemType[];
  subLevel?: number;
  visible?: boolean;
  onCloseMenu: () => void;
  menuStyle?: CSSProperties;
  alignRight?: boolean;
  textCapitalize?: boolean;
  position: 'left' | 'right';
}

const DEFAULT_INDEX = -1;
const DEFAULT_WIDTH = 260;

const CascadingMenu: FC<CascadingMenuProps> = ({
  items,
  subLevel,
  visible,
  onCloseMenu,
  menuStyle,
  alignRight,
  textCapitalize,
  position = 'right',
}) => {
  const [selectedItem, setSelectedItem] = useState<number>(DEFAULT_INDEX);

  useEffect(() => {
    setSelectedItem(DEFAULT_INDEX);
  }, [items, visible]);

  const getPositionLeftMenu = () => {
    if (subLevel) {
      return subLevel * DEFAULT_WIDTH * (position === 'right' ? 1 : -1);
    }
    return undefined;
  };

  return (
    <>
      <Menu
        style={{
          width: DEFAULT_WIDTH,
          position: subLevel ? 'absolute' : 'relative',
          top: subLevel ? 0 : undefined,
          left: getPositionLeftMenu(),
          boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
          height: 432,
          overflow: 'hidden auto',
          padding: 0,
          bottom: -3,
          ...menuStyle,
        }}
      >
        {items.map((item, index) => {
          const hasChildren = item?.children?.length > 0;

          return (
            <Menu.Item
              key={item?.id || index}
              onClick={(e) => {
                e.domEvent.stopPropagation();
                setSelectedItem((curIndex) => (curIndex === index ? DEFAULT_INDEX : index));
                if (hasChildren === false) {
                  item?.onClick?.();
                  onCloseMenu();
                }
              }}
              className={`${alignRight ? styles.alignRight : ''} ${
                textCapitalize ? styles.textCapitalize : styles.text
              } ${selectedItem === index ? styles.active : ''} ${hasChildren ? '' : styles.noSub}`}
              disabled={item?.disabled}
              icon={item?.icon || (hasChildren ? <DropdownIcon /> : undefined)}
            >
              {item?.label}
            </Menu.Item>
          );
        })}
      </Menu>

      {items?.[selectedItem]?.children && (
        <CascadingMenu
          items={items?.[selectedItem].children}
          subLevel={(subLevel || 0) + 1}
          onCloseMenu={onCloseMenu}
          menuStyle={menuStyle}
          alignRight={alignRight}
          position={position}
        />
      )}
    </>
  );
};
interface CheckboxMenuProps {
  items: { id: string; name: string }[];
  subLevel?: number;
  visible?: boolean;
  onCloseMenu: () => void;
  menuStyle?: CSSProperties;
  alignRight?: boolean;
  textCapitalize?: boolean;
  position: 'left' | 'right';
  onChangeValues?: (values: any) => void;
  selected?: { id: string; name: string }[];
}
const CheckboxCascadingMenu: FC<CheckboxMenuProps> = ({
  items,
  subLevel,
  menuStyle,
  position = 'right',
  onChangeValues,
  selected,
  visible,
}) => {
  const [values, setValues] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    if (selected) {
      setValues(selected);
    }
  }, [selected]);
  const getPositionLeftMenu = () => {
    if (subLevel) {
      return subLevel * DEFAULT_WIDTH * (position === 'right' ? 1 : -1);
    }
    return undefined;
  };
  const handleSelect = (item: { id: string; name: string }) => (e: any) => {
    e.stopPropagation();
    setValues((pre) => {
      let newValues = pre;
      if (pre.includes(item)) {
        newValues = pre.filter((i) => i.id !== item.id);
        if (onChangeValues) onChangeValues(newValues);
        return newValues;
      }
      newValues = pre.concat([item]);
      if (onChangeValues) onChangeValues(newValues);
      return newValues;
    });
  };
  return visible ? (
    <Menu
      style={{
        width: DEFAULT_WIDTH,
        position: subLevel ? 'absolute' : 'relative',
        top: subLevel ? 0 : undefined,
        left: getPositionLeftMenu(),
        boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
        height: 432,
        overflow: 'hidden auto',
        padding: 0,
        bottom: -3,
        ...menuStyle,
      }}
    >
      {items.map((item, index) => {
        return (
          <div
            className={`d-flex flex-between cursor-pointer ${styles.checkboxMenuItem}`}
            onClick={handleSelect(item)}
          >
            <Menu.Item
              key={item?.id || index}
              className={`${styles.checkboxListItem} ${
                values.includes(item) ? styles.active : ''
              } text-capitalize`}
              onClick={() => {
                return;
              }}
            >
              {item?.name}
            </Menu.Item>
            <div style={{ padding: 8 }}>
              <Checkbox checked={values.includes(item)}></Checkbox>
            </div>
          </div>
        );
      })}
    </Menu>
  ) : null;
};

export interface CheckBoxDropDownProps extends Omit<DropDownProps, 'overlay'> {
  items?: { id: string; name: string }[]; // Use items or overlay
  overlay?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  menuStyle?: CSSProperties;
  labelProps?: React.HTMLAttributes<HTMLSpanElement>;
  hideDropdownIcon?: boolean;
  alignRight?: boolean;
  textCapitalize?: boolean;
  viewAllTop?: boolean;
  autoHeight?: boolean;
  position?: 'left' | 'right';
  nestedMenu?: boolean;
  borderFirstItem?: boolean;
  showCloseFooter?: boolean;
  handleChangeDropDownIcon: any;
  dropDownListVisible?: boolean;
  onChange?: (values: any) => void;
  selected?: any;
}
export const CheckBoxDropDown: FC<CheckBoxDropDownProps> = ({
  children,
  items = [],
  menuStyle,
  labelProps,
  hideDropdownIcon,
  overlay,
  viewAllTop,
  alignRight = true,
  textCapitalize = true,
  position = 'right',
  nestedMenu,
  borderFirstItem,
  showCloseFooter,
  handleChangeDropDownIcon,
  dropDownListVisible,
  onChange,
  selected,
  ...props
}) => {
  const onSelect = (values: any) => {
    if (onChange) onChange(values);
  };
  const tempVisible = useBoolean(false);

  const content = (
    <CheckboxCascadingMenu
      items={sortBy(items, 'name')}
      onCloseMenu={() => {}}
      menuStyle={{
        ...menuStyle,
      }}
      alignRight={alignRight}
      textCapitalize={textCapitalize}
      position={position}
      onChangeValues={onSelect}
      selected={selected}
      visible={tempVisible.value}
    />
  );

  const renderContent = () => {
    return <>{content}</>;
  };
  return (
    <>
      <Dropdown
        placement="bottomLeft"
        trigger={['click']}
        {...props}
        visible={tempVisible.value}
        onVisibleChange={(visible) => {
          tempVisible.setValue(visible);
          if (handleChangeDropDownIcon) handleChangeDropDownIcon(visible);
        }}
        overlayClassName={`${viewAllTop ? styles.viewAllTop : ''}`}
        overlay={renderContent()}
      >
        <span {...labelProps}>
          {children}
          {hideDropdownIcon ? null : tempVisible.value ? (
            <DropupIcon style={{ marginLeft: 8 }} />
          ) : (
            <DropdownIcon style={{ marginLeft: 8 }} />
          )}
        </span>
      </Dropdown>
    </>
  );
};
export interface CustomDropDownProps extends Omit<DropDownProps, 'overlay'> {
  items?: ItemType[]; // Use items or overlay
  overlay?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  menuStyle?: CSSProperties;
  labelProps?: React.HTMLAttributes<HTMLSpanElement>;
  hideDropdownIcon?: boolean;
  alignRight?: boolean;
  textCapitalize?: boolean;
  viewAllTop?: boolean;
  autoHeight?: boolean;
  position?: 'left' | 'right';
  nestedMenu?: boolean;
  borderFirstItem?: boolean;
  showCloseFooter?: boolean;
  handleChangeDropDownIcon: any;
  dropDownListVisible?: boolean;
}
export const CustomDropDown: FC<CustomDropDownProps> = ({
  children,
  items = [],
  menuStyle,
  labelProps,
  hideDropdownIcon,
  overlay,
  viewAllTop,
  alignRight = true,
  textCapitalize = true,
  position = 'right',
  autoHeight = true,
  nestedMenu,
  borderFirstItem,
  showCloseFooter,
  handleChangeDropDownIcon,
  dropDownListVisible,
  ...props
}) => {
  const [height] = useState(autoHeight ? 'auto' : window.innerHeight - 48); // Prevent window.innerHeight changes
  const isMobile = useScreen().isMobile;
  const dropdownVisible = useBoolean(false);

  const renderNestedMenu = (menuItems: ItemType[]) => {
    return menuItems.map((item) =>
      item?.children ? (
        <CustomCollapse header={item?.label} noBorder style={{ paddingLeft: 12 }} nestedCollapse>
          {renderNestedMenu(item.children)}
        </CustomCollapse>
      ) : (
        <Row
          onClick={() => {
            item?.onClick?.();
            dropdownVisible.setValue(false);
          }}
          style={{ paddingLeft: 12, height: 40 }}
          className="flex-start"
        >
          {item?.label}
        </Row>
      ),
    );
  };

  const mobileMenuStyle: CSSProperties = isMobile
    ? {
        width: '100%',
        boxShadow: 'none',
        bottom: 0,
        height,
      }
    : {};

  const content =
    overlay ??
    (nestedMenu && isMobile ? (
      renderNestedMenu(items)
    ) : (
      <CascadingMenu
        items={items}
        visible={dropdownVisible.value}
        onCloseMenu={() => dropdownVisible.setValue(false)}
        menuStyle={{
          ...menuStyle,
          ...mobileMenuStyle,
        }}
        alignRight={alignRight}
        textCapitalize={textCapitalize}
        position={position}
      />
    ));

  const renderContent = () => {
    return (
      <>
        {content}
        {showCloseFooter ? (
          <div className={`flex-end ${styles.footer}`}>
            <CustomButton
              size="small"
              variant="primary"
              properties="rounded"
              onClick={() => dropdownVisible.setValue(false)}
            >
              Close
            </CustomButton>
          </div>
        ) : null}
      </>
    );
  };

  return (
    <>
      <Dropdown
        placement="bottomLeft"
        trigger={['click']}
        {...props}
        visible={
          dropDownListVisible === true || dropDownListVisible === false
            ? dropDownListVisible
            : dropdownVisible.value && isMobile === false
        }
        onVisibleChange={(visible) => {
          if (handleChangeDropDownIcon) handleChangeDropDownIcon(visible);
          dropdownVisible.setValue(visible);
        }}
        overlayClassName={`${viewAllTop ? styles.viewAllTop : ''}`}
        overlay={renderContent()}
      >
        <span {...labelProps} onClick={(e) => e.stopPropagation()}>
          {children}
          {hideDropdownIcon ? null : dropdownVisible.value ? (
            <DropupIcon style={{ marginLeft: 8 }} />
          ) : (
            <DropdownIcon style={{ marginLeft: 8 }} />
          )}
        </span>
      </Dropdown>
      {isMobile && (
        <FilterDrawer
          visible={dropdownVisible.value}
          onClose={(e) => {
            e.stopPropagation();
            dropdownVisible.setValue(false);
          }}
          className={`${styles.filterDropdown} ${borderFirstItem ? styles.borderFirstItem : ''} ${
            showCloseFooter ? styles.showCloseFooter : ''
          }`}
          height={height}
        >
          {renderContent()}
        </FilterDrawer>
      )}
    </>
  );
};

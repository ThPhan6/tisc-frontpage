import styles from './ProductTopBarItem.less';
import { CSSProperties, FC, useEffect, useState } from 'react';
import { BodyText } from '@/components/Typography';
import { capitalize, truncate } from 'lodash';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import Dropdown from 'antd/es/dropdown';
import { DropDownProps, Menu } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useBoolean } from '@/helper/hook';
import { GeneralData } from '@/types';
import { HeaderDropdown } from '@/components/HeaderDropdown';
import store from '@/reducers';
import { setProductList } from '@/features/product/reducers';
import { ProductFilterType } from '@/features/product/types';

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

export const TopBarItem: React.FC<ProductTopBarProps> = (props) => {
  const {
    topValue,
    bottomValue,
    icon,
    disabled,
    bottomEnable,
    customClass,
    onClick,
    style,
    cursor,
  } = props;

  return (
    <div className={`item ${customClass ?? ''}`} onClick={onClick} style={style}>
      {typeof topValue === 'string' || typeof topValue === 'number' ? (
        <BodyText level={5} fontFamily="Roboto" customClass={disabled ? 'disabled ' : ''}>
          {topValue}
        </BodyText>
      ) : (
        topValue
      )}
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
      {truncate(capitalize(title), { length: 25 })}
      <DeleteIcon onClick={onDelete} />
    </span>
  );
};

interface TopBarContainerProps {
  LeftSideContent?: JSX.Element;
  RightSideContent?: JSX.Element;
  BottomContent?: JSX.Element;
}

export const TopBarContainer: React.FC<TopBarContainerProps> = ({
  LeftSideContent,
  RightSideContent,
  BottomContent,
}) => {
  return (
    <>
      <div className={styles.topbarContainer}>
        <div className="left-side">{LeftSideContent}</div>
        <div className="right-side">{RightSideContent}</div>
      </div>
      {BottomContent && <div className={styles.topbarBottomContainer}>{BottomContent}</div>}
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

  return (
    <>
      <Menu
        style={{
          width: DEFAULT_WIDTH,
          position: subLevel ? 'absolute' : 'relative',
          top: subLevel ? 0 : undefined,
          left: subLevel ? subLevel * DEFAULT_WIDTH * (position === 'right' ? 1 : -1) : undefined,
          boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
          height: 432,
          overflow: 'hidden auto',
          padding: 0,
          ...menuStyle,
        }}
      >
        {items.map((item, index) => {
          const hasChildren = item?.children?.length > 0;

          return (
            <Menu.Item
              key={item?.id || index}
              onClick={() => {
                setSelectedItem((curIndex) => (curIndex === index ? DEFAULT_INDEX : index));
                if (hasChildren === false) {
                  item?.onClick?.();
                  onCloseMenu();
                }
              }}
              className={`${alignRight ? styles.alignRight : ''} ${
                textCapitalize ? styles.textCapitalize : ''
              } ${selectedItem === index ? styles.active : ''} ${hasChildren ? '' : styles.noSub}`}
              disabled={item.disabled}
              icon={item?.icon || (hasChildren ? <DropdownIcon /> : undefined)}
            >
              {item.label}
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

export interface CustomDropDownProps extends Omit<DropDownProps, 'overlay'> {
  items?: ItemType[]; // Use items or overlay
  overlay?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  menuStyle?: CSSProperties;
  labelProps?: React.HTMLAttributes<HTMLSpanElement>;
  hideDropdownIcon?: boolean;
  alignRight?: boolean;
  textCapitalize?: boolean;
  position?: 'left' | 'right';
}
export const CustomDropDown: FC<CustomDropDownProps> = ({
  children,
  items = [],
  menuStyle,
  labelProps,
  hideDropdownIcon,
  overlay,
  alignRight = true,
  textCapitalize = true,
  position = 'right',
  ...props
}) => {
  const dropdownVisible = useBoolean(false);
  return (
    <Dropdown
      placement="bottomLeft"
      trigger={['click']}
      {...props}
      visible={dropdownVisible.value}
      onVisibleChange={(visible) => {
        dropdownVisible.setValue(visible);
      }}
      overlay={
        overlay ?? (
          <CascadingMenu
            items={items}
            visible={dropdownVisible.value}
            onCloseMenu={() => dropdownVisible.setValue(false)}
            menuStyle={menuStyle}
            alignRight={alignRight}
            textCapitalize={textCapitalize}
            position={position}
          />
        )
      }
    >
      <span {...labelProps}>
        {children}
        {hideDropdownIcon ? null : <DropdownIcon />}
      </span>
    </Dropdown>
  );
};

export const renderDropDownList = (
  title: string,
  filterName: ProductFilterType,
  data: GeneralData[],
  disabled: boolean,
) => {
  // merge view small
  const items = [{ id: 'all', name: 'VIEW ALL' }, ...data];
  ///
  return (
    <HeaderDropdown
      align={{ offset: [26, 7] }}
      placement="bottomRight"
      containerClass={styles.topbarDropdown}
      disabled={disabled}
      items={items.map((item) => {
        return {
          onClick: () => {
            store.dispatch(
              setProductList({
                filter: {
                  name: filterName,
                  title: item.name,
                  value: item.id,
                },
              }),
            );
          },
          label: item.name,
        };
      })}
      trigger={['click']}
    >
      <span>
        {title}
        <DropdownIcon />
      </span>
    </HeaderDropdown>
  );
};

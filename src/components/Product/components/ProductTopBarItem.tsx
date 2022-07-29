import { BodyText } from '@/components/Typography';
import { capitalize, truncate } from 'lodash';
import styles from '../styles/top-bar.less';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import Dropdown from 'antd/es/dropdown';
import { DropDownProps, Menu } from 'antd';
import { CSSProperties, FC, useEffect, useState } from 'react';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useBoolean } from '@/helper/hook';

interface ProductTopBarProps {
  topValue?: string | React.ReactNode;
  disabled?: boolean;
  bottomValue?: string | React.ReactNode;
  bottomEnable?: boolean;
  icon?: React.ReactNode;
  customClass?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

export const TopBarItem: React.FC<ProductTopBarProps> = (props) => {
  const { topValue, bottomValue, icon, disabled, bottomEnable, customClass, onClick, style } =
    props;
  return (
    <div className={`item ${customClass ?? ''}`} onClick={onClick} style={style}>
      <BodyText level={5} fontFamily="Roboto" customClass={disabled ? 'disabled ' : ''}>
        {topValue}
      </BodyText>
      <BodyText
        level={6}
        fontFamily="Roboto"
        customClass={`topbar-group-btn ${disabled && !bottomEnable ? 'disabled' : ''}`}
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
}

export const TopBarContainer: React.FC<TopBarContainerProps> = ({
  LeftSideContent,
  RightSideContent,
}) => {
  return (
    <div className={styles.topbarContainer}>
      <div className="left-side">{LeftSideContent}</div>
      <div className="right-side">{RightSideContent}</div>
    </div>
  );
};

interface CascadingMenuProps {
  items: ItemType[];
  subLevel?: number;
  visible?: boolean;
  onCloseMenu?: () => void;
}

const DEFAULT_INDEX = -1;

const CascadingMenu: FC<CascadingMenuProps> = ({ items, subLevel, visible, onCloseMenu }) => {
  const [selectedItem, setSelectedItem] = useState<number>(DEFAULT_INDEX);
  console.log('selectedItem', selectedItem);
  console.log('subLevel', subLevel);

  useEffect(() => {
    setSelectedItem(DEFAULT_INDEX);
  }, [items, visible]);

  return (
    <>
      <Menu
        style={{
          width: 260,
          minWidth: 260,
          position: subLevel ? 'absolute' : 'relative',
          top: subLevel ? 0 : undefined,
          left: subLevel ? subLevel * 260 : undefined,
          boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
          height: 432,
          overflow: 'hidden auto',
          padding: 0,
        }}
      >
        {items.map((item, index) => {
          // console.log('item', item);
          return (
            <>
              <Menu.Item
                key={item?.id || index}
                onClick={() => {
                  setSelectedItem((curIndex) => (curIndex === index ? DEFAULT_INDEX : index));
                  if (!item?.children) {
                    item.onClick?.();
                    onCloseMenu();
                  }
                }}
                className={`${selectedItem === index ? styles.active : ''} ${
                  item?.children ? '' : styles.noSub
                }`}
                icon={item?.children ? <DropdownIcon /> : undefined}
              >
                {item.label}
              </Menu.Item>
            </>
          );
        })}
      </Menu>
      {items?.[selectedItem]?.children && (
        <CascadingMenu
          items={items?.[selectedItem].children}
          subLevel={(subLevel || 0) + 1}
          onCloseMenu={onCloseMenu}
        />
      )}
    </>
  );
};

interface CustomDropDownProps extends Omit<DropDownProps, 'overlay'> {
  items: ItemType[];
}
export const CustomDropDown: FC<CustomDropDownProps> = ({ children, items, ...props }) => {
  const dropdownVisible = useBoolean(false);
  return (
    <Dropdown
      placement="bottomLeft"
      trigger={['click']}
      {...props}
      visible={dropdownVisible.value}
      onVisibleChange={(visible) => {
        console.log('visible', visible);
        dropdownVisible.setValue(visible);
      }}
      overlay={
        <CascadingMenu
          items={items}
          visible={dropdownVisible.value}
          onCloseMenu={() => dropdownVisible.setValue(false)}
        />
      }
    >
      <span>
        {children}
        <DropdownIcon />
      </span>
    </Dropdown>
  );
};

import { type CSSProperties, type MouseEvent } from 'react';

import { Menu, MenuProps } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { useToggleExpand } from '@/helper/hook';

import styles from '@/components/TreeSelect/TreeSelect.less';
import { BodyText } from '@/components/Typography';

export interface TreeItem {
  id: string;
  name: string;
  level: number;
  subs: TreeItem[];
}

interface TreeSelectProps<T> extends MenuProps {
  data: T[];
  isSingleExpand?: boolean;
  showAllLevels?: boolean;
  additionalClassName?: string;
  additonalStyle?: CSSProperties;
  onItemSelect: (item: TreeItem) => void;
  defaultExpandedKeys?: string[];
  onExpandedKeys?: (value: string[]) => void;
}

const TreeSelect = <T,>({
  data,
  isSingleExpand = true,
  showAllLevels = false,
  additionalClassName = '',
  onItemSelect,
  additonalStyle,
  defaultExpandedKeys = [],
  onExpandedKeys = () => {},
  ...props
}: TreeSelectProps<T>) => {
  const { expandedKeys, handleToggleExpand } = useToggleExpand(
    isSingleExpand,
    defaultExpandedKeys,
    onExpandedKeys,
  );

  const findMaxLevel = (items: TreeItem[]): number => {
    let maxLevel = 0;
    const queue = items.map((item) => ({ item, level: item.level }));

    while (queue.length > 0) {
      const { item, level } = queue.shift()!;
      if (level > maxLevel) maxLevel = level;
      item.subs?.forEach((sub) => queue.push({ item: sub, level: level + 1 }));
    }

    return maxLevel;
  };

  const maxLevel = findMaxLevel(data as TreeItem[]);

  const isItemSelectable = (item: TreeItem): boolean =>
    showAllLevels ? item.level === maxLevel : item.level === maxLevel - 1;

  const shouldDisplayItem = (item: TreeItem): boolean =>
    showAllLevels ? true : item.level < maxLevel;

  const handleItemClick = (item: TreeItem) => (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (isItemSelectable(item)) {
      onItemSelect(item);
      return;
    }
    handleToggleExpand(item.id);
  };

  const renderTreeItems = (items: TreeItem[]): React.ReactNode => {
    const stack: { item: TreeItem; indent: number }[] = items.map((item) => ({ item, indent: 0 }));
    const result: React.ReactNode[] = [];

    while (stack.length > 0) {
      const { item, indent } = stack.pop()!;

      if (!shouldDisplayItem(item)) continue;

      const isExpanded = expandedKeys.includes(item.id);
      const hasSubs = item.subs?.length > 0;
      const selectable = isItemSelectable(item);

      result.push(
        <div
          key={item.id}
          className="d-flex items-center mr-16 cursor-pointer"
          onClick={handleItemClick(item)}
        >
          <Menu.Item
            className={styles.tree_select_item}
            style={{
              paddingLeft: `${indent * 16}px`,
            }}
          >
            <BodyText
              level={5}
              fontFamily="Roboto"
              style={{ fontWeight: isExpanded ? '500' : '' }}
              customClass={styles.tree_select_name}
            >
              {item.name}
            </BodyText>
          </Menu.Item>
          {(hasSubs || showAllLevels) &&
            !selectable &&
            (isExpanded ? <DropupIcon /> : <DropdownIcon />)}
        </div>,
      );

      if (isExpanded && hasSubs) {
        for (let i = item.subs.length - 1; i >= 0; i--) {
          stack.push({ item: item.subs[i], indent: indent + 1 });
        }
      }
    }

    return result;
  };

  return (
    <Menu
      {...props}
      className={`${styles.tree_select} ${additionalClassName}`}
      style={additonalStyle}
    >
      {renderTreeItems(data as TreeItem[])}
    </Menu>
  );
};

export default TreeSelect;

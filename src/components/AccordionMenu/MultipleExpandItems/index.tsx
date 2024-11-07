import { ChangeEvent, MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';

import { PATH } from '@/constants/path';
import { message } from 'antd';
import { useHistory } from 'umi';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { sortObjectArray } from '@/helper/utils';
import { difference, filter, trimStart } from 'lodash';

import { AccordionItem } from '@/components/AccordionMenu';
import styles from '@/components/AccordionMenu/AccodionMenu.less';
import AccordionMenuInput from '@/components/AccordionMenu/MultipleExpandItems/AccordionMenuInput';
import CustomButton from '@/components/Button';
import { CustomInput } from '@/components/Form/CustomInput';
import { ActionMenu } from '@/components/TableAction';
import TreeSelect, { TreeItem } from '@/components/TreeSelect';
import { BodyText } from '@/components/Typography';

import modalStyle from '@/features/product/modals/index.less';

interface AccordionMenuItemsProps {
  levels: number;
  isEditMode: boolean;
  accordionConfig: {
    inputTitle: string;
  }[];
  accordionItems: AccordionItem[];
  groupItems: AccordionItem[];
  onAdd: (value: string, currentParentId: string | null, level: number) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onUpdate: (id: string, value: string) => Promise<boolean>;
  onSelect: (sub_id: string, parent_id: string) => Promise<boolean>;
}

const AccordionMenuItems = ({
  levels,
  isEditMode,
  accordionConfig,
  accordionItems,
  groupItems,
  onAdd,
  onDelete,
  onUpdate,
  onSelect,
}: AccordionMenuItemsProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<AccordionItem>({
    id: '',
    name: '',
    level: 1,
    parent_id: '',
  });
  const [currentMoveToParentList, setCurrentMoveToParentList] = useState('');
  const [editStatus, setEditStatus] = useState<{
    [key: string]: { value: string; isEditing: boolean };
  }>({});

  const treeSelectRef = useRef<HTMLDivElement>(null);

  const history = useHistory();

  const handleClickOutside = (event: MouseEvent) => {
    if (treeSelectRef.current && !treeSelectRef.current.contains(event.target as Node)) {
      setCurrentMoveToParentList('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAllDescendants = (parentId: string): string[] => {
    const descendants: string[] = [];
    const stack = [parentId];

    // Use a stack to traverse the tree and find all descendants
    while (stack.length > 0) {
      const currentId = stack.pop()!;
      accordionItems.forEach((item) => {
        if (item.parent_id === currentId) {
          descendants.push(item.id ?? '');
          stack.push(item.id ?? '');
        }
      });
    }

    return descendants;
  };

  const toggleExpand = useCallback(
    (id: string, level: number) => () => {
      if (editStatus[id]?.isEditing === true) return;

      setExpandedItems((prev) => {
        const isExpanded = prev.includes(id);
        const descendants = getAllDescendants(id);

        const updatedExpandedItems = isExpanded
          ? // Collapse the item and its descendants
            difference(prev, [id, ...descendants])
          : // Expand the current item and collapse any siblings if necessary.
            [
              ...filter(
                prev,
                (itemId) => (accordionItems.find((item) => item.id === itemId)?.level ?? 0) < level,
              ),
              id,
            ];

        return updatedExpandedItems;
      });
    },
    [accordionItems, editStatus],
  );

  const handleEditClick = (item: AccordionItem) => () => {
    setEditStatus((prev) => ({
      ...prev,
      [item.id ?? '']: { value: item.name, isEditing: true },
    }));
  };

  const handleOnChange = (id: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setEditStatus((prev) => ({
      ...prev,
      [id]: { ...prev[id], value: trimStart(event.target.value) },
    }));
  };

  const handleCancel =
    (id: string): MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      event.stopPropagation();
      setEditStatus((prev) => ({
        ...prev,
        [id]: { ...prev[id], isEditing: false },
      }));
    };

  const handleUpdate =
    (id: string) => async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();

      const newValue = editStatus[id].value;
      if (!newValue) {
        message.warn('Please fill in the value to update');
        return;
      }

      const isSuccess = await onUpdate(id, newValue);
      if (isSuccess) {
        setEditStatus((prev) => ({
          ...prev,
          [id]: { value: '', isEditing: false },
        }));
      }
    };

  const handleItemSelect = async (item: TreeItem) => {
    if (selectedItem.parent_id === item.id) {
      message.warn('Cannot move to a parent of itself');
      return;
    }
    const isSuccess = await onSelect(selectedItem.id ?? '', item.id);
    if (isSuccess) setCurrentMoveToParentList('');
  };

  const handleToggleTreeSelect = (item: AccordionItem) => (event: React.MouseEvent) => {
    event?.stopPropagation();
    setCurrentMoveToParentList(item.id === currentMoveToParentList ? '' : item.id ?? '');
    setSelectedItem(item);
  };

  const removeItem = (id: string) => async () => {
    const success = await onDelete(id);
    if (success) setExpandedItems([]);
  };

  const getCategoryPath = (item: AccordionItem, items: AccordionItem[]) => {
    const path = [];
    let currentItem: AccordionItem | null = item;

    // Traverse upwards through the tree structure to build the full path
    while (currentItem) {
      path.unshift(currentItem.name); // Add the current item name at the beginning of the path
      const parentItem = items.find((parent) => parent.id === currentItem?.parent_id) || null;
      currentItem = parentItem;
    }

    return path.join(' / ');
  };

  const handleItemClick = (clickedItem: AccordionItem, level: number) => () => {
    const isLastLevel = level === levels;

    if (!isLastLevel) {
      toggleExpand(clickedItem.id ?? '', level)();
      return;
    }

    const fullPath = getCategoryPath(clickedItem, [...accordionItems]);
    history.push({
      pathname: PATH.brandPricesInventoriesTable,
      search: `?categories=${encodeURIComponent(fullPath)}`,
      state: {
        categoryId: clickedItem.id,
        brandId: clickedItem.relation_id,
        groupItems: groupItems,
      },
    });
  };

  const renderItems = (level: number, parentId: string | null = null) => {
    return sortObjectArray(accordionItems, 'name')
      .filter((item) => item.level === level && item.parent_id === parentId)
      .map((item) => {
        const isEditing = editStatus[item.id]?.isEditing;
        const isExpanded = expandedItems.includes(item.id);

        return (
          <>
            <li
              key={item.id}
              onClick={handleItemClick(item, level)}
              className={`${styles.accordion_menu_item_action}`}
            >
              {isEditing ? (
                <div
                  className={`${modalStyle.actionBtn} ${styles.accordion_menu_input_btn_wrapper}`}
                >
                  <CustomInput
                    autoFocus={isEditing}
                    placeholder="type here"
                    style={{ padding: 0 }}
                    value={editStatus[item.id]?.value || ''}
                    onChange={handleOnChange(item.id)}
                  />
                  <div className={`cursor-default flex-start`}>
                    <CustomButton
                      size="small"
                      variant="primary"
                      properties="rounded"
                      buttonClass={`${modalStyle.btnSize} mr-8`}
                      onClick={handleUpdate(item.id)}
                    >
                      Save
                    </CustomButton>
                    <CustomButton
                      size="small"
                      variant="primary"
                      properties="rounded"
                      buttonClass={modalStyle.btnSize}
                      onClick={handleCancel(item.id)}
                    >
                      Cancel
                    </CustomButton>
                  </div>
                </div>
              ) : (
                <BodyText
                  customClass={`text-hover-medium ${false ? 'font-medium' : ''} ${
                    styles.accordion_menu_item_name
                  } text-capitalize ellipsis`}
                  level={5}
                  fontFamily="Roboto"
                  style={{ fontWeight: `${isExpanded ? '500' : ''}` }}
                >
                  {item.name}
                </BodyText>
              )}
              <div className="d-flex items-center">
                {isEditMode && (
                  <ActionMenu
                    disabled={isEditing}
                    className={`${isEditing ? 'mono-color-medium' : 'mono-color'}`}
                    overlayClassName={modalStyle.actionMenuOverlay}
                    editActionOnMobile={false}
                    customVisible={currentMoveToParentList === item.id}
                    actionItems={
                      [
                        {
                          type: 'updated',
                          label: 'Edit',
                          onClick: handleEditClick(item),
                        },
                        levels === level && {
                          type: 'move_to',
                          label: 'Move to',
                          onClick: handleToggleTreeSelect(item),
                        },
                        {
                          type: 'deleted',
                          label: 'Delete',
                          onClick: removeItem(item.id),
                        },
                      ].filter(Boolean) as any
                    }
                  />
                )}
                {levels !== level && (
                  <span className="ml-8">{isExpanded ? <DropupIcon /> : <DropdownIcon />}</span>
                )}
              </div>
            </li>

            {currentMoveToParentList === item.id && (
              <div ref={treeSelectRef}>
                <TreeSelect data={groupItems} onItemSelect={handleItemSelect} />
              </div>
            )}
          </>
        );
      });
  };

  const renderColumn = (level: number) => {
    const title = accordionConfig[level - 1]?.inputTitle || '';
    const parentIds: any =
      level === 1
        ? [null]
        : expandedItems.filter((id) => accordionItems.some((item) => item.id === id));

    return (
      <div key={level} className={styles.accordion_menu_items}>
        <AccordionMenuInput
          data={accordionItems}
          isEditMode={isEditMode}
          onAdd={onAdd}
          title={title}
          level={level}
          parentIds={parentIds}
          expandedItems={expandedItems}
        />

        <ul className={styles.accordion_menu_item}>
          {parentIds.map((parentId: string) => renderItems(level, parentId))}
        </ul>
      </div>
    );
  };

  return (
    <div className="d-flex w-full">
      {Array.from({ length: levels }, (_, i) => renderColumn(i + 1))}
    </div>
  );
};

export default AccordionMenuItems;

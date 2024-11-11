import { CSSProperties, MouseEvent, useEffect, useRef, useState } from 'react';

import { PATH } from '@/constants/path';
import { message } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as SquareCDownLeft } from '@/assets/icons/square-c-down-left.svg';

import { confirmDelete } from '@/helper/common';
import { useNavigationHandler } from '@/helper/hook';
import { deleteInventory, moveInventoryToCategory } from '@/services';

import { PriceAndInventoryColumn } from '@/types';

import { AccordionItem } from '@/components/AccordionMenu';
import { ActionMenu } from '@/components/TableAction';
import TreeSelect, { TreeItem } from '@/components/TreeSelect';

interface InventoryTableActionMenuProps {
  record: PriceAndInventoryColumn;
  tableRef: React.MutableRefObject<any>;
}

const InventoryTableActionMenu = ({ record, tableRef }: InventoryTableActionMenuProps) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [currentInventory, setCurrentInventory] = useState<string>('');

  const treeSelectRef = useRef<HTMLDivElement>(null);
  const location = useLocation<{
    categoryId: string;
    brandId: string;
    groupItems: AccordionItem[];
  }>();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('categories');
  const navigate = useNavigationHandler();

  const treeSelectStyle = {
    padding: '6px 16px',
    width: '420px',
  };

  const wrapperTreeSelectStyle: CSSProperties = {
    position: 'absolute',
    left: '7rem',
    bottom: '4.5rem',
  };

  const handleToggleExpand = () => (newKeys: string[]) => setExpandedKeys(newKeys);

  const handlePushToUpdate = (id: string) => () =>
    navigate({
      path: PATH.brandPricesInventoriesFormUpdate.replace(':id', id),
      query: { categories: category },
      state: {
        categoryId: location.state?.categoryId,
        brandId: location.state?.brandId,
      },
    })();

  const handleItemMoveToSelect = async (item: TreeItem) => {
    if (item.id === location.state.categoryId) {
      message.warn('Cannot move to the category itself');
      return;
    }
    const res = await moveInventoryToCategory(record.id, item.id);
    if (res) {
      setCurrentInventory('');
      tableRef.current.reload();
    }
  };

  const handleDelete = (id: string) => () => {
    confirmDelete(async () => {
      const res = await deleteInventory(id);
      if (res) tableRef.current.reload();
    });
  };

  const handleToggleTreeSelect =
    (el: PriceAndInventoryColumn) => (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      setCurrentInventory(el.id === currentInventory ? '' : el.id);
    };

  const handleClickOutside = (event: any) => {
    if (treeSelectRef.current && !treeSelectRef.current.contains(event.target as Node)) {
      setCurrentInventory('');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <ActionMenu
      customVisible={currentInventory === record.id}
      actionItems={[
        {
          type: 'updated',
          label: 'Edit Row',
          onClick: handlePushToUpdate(record.id ?? ''),
        },
        {
          type: '',
          label: (
            <div onClick={handleToggleTreeSelect(record)} className="relative">
              <div className="d-flex items-center gap-12">
                <SquareCDownLeft />
                Move to
              </div>

              {currentInventory === record.id && (
                <div ref={treeSelectRef} style={wrapperTreeSelectStyle}>
                  <TreeSelect
                    additonalStyle={treeSelectStyle}
                    showAllLevels={true}
                    isSingleExpand={false}
                    onItemSelect={handleItemMoveToSelect}
                    data={location.state?.groupItems}
                    defaultExpandedKeys={expandedKeys}
                    onExpandedKeys={handleToggleExpand()}
                  />
                </div>
              )}
            </div>
          ),
        },
        {
          type: 'deleted',
          onClick: handleDelete(record.id ?? ''),
        },
      ]}
    />
  );
};

export default InventoryTableActionMenu;

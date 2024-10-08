import { useEffect, useState } from 'react';

import { message } from 'antd';

import { confirmDelete } from '@/helper/common';
import {
  createDynamicCategory,
  deleteDynamicCategory,
  getDynamicCategories,
  getGroupCategories,
  moveCategoryToSubCategory,
  updateDynamicCategory,
} from '@/services';

import AccordionMenu, { AccordionItem } from '@/components/AccordionMenu';

const PricesAndInventories = () => {
  const [accordionItems, setAccordionItems] = useState<AccordionItem[]>([]);
  const [groupItems, setGroupItems] = useState<AccordionItem[]>([]);

  const categoryConfig = [
    { inputTitle: 'Main Categories' },
    { inputTitle: 'Sub Categories' },
    { inputTitle: 'Categories' },
  ];

  const fetchCategories = async () => {
    const res = await getDynamicCategories();
    if (res) setAccordionItems(res);
  };

  const fetchGroupCategories = async () => {
    const res = await getGroupCategories();
    if (res) setGroupItems(res);
  };

  const handleAdd = async (
    value: string,
    parentId: string | null,
    level: number,
    expandedItems: string[],
  ) => {
    if (level > 1 && !expandedItems.includes(parentId ?? '')) {
      message.warn(`Please expand a valid category before adding to this level.`);
      return false;
    }

    const newItem: AccordionItem = {
      id: Math.random().toString(),
      name: value,
      level,
      parent_id: parentId || '',
    };

    const res: any = await createDynamicCategory(newItem);

    if (res) {
      setAccordionItems((prev) => [...prev, res]);
      await fetchGroupCategories();
      return true;
    }

    return false;
  };

  const handleDelete = (id: string) => {
    confirmDelete(async () => {
      const res = await deleteDynamicCategory(id);
      if (res) {
        const updatedItems = accordionItems.filter((item) => item.id !== id);
        setAccordionItems(updatedItems);
        await fetchGroupCategories();
      }
    });
  };

  const handleUpdate = async (id: string, value: string) => {
    const res = await updateDynamicCategory(id, value);
    if (res) {
      setAccordionItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, name: value } : item)),
      );
      setGroupItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, name: value } : item)),
      );
      return true;
    }

    return false;
  };

  useEffect(() => {
    Promise.all([fetchCategories(), fetchGroupCategories()]);
  }, []);

  const handleSelect = async (sub_id: string, parent_id: string) => {
    const res = await moveCategoryToSubCategory(sub_id, parent_id);

    if (res) {
      setAccordionItems((prev) => {
        const updatedItems = prev.map((item) => {
          if (item.id === sub_id) return { ...item, parent_id };
          return item;
        });
        return updatedItems;
      });

      setGroupItems((prev) => {
        const updatedItems = prev.map((item) => {
          if (item.id === sub_id) return { ...item, parent_id };
          return item;
        });

        return updatedItems;
      });
      return true;
    }

    return false;
  };

  return (
    <AccordionMenu
      title="PRODUCT INVENTORY CATEGORY"
      levels={3}
      accordionItems={accordionItems}
      groupItems={groupItems}
      accordionConfig={categoryConfig}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onSelect={handleSelect}
      onUpdate={handleUpdate}
    />
  );
};

export default PricesAndInventories;

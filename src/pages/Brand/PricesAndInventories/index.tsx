import { useEffect, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { message } from 'antd';

import { confirmDelete } from '@/helper/common';
import {
  createDynamicCategory,
  deleteDynamicCategory,
  getBrandCurrencySummary,
  getDynamicCategories,
  getGroupCategories,
  moveCategoryToSubCategory,
  updateDynamicCategory,
} from '@/services';

import AccordionMenu, { AccordionItem } from '@/components/AccordionMenu';
import InventoryHeader from '@/components/InventoryHeader';

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

  const handleAdd = async (value: string, parentId: string | null, level: number) => {
    const newItem: AccordionItem = {
      name: value,
      level,
      parent_id: parentId || '',
    };

    const checkDuplicateList = accordionItems.filter((item) => {
      if (level === 1) {
        return item.parent_id === null;
      }

      return item.parent_id === parentId;
    });

    const nameDuplicated = checkDuplicateList.some(
      (cateEl) => cateEl.name.toLowerCase().trim() === value.toLowerCase().trim(),
    );

    if (nameDuplicated) {
      message.warn('Category name already exists');
      return false;
    }

    const res: any = await createDynamicCategory(newItem);

    if (res) {
      setAccordionItems((prev) => [...prev, res]);
      await fetchGroupCategories();
      return true;
    }

    return false;
  };

  const handleDelete = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmDelete(async () => {
        const res = await deleteDynamicCategory(id);
        if (res) {
          await Promise.all([fetchCategories(), fetchGroupCategories()]);
          resolve(true);
          return;
        }

        resolve(false);
      });
    });
  };

  const handleUpdate = async (id: string, value: string) => {
    const currentCate = accordionItems.find((item) => item.id === id);
    const checkDuplicateList = accordionItems.filter(
      (item) => item.parent_id === currentCate?.parent_id,
    );

    const nameDuplicated = checkDuplicateList.some(
      (cateEl) => cateEl.name.toLowerCase().trim() === value.toLowerCase().trim(),
    );

    if (nameDuplicated) {
      message.warn('Category name already exists');
      return false;
    }

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

  useEffect(() => {
    const brandId = [...new Set(accordionItems.map((item) => item.relation_id))][0];

    if (brandId) {
      const fetchSummary = async () => await getBrandCurrencySummary(brandId);
      fetchSummary();
    }
  }, [accordionItems]);

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

  const pageHeaderRender = () => <InventoryHeader hideSearch />;

  return (
    <PageContainer pageHeaderRender={pageHeaderRender}>
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
    </PageContainer>
  );
};

export default PricesAndInventories;

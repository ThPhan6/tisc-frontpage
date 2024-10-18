import { useEffect, useState } from 'react';

import { PageContainer } from '@ant-design/pro-layout';

import { ReactComponent as SingleRightFormIcon } from '@/assets/icons/single-right-form-icon.svg';

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
import InventoryHeader, { DataItem } from '@/components/InventoryHeader';
import CurrencyModal from '@/components/Modal/CurrencyModal';

const PricesAndInventories = () => {
  const [accordionItems, setAccordionItems] = useState<AccordionItem[]>([]);
  const [groupItems, setGroupItems] = useState<AccordionItem[]>([]);
  const [isShowModal, setIsShowModal] = useState(false);

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

  const handleToggleModal = (status: boolean) => () => setIsShowModal(status);

  const data = [];

  const inventoryHeaderData: DataItem[] = [
    {
      id: '1',
      value: 'USD',
      label: 'BASE CURRENTCY',
      rightAction: (
        <SingleRightFormIcon
          className="cursor-pointer"
          width={16}
          height={16}
          onClick={handleToggleModal(true)}
        />
      ),
    },
    {
      id: '2',
      value: '1043',
      label: 'TOTAL PRODUCT RECORDS',
    },
    {
      id: '3',
      value: 'US$ 00,000',
      label: 'TOTAL STOCK VALUE',
    },
  ];

  return (
    <PageContainer
      pageHeaderRender={() => {
        return <InventoryHeader data={inventoryHeaderData} onSearch={() => {}} />;
      }}
    >
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
      <CurrencyModal
        annouceContent="Beware that changing this currency will impact ALL of your price settings for the existing product cards and partner price rates. Proceed with caution."
        isShowAnnouncement={true}
        onCancel={handleToggleModal(false)}
        onOk={() => {}}
        open={isShowModal}
        title="SELECT CURRENTCY"
        data={[]}
      />
    </PageContainer>
  );
};

export default PricesAndInventories;

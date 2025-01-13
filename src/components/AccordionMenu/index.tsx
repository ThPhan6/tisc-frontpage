import { useBoolean } from '@/helper/hook';

import styles from '@/components/AccordionMenu/AccodionMenu.less';
import AccordionMenuHeader from '@/components/AccordionMenu/AccordionMenuHeader';
import AccordionMenuItems from '@/components/AccordionMenu/MultipleExpandItems';

export interface AccordionItem {
  id?: string;
  relation_id?: string;
  name: string;
  level: number;
  parent_id: string;
  subs?: AccordionItem[];
}

interface AccordionMenuProps {
  title: string;
  levels: number;
  accordionItems: AccordionItem[];
  groupItems: AccordionItem[];
  accordionConfig: {
    inputTitle: string;
  }[];
  onAdd: (value: string, currentParentId: string | null, level: number) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onUpdate: (id: string, value: string) => Promise<boolean>;
  onSelect: (sub_id: string, parent_id: string) => Promise<boolean>;
}

const AccordionMenu = ({
  title,
  levels,
  accordionItems,
  groupItems,
  accordionConfig,
  onAdd,
  onDelete,
  onUpdate,
  onSelect,
}: AccordionMenuProps) => {
  const { value: isEditMode, setValue: setIsEditMode } = useBoolean();

  const handleToggleSwitch = () => setIsEditMode(!isEditMode);

  return (
    <section className={`bg-white ${styles.accordion_menu}`}>
      <AccordionMenuHeader
        title={title}
        isEditMode={isEditMode}
        onToggleSwtich={handleToggleSwitch}
      />
      <div className={`${styles.accordion_menu_section}`}>
        <AccordionMenuItems
          levels={levels}
          accordionItems={accordionItems}
          isEditMode={isEditMode}
          accordionConfig={accordionConfig}
          onAdd={onAdd}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onSelect={onSelect}
          groupItems={groupItems}
        />
      </div>
    </section>
  );
};

export default AccordionMenu;

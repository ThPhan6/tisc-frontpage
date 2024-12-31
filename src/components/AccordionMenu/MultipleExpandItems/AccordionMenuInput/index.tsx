import { useState } from 'react';

import { message } from 'antd';

import { useScreen } from '@/helper/common';

import { AccordionItem } from '@/components/AccordionMenu';
import styles from '@/components/AccordionMenu/AccodionMenu.less';
import { CustomInput } from '@/components/Form/CustomInput';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText, MainTitle } from '@/components/Typography';

interface AccordionMenuInputProps {
  title: string;
  parentIds: string[];
  data: AccordionItem[];
  isEditMode: boolean;
  level: number;
  onAdd: any;
  expandedItems: string[];
}

const AccordionMenuInput = ({
  title,
  parentIds,
  data,
  level,
  isEditMode,
  onAdd,
  expandedItems,
}: AccordionMenuInputProps) => {
  const [newCategory, setNewCategory] = useState('');
  const { isMobile } = useScreen();

  const handleAdd = async (): Promise<void> => {
    if (newCategory.trim()) {
      if (level > 1 && !expandedItems.includes(expandedItems[level - 2])) {
        message.warn(`Please expand a valid category before adding to this level.`);
        return;
      }
      const isSuccess = await onAdd(newCategory, expandedItems[level - 2], level);
      if (isSuccess) setNewCategory('');
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNewCategory(event.target.value);

  const paddingInputStyles = {
    padding: '16px 0 0 0',
  };

  const dataLength = data.filter(
    (item) => item.level === level && parentIds?.includes(item.parent_id),
  ).length;

  const getDynamicTitle = () => {
    if (dataLength <= 1) {
      if (title.endsWith('ies')) return title.slice(0, -3) + 'y';
      if (title.endsWith('s')) return title.slice(0, -1);
    }
    return title;
  };

  return (
    <header className={`${styles.accordion_menu_input} ${isEditMode ? 'p-0' : 'pb-8'}`}>
      <hgroup className={`d-flex items-center ${isMobile ? 'flex-wrap' : ''}`}>
        <MainTitle level={3} customClass="mr-16">
          {getDynamicTitle()}
        </MainTitle>
        <BodyText fontFamily="Roboto" level={5}>
          ({dataLength})
        </BodyText>
      </hgroup>
      <div className={`${styles.accordion_menu_input_wrapper} ${isEditMode ? styles.on : ''}`}>
        <CustomInput
          placeholder="type category name"
          value={newCategory}
          onChange={handleOnChange}
          style={paddingInputStyles}
        />
        <CustomPlusButton
          size={18}
          label="Add"
          disabled={!newCategory}
          onClick={newCategory ? handleAdd : undefined}
          additionalLabelClass={styles.accordion_menu_input_wrapper_plus_button}
        />
      </div>
    </header>
  );
};

export default AccordionMenuInput;

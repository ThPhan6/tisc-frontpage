import { Switch } from 'antd';

import styles from '@/components/AccordionMenu/AccodionMenu.less';
import { CormorantBodyText } from '@/components/Typography';

export interface AccordionMenuHeaderProps {
  title: string;
  isEditMode: boolean;
  onToggleSwtich: () => void;
}

const AccordionMenuHeader = ({ title, isEditMode, onToggleSwtich }: AccordionMenuHeaderProps) => {
  return (
    <header className={styles.accordion_menu_header}>
      <CormorantBodyText level={3} customClass="text-uppercase font-semibold">
        {title}
      </CormorantBodyText>
      <div className="d-flex">
        <Switch
          checked={isEditMode}
          onChange={onToggleSwtich}
          size="default"
          checkedChildren="CLOSE EDIT"
          unCheckedChildren="EDIT CATEGORY"
          className={`${styles.accordion_menu_header_btn_switch} ${
            isEditMode
              ? styles.accordion_menu_header_btn_switch_on
              : styles.accordion_menu_header_btn_switch_off
          }`}
        />
      </div>
    </header>
  );
};

export default AccordionMenuHeader;

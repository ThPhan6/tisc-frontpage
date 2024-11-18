import { INVENTORY_EXPORT_TYPE_LABELS } from '@/features/Import/constants';
import { Checkbox } from 'antd';

import { useExport } from '@/features/Import/hooks/useExport';
import { includes, map } from 'lodash';

import { InventoryExportType } from '@/features/Import/types/export.type';

import { RobotoBodyText } from '@/components/Typography';
import styles from '@/features/Import/components/Export.less';

export const ExportCSV = () => {
  const { selectedFiels, handleCheckboxChange } = useExport();

  const handleStopProgation = () => (event: React.MouseEvent<HTMLElement, MouseEvent>) =>
    event.stopPropagation();

  return (
    <section className={styles.export}>
      <RobotoBodyText level={6} customClass={styles.export_desc}>
        The CSV Export allows user to create CSV template with correct table headers so the next
        Import update will perfectly match to our database. Below are the default table column
        headers which can be customised.
      </RobotoBodyText>

      <article className={styles.export_heading_wrapper}>
        <RobotoBodyText level={6} customClass={styles.export_heading_wrapper_text}>
          Available Table Column Headers
        </RobotoBodyText>
      </article>

      <form className={styles.export_form}>
        {map(INVENTORY_EXPORT_TYPE_LABELS, (el) => {
          const exportType = Number(el.key) as InventoryExportType;

          const checked = includes(selectedFiels, exportType);

          return (
            <article
              key={el.key}
              className="d-flex items-center justify-between"
              onClick={handleCheckboxChange(exportType)}
            >
              <RobotoBodyText
                level={6}
                customClass={`${styles.export_form_label} ${
                  checked ? 'font-medium primary-color-dark' : ''
                }`}
              >
                {el.label}
              </RobotoBodyText>
              <Checkbox checked={checked} onClick={handleStopProgation} />
            </article>
          );
        })}
      </form>
    </section>
  );
};

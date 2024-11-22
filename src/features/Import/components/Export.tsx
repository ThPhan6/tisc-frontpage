import { INVENTORY_EXPORT_LABELS } from '@/features/Import/constants';

import { map } from 'lodash';

import { RobotoBodyText } from '@/components/Typography';
import styles from '@/features/Import/components/Export.less';

export const Export = () => {
  return (
    <section className={styles.export}>
      <RobotoBodyText level={6} customClass={styles.export_desc}>
        The CSV Export allows user to create CSV template with correct table headers so the next
        Import update will perfectly match to our database. Below headers will be exported.
      </RobotoBodyText>

      <article className={styles.export_heading_wrapper}>
        <RobotoBodyText level={6} customClass={styles.export_heading_wrapper_text}>
          Table Column Headers
        </RobotoBodyText>
      </article>

      <article className={styles.export_body_wrapper}>
        {map(INVENTORY_EXPORT_LABELS, (el, index) => (
          <RobotoBodyText key={index} level={6}>
            {el.label}
          </RobotoBodyText>
        ))}
      </article>
    </section>
  );
};

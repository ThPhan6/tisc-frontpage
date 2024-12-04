import { CSSProperties } from 'react';
import { Fragment } from 'react/jsx-runtime';

import { INVENTORY_EXPORT_COLUMN_HEADERS } from '@/features/Import/constants';
import { Checkbox } from 'antd';

import { concat, filter, groupBy, isArray, some } from 'lodash';

import { setSelectedExportTypes } from '@/features/Import/reducers';
import { InventoryExportType } from '@/features/Import/types/export.type';
import store, { useAppSelector } from '@/reducers';

import { RobotoBodyText } from '@/components/Typography';
import styles from '@/features/Import/components/Export.less';

export const Export = () => {
  const selectedExportTypes = useAppSelector((state) => state.import.selectedExportTypes);

  const handleCheckboxChange = (key: InventoryExportType | InventoryExportType[]) => () => {
    const selectedKeys = isArray(key) ? key : [key];
    const isDeselected = some(selectedExportTypes, (k) => selectedKeys.includes(k));

    const newSelectedKeys = isDeselected
      ? filter(selectedExportTypes, (k) => !selectedKeys.includes(k))
      : concat(selectedExportTypes, selectedKeys);

    store.dispatch(setSelectedExportTypes(newSelectedKeys));
  };

  return (
    <section className={styles.export}>
      <RobotoBodyText level={6} customClass={styles.export_desc}>
        The CSV Export allows user to create CSV template with correct table headers so the next
        Import update will perfectly match to our database. Below headers will be exported.
      </RobotoBodyText>

      {Object.entries(groupBy(INVENTORY_EXPORT_COLUMN_HEADERS, 'header')).map(([header, items]) => (
        <Fragment key={header}>
          <article className={styles.export_heading_wrapper}>
            <RobotoBodyText level={6} customClass={styles.export_heading_wrapper_text}>
              {header}
            </RobotoBodyText>
          </article>

          {items.map((item) => {
            const checked = isArray(item.key)
              ? item.key.every((k) => selectedExportTypes.includes(k))
              : selectedExportTypes.includes(item.key);

            const isSku = item.key === InventoryExportType.PRODUCT_ID;
            const articleStyle: CSSProperties = {
              pointerEvents: isSku ? 'none' : 'unset',
            };

            return (
              <article
                className={styles.export_body_wrapper}
                style={articleStyle}
                onClick={handleCheckboxChange(item.key)}
              >
                <RobotoBodyText
                  level={6}
                  customClass={`text-hover-medium cursor-pointer ${
                    checked ? 'font-medium primary-color-dark' : ''
                  }`}
                >
                  {item.label}
                </RobotoBodyText>
                <Checkbox checked={checked} className={isSku ? 'hidden' : ''} />
              </article>
            );
          })}
        </Fragment>
      ))}
    </section>
  );
};

import { useCallback } from 'react';

import { getDatabaseHeader } from '../constants';

import { ReactComponent as MinusIcon } from '@/assets/icons/accessable-minus-icon.svg';
import { ReactComponent as TickIcon } from '@/assets/icons/accessable-tick-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';

import { useImport } from '../hooks/useImport';

import { ImportDatabaseHeader, ImportStep } from '../types/import.type';

import { BodyText } from '@/components/Typography';
import { CustomDropDown } from '@/features/product/components';

import { generateWarehouseInStock, generateWarehouseName } from '../utils';
import styles from './DataMatching.less';

export const DataMatching = () => {
  const {
    step,
    headerMatching,
    headers,
    error,
    warehouses = [],
    handleDeleteHeader,
    handleSelectDatabaseHeader,
  } = useImport();

  const getWarehouseHeaders = (fileField: string) =>
    warehouses
      .map((_warehouse, wsIdx) => {
        const { key: warehouseKey, label: warehouseLabel } = generateWarehouseName(wsIdx + 1);
        const { key: warehouseInStockKey, label: warehouseInStockLabel } = generateWarehouseInStock(
          wsIdx + 1,
        );

        return [
          {
            key: warehouseKey,
            label: warehouseLabel,
            onClick: () => {
              handleSelectDatabaseHeader(fileField, warehouseKey as ImportDatabaseHeader);
            },
          },
          {
            key: warehouseInStockKey,
            label: warehouseInStockLabel,
            onClick: () => {
              handleSelectDatabaseHeader(fileField, warehouseInStockKey as ImportDatabaseHeader);
            },
          },
        ];
      })
      .flat();

  const getHeaderMatching = useCallback(
    (field: string, items: any) =>
      items.find((item: any) => item.key === headerMatching?.[field])?.label,
    [headerMatching],
  );

  return (
    <div className={styles.container}>
      <div className="data-matching-header">
        <BodyText fontFamily="Roboto" level={5} customClass="csv-header">
          Imported CSV Header
        </BodyText>
        <BodyText fontFamily="Roboto" level={5} customClass="database-header">
          Database Header Matching
        </BodyText>
        <BodyText fontFamily="Roboto" level={5} customClass="status-header">
          Status
        </BodyText>
      </div>

      <div className="data-matching-content">
        {headers.map((field, index) => {
          const items = [
            ...getDatabaseHeader(field, handleSelectDatabaseHeader),
            ...getWarehouseHeaders(field),
          ];

          const headerSelected = getHeaderMatching(field, items);

          return (
            <div key={index} className="main-content">
              <div className="file-header">
                <BodyText fontFamily="Roboto" level={5}>
                  {field}
                </BodyText>
                <div className="delete-icon" onClick={handleDeleteHeader(field)}>
                  <DeleteIcon />
                </div>
              </div>

              <CustomDropDown
                alignRight={false}
                textCapitalize={false}
                items={items}
                placement="bottomRight"
                menuStyle={{ width: 160, height: 'auto', maxHeight: 500, overflowY: 'auto' }}
                labelProps={{ className: 'flex-between' }}
                className="database-header-dropdown"
              >
                <BodyText
                  fontFamily="Roboto"
                  level={6}
                  color={headerSelected ? 'mono-color' : 'mono-color-medium'}
                  customClass="header-selected"
                >
                  {headerSelected || 'Select from the list'}
                </BodyText>
              </CustomDropDown>

              <div
                className="matching-status"
                style={{ visibility: step !== ImportStep.STEP_3 ? 'hidden' : 'visible' }}
              >
                {!headerMatching?.[field] ? (
                  <MinusIcon style={{ visibility: 'hidden' }} />
                ) : error?.[headerMatching[field]]?.length ? (
                  <MinusIcon />
                ) : (
                  <TickIcon />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

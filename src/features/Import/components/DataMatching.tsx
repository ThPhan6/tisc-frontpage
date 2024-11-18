import { useCallback } from 'react';

import { getDatabaseHeader } from '../constants';

import { ReactComponent as MinusIcon } from '@/assets/icons/accessable-minus-icon.svg';
import { ReactComponent as TickIcon } from '@/assets/icons/accessable-tick-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';

import { useImport } from '../hooks/useImport';

import { ImportStep } from '../types/import.type';

import { BodyText } from '@/components/Typography';
import { CustomDropDown } from '@/features/product/components';

import styles from './DataMatching.less';

export const DataMatching = () => {
  const { step, headerMatching, headers, error, handleDeleteHeader, handleSelectDatabaseHeader } =
    useImport();

  const getLabel = useCallback(
    (field: string, items: any) =>
      items.find((item: any) => item.key === headerMatching?.[field])?.label ||
      'Select from the list',
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
          const items = getDatabaseHeader(field, handleSelectDatabaseHeader);

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
                menuStyle={{ width: 160, height: 'auto' }}
                labelProps={{ className: 'flex-between' }}
                className="database-header-dropdown"
              >
                <BodyText fontFamily="Roboto" level={5} customClass="header-selected">
                  {getLabel(field, items)}
                </BodyText>
              </CustomDropDown>

              <div
                className="matching-status"
                style={{ visibility: step !== ImportStep.STEP_3 ? 'hidden' : 'visible' }}
              >
                {error?.[headerMatching?.[field] ?? '']?.length ? <MinusIcon /> : <TickIcon />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

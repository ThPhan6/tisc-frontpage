import { useState } from 'react';

import { ReactComponent as Icon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as UnreadIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { TableHeader } from '@/components/Table/TableHeader';

import styles from './DesignFirm.less';

export const BrandRequests = () => {
  const [showDetail, setShowDetail] = useState(true);
  return (
    <div className={styles.content}>
      {showDetail ? (
        <table className={styles.table}>
          <tbody>
            <tr onClick={() => setShowDetail(false)}>
              <td className={styles.date}>2021-04-04</td>
              <td className={styles.projectName}>
                Project RFP <UnreadIcon />
              </td>
              <td className={styles.action}>
                <Icon />
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <>
          <TableHeader
            title="Project name"
            rightAction={
              <CloseIcon style={{ cursor: 'pointer' }} onClick={() => setShowDetail(true)} />
            }
            customClass={styles.customHeader}
          />
          content
        </>
      )}
    </div>
  );
};

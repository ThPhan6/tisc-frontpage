import { useState } from 'react';

import { ReactComponent as Icon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as UnreadIcon } from '@/assets/icons/action-unread.svg';

import styles from './DesignFirm.less';

export const BrandRequests = () => {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div className={styles.content}>
      {showDetail ? (
        <table className={styles.table}>
          <tbody>
            <tr onClick={() => setShowDetail(true)}>
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
        <></>
      )}
    </div>
  );
};

import { useState } from 'react';

import { ReactComponent as Icon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as UnreadIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { TableHeader } from '@/components/Table/TableHeader';

import styles from './DesignFirm.less';

export const BrandRequests = () => {
  const [showDetail, setShowDetail] = useState(true);
  const [detailItem, setDetailItem] = useState('');
  const data = [
    {
      id: '1',
      date: '2021-04-04',
      name: 'Project RFP',
      icon: <Icon />,
    },
    {
      id: '2',
      date: '2021-04-24',
      name: 'Project A',
      icon: <Icon />,
    },
  ];
  const showDetailItem = (id: string) => {
    setShowDetail(false);
    setDetailItem(id);
  };

  return (
    <div className={styles.content}>
      {showDetail ? (
        <table className={styles.table}>
          <tbody>
            {data.map((item) => (
              <tr onClick={() => showDetailItem(item.id)}>
                <td className={styles.date}>{item.date}</td>
                <td className={styles.projectName}>
                  {item.name} <UnreadIcon />
                </td>
                <td className={styles.action}>{item.icon}</td>
              </tr>
            ))}
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
          {detailItem}
        </>
      )}
    </div>
  );
};

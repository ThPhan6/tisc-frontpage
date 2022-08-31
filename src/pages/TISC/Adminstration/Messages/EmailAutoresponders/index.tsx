import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';
import { getEmailTemplatePagination } from '@/services';

import { TableColumnItem } from '@/components/Table/types';
import { EmailTemplate } from '@/types';

import CustomTable from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';

import styles from './styles/index.less';

const EmailAutoList = () => {
  const handleUpdateEmailAuto = (id: string) => {
    pushTo(PATH.updateEmailAuto.replace(':id', id));
  };

  const mainColumns: TableColumnItem<EmailTemplate>[] = [
    {
      title: 'Topic',
      dataIndex: 'topic',
      width: '8%',
      sorter: true,
      render: (_value, record: any) => record.topic_key,
    },
    {
      title: 'Targeted For',
      dataIndex: 'targeted_for',
      width: '10%',
      sorter: true,
      render: (_value, record: any) => record.targeted_for_key,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '5%',
      align: 'center',
      render: (_value: any, record: any) => {
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                label: 'Edit',
                onClick: () => handleUpdateEmailAuto(record.id),
              },
            ]}
          />
        );
      },
    },
  ];
  return (
    <div className={styles.email_table}>
      <CustomTable
        title={'EMAIL AUTORESPONDER'}
        columns={mainColumns}
        fetchDataFunc={getEmailTemplatePagination}
        hasPagination
      />
    </div>
  );
};

export default EmailAutoList;

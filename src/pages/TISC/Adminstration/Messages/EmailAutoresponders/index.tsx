import { PATH } from '@/constants/path';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';
import { getEmailTemplatePagination } from '@/services';

import { TableColumnItem } from '@/components/Table/types';
import { EmailTemplate } from '@/types';

import CustomTable from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';

import styles from './styles/index.less';

const EmailAutoList = () => {
  useAutoExpandNestedTableColumn(0, [2]);
  const handleUpdateEmailAuto = (id: string) => {
    pushTo(PATH.updateEmailAuto.replace(':id', id));
  };

  const mainColumns: TableColumnItem<EmailTemplate>[] = [
    {
      title: 'Topic',
      dataIndex: 'topic',
      sorter: true,
      render: (_value, record: any) => record.topic_key,
    },
    {
      title: 'Targeted For',
      dataIndex: 'targeted_for',
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
            disabledOnMobile
          />
        );
      },
    },
  ];
  return (
    <div className={styles.email_table}>
      <CustomTable
        title={'EMAIL AUTORESPONDER'}
        columns={setDefaultWidthForEachColumn(mainColumns, 2)}
        fetchDataFunc={getEmailTemplatePagination}
        hasPagination
        onRow={(rowRecord) => ({
          onClick: () => {
            handleUpdateEmailAuto(rowRecord.id);
          },
        })}
      />
    </div>
  );
};

export default EmailAutoList;

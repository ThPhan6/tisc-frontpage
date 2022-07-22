import CustomTable from '@/components/Table';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { TableColumnItem } from '@/components/Table/types';
import { EmailTemplate } from '@/types';
import { getEmailTemplatePagination } from '@/services';
import styles from './styles/index.less';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { ActionForm } from '@/components/Action';

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
          <ActionForm
            actionItems={[
              {
                onClick: () => handleUpdateEmailAuto(record.id),
                icon: <EditIcon />,
                label: 'Edit',
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

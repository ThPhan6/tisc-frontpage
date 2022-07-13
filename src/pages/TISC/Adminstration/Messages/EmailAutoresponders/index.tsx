import { HeaderDropdown } from '@/components/HeaderDropdown';
import CustomTable from '@/components/Table';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ICustomTableColumnType } from '@/components/Table/types';
import { IEmailAutoRespondForm } from '@/types';
import { getEmailAutoPagination } from '@/services';
import styles from './styles/index.less';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';

const EmailAutoList = () => {
  const handleUpdateEmailAuto = (id: string) => {
    pushTo(PATH.updateEmailAuto.replace(':id', id));
  };

  const mainColumns: ICustomTableColumnType<IEmailAutoRespondForm>[] = [
    {
      title: 'Topic',
      dataIndex: 'topic',
      width: '5%',
      sorter: true,
    },
    {
      title: 'Targeted For',
      dataIndex: 'targeted_for',
      width: '8%',
      sorter: true,
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
      render: (_value: any, record: any) => {
        return (
          <HeaderDropdown
            arrow={true}
            align={{ offset: [-14, -10] }}
            items={[
              {
                onClick: () => handleUpdateEmailAuto(record.id),
                icon: <EditIcon />,
                label: 'Edit',
              },
            ]}
            trigger={['click']}
          >
            <ActionIcon />
          </HeaderDropdown>
        );
      },
    },
  ];
  return (
    <div className={styles.email_table}>
      <CustomTable
        rightAction={<CustomPlusButton disabled />}
        title={'EMAIL AUTORESPONDER'}
        columns={mainColumns}
        fetchDataFunc={getEmailAutoPagination}
      />
    </div>
  );
};

export default EmailAutoList;

import CustomTable from '@/components/Table';
import { pushTo } from '@/helper/history';
import { useRef } from 'react';
import { Quotation } from '@/types';
import { TableColumnItem } from '@/components/Table/types';
import { HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { PATH } from '@/constants/path';
import { getPolicyTemplates } from './api';
import moment from 'moment';

const PolicyTemplatePage: React.FC = () => {
  const tableRef = useRef<any>();

  const mainColumns: TableColumnItem<Quotation>[] = [
    {
      title: 'Last Updated',
      dataIndex: 'updated_at',
      sorter: true,
      width: '15%',
      render: (value) => {
        return moment(value).format('YYYY-DD-MM');
      },
    },
    {
      title: 'Author',
      dataIndex: 'firstname',
      width: '15%',
      sorter: true,
      render: (value, record: Quotation) => {
        return `${record.author.firstname} ${record.author.lastname}`;
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value: any, record: any) => {
        return (
          <HeaderDropdown
            arrow={true}
            align={{ offset: [-14, -10] }}
            items={[
              {
                onClick: () => pushTo(PATH.policyUpdate.replace(':id', record.id)),
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
    <CustomTable
      ref={tableRef}
      columns={mainColumns}
      fetchDataFunc={getPolicyTemplates}
      title="AGREEMENT / POLICIES / TERMS"
    />
  );
};

export default PolicyTemplatePage;

import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import CustomTable from '@/components/Table';
import { pushTo } from '@/helper/history';
import { useRef } from 'react';
import { deleteQuotation, getQuotationPagination } from '@/services';
import { Quotation } from '@/types';
import { TableColumnItem } from '@/components/Table/types';
import { HeaderDropdown } from '@/components/HeaderDropdown';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { PATH } from '@/constants/path';
import { confirmDelete } from '@/helper/common';

const InspirationalQuotationsList: React.FC = () => {
  const tableRef = useRef<any>();

  const handleUpdateQuotation = (id: string) => {
    pushTo(PATH.updateQuotation.replace(':id', id));
  };

  const handleDeleteQuotation = (id: string) => {
    confirmDelete(() => {
      deleteQuotation(id).then((isSuccess) => {
        if (isSuccess) {
          tableRef.current.reload();
        }
      });
    });
  };

  const mainColumns: TableColumnItem<Quotation>[] = [
    {
      title: 'Author',
      dataIndex: 'author',
      sorter: true,
      width: '10%',
    },
    {
      title: 'Indentity ',
      dataIndex: 'identity',
      width: '15%',
    },
    {
      title: 'Quotation',
      dataIndex: 'quotation',
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
                onClick: () => handleUpdateQuotation(record.id),
                icon: <EditIcon />,
                label: 'Edit',
              },
              {
                onClick: () => handleDeleteQuotation(record.id),
                icon: <DeleteIcon />,
                label: 'Delete',
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
      rightAction={<CustomPlusButton onClick={() => pushTo(PATH.createQuotation)} />}
      ref={tableRef}
      columns={mainColumns}
      fetchDataFunc={getQuotationPagination}
      title="INSPIRATIONAL QUOTATIONS"
    />
  );
};

export default InspirationalQuotationsList;

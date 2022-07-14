import { HeaderDropdown } from '@/components/HeaderDropdown';
import CustomTable from '@/components/Table';
import { ICustomTableColumnType } from '@/components/Table/types';
import { getMarketAvailabilityList } from '@/services';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';

const MarketAvailabilityList = () => {
  const handleUpdateMarketAvailability = (id: string) => {
    pushTo(PATH.updateMarketAvailability.replace(':id', id));
  };

  const mainColumns: ICustomTableColumnType<any>[] = [
    {
      title: 'Collections/Series',
      dataIndex: 'collections',
      width: '20%',
      sorter: true,
    },
    {
      title: 'Available Countries',
      dataIndex: 'countries',
      width: '20%',
    },
    {
      title: 'Africa',
      dataIndex: 'africa',
      width: '5%',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value, record) => {
        return (
          <HeaderDropdown
            arrow={true}
            align={{ offset: [-14, -10] }}
            items={[
              {
                onClick: () => handleUpdateMarketAvailability(record.id),
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
      title="MARKET AVAILABILITY"
      fetchDataFunc={getMarketAvailabilityList}
      columns={mainColumns}
    />
  );
};

export default MarketAvailabilityList;

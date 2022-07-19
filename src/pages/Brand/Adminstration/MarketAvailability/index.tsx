import { HeaderDropdown } from '@/components/HeaderDropdown';
import CustomTable from '@/components/Table';
import { TableColumnItem } from '@/components/Table/types';
import { getMarketAvailabilityList } from '@/services';
import { ReactComponent as ActionIcon } from '@/assets/icons/action-icon.svg';
import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import { useAppSelector } from '@/reducers';
import type { MarketAvailabilityDataList } from '@/types';

const MarketAvailabilityList = () => {
  const user = useAppSelector((state) => state.user.user);

  const handleUpdateMarketAvailability = (id: string) => {
    pushTo(PATH.updateMarketAvailability.replace(':id', id));
  };

  const mainColumns: TableColumnItem<MarketAvailabilityDataList>[] = [
    {
      title: 'Collections/Series',
      dataIndex: 'collection_name',
      sorter: true,
    },
    {
      title: 'Available Countries',
      dataIndex: 'available_countries',
    },
    {
      title: 'Africa',
      dataIndex: 'africa',
    },
    {
      title: 'Asia',
      dataIndex: 'asia',
    },
    {
      title: 'Europe',
      dataIndex: 'europe',
    },
    {
      title: 'N. America',
      dataIndex: 'north_america',
    },
    {
      title: 'Oceania',
      dataIndex: 'oceania',
    },
    {
      title: 'S. America',
      dataIndex: 'south_america',
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
                onClick: () => handleUpdateMarketAvailability(record.collection_id),
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
  if (!user?.brand) {
    return null;
  }
  return (
    <CustomTable
      title="MARKET AVAILABILITY"
      fetchDataFunc={getMarketAvailabilityList}
      columns={mainColumns}
      extraParams={{
        brand_id: user.brand.id,
      }}
    />
  );
};

export default MarketAvailabilityList;

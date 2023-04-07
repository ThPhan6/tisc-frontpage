import { PATH } from '@/constants/path';

import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';
import { MarketAvailabilityDataList } from '@/features/market-availability/type';
import store, { useAppSelector } from '@/reducers';
import { openModal } from '@/reducers/modal';

import CustomTable from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';

import styles from './index.less';
import { getMarketAvailabilityList } from '@/features/market-availability/api';

const MarketAvailabilityList = () => {
  useAutoExpandNestedTableColumn(0, [7]);
  const user = useAppSelector((state) => state.user.user);

  const handleUpdateMarketAvailability = (id: string) => {
    pushTo(PATH.updateMarketAvailability.replace(':id', id));
  };

  const mainColumns: TableColumnItem<MarketAvailabilityDataList>[] = [
    {
      title: 'Collections/Series',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Available Countries',
      dataIndex: 'available_countries',
    },
    {
      title: 'Africa',
      dataIndex: 'africa',
      lightHeading: true,
      render: (value) => value.length || '0',
    },
    {
      title: 'Asia',
      dataIndex: 'asia',
      lightHeading: true,
      render: (value) => value.length || '0',
    },
    {
      title: 'Europe',
      dataIndex: 'europe',
      lightHeading: true,
      render: (value) => value.length || '0',
    },
    {
      title: 'N. America',
      dataIndex: 'n_americas',
      lightHeading: true,
      render: (value) => value.length || '0',
    },
    {
      title: 'Oceania',
      dataIndex: 'oceania',
      lightHeading: true,
      render: (value) => value.length || '0',
    },
    {
      title: 'S. America',
      dataIndex: 's_americas',
      lightHeading: true,
      render: (value) => value.length || '0',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value, record) => {
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'updated',
                label: 'Edit',
                onClick: () => handleUpdateMarketAvailability(record.collection_id),
              },
            ]}
          />
        );
      },
    },
  ];
  if (!user?.brand) {
    return null;
  }
  return (
    <>
      <CustomTable
        title={'MARKET AVAILABILITY'}
        rightAction={
          <InfoIcon
            className={styles.iconInfor}
            onClick={() =>
              store.dispatch(
                openModal({ type: 'Market Availability', title: 'MARKET AVAILABILITY' }),
              )
            }
          />
        }
        fetchDataFunc={getMarketAvailabilityList}
        columns={setDefaultWidthForEachColumn(mainColumns, 7)}
        extraParams={{
          brand_id: user.brand.id,
        }}
        hasPagination
        headerClass={styles.customTitle}
        rowKey="id"
        onRow={(rowRecord: MarketAvailabilityDataList) => ({
          onClick: () => {
            handleUpdateMarketAvailability(rowRecord.collection_id);
          },
        })}
      />
    </>
  );
};

export default MarketAvailabilityList;

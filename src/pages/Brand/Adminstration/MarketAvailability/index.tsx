import { useState } from 'react';

import { PATH } from '@/constants/path';

import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';

import { TableColumnItem } from '@/components/Table/types';
import { MarketAvailabilityDataList } from '@/features/market-availability/type';
import { useAppSelector } from '@/reducers';

import CustomTable from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';
import InformationMarketAvailability from '@/features/market-availability/components/InformationMarketAvailability';

import styles from './index.less';
import { getMarketAvailabilityList } from '@/features/market-availability/api';

const MarketAvailabilityList = () => {
  useAutoExpandNestedTableColumn(0, [7]);
  const user = useAppSelector((state) => state.user.user);

  const handleUpdateMarketAvailability = (id: string) => {
    pushTo(PATH.updateMarketAvailability.replace(':id', id));
  };

  const [informationVisible, setInformationVisible] = useState(false);
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
          <InfoIcon className={styles.iconInfor} onClick={() => setInformationVisible(true)} />
        }
        fetchDataFunc={getMarketAvailabilityList}
        columns={setDefaultWidthForEachColumn(mainColumns, 7)}
        extraParams={{
          brand_id: user.brand.id,
        }}
        hasPagination
        customClass={styles.customTitle}
        rowKey="id"
      />
      <InformationMarketAvailability
        visible={informationVisible}
        setVisible={setInformationVisible}
      />
    </>
  );
};

export default MarketAvailabilityList;

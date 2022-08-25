import { useState } from 'react';

import { PATH } from '@/constants/path';

import { ReactComponent as EditIcon } from '@/assets/icons/action-edit-icon.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';

import { pushTo } from '@/helper/history';

import { TableColumnItem } from '@/components/Table/types';
import { MarketAvailabilityDataList } from '@/features/market-availability/type';
import { useAppSelector } from '@/reducers';

import CustomTable from '@/components/Table';
import { ActionForm } from '@/components/TableAction';
import InformationMarketAvailability from '@/features/market-availability/components/InformationMarketAvailability';

import styles from './index.less';
import { getMarketAvailabilityList } from '@/features/market-availability/api';

const MarketAvailabilityList = () => {
  const user = useAppSelector((state) => state.user.user);

  const handleUpdateMarketAvailability = (id: string) => {
    pushTo(PATH.updateMarketAvailability.replace(':id', id));
  };

  const [informationVisible, setInformationVisible] = useState(false);
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
      lightHeading: true,
    },
    {
      title: 'Asia',
      dataIndex: 'asia',
      lightHeading: true,
    },
    {
      title: 'Europe',
      dataIndex: 'europe',
      lightHeading: true,
    },
    {
      title: 'N. America',
      dataIndex: 'north_america',
      lightHeading: true,
    },
    {
      title: 'Oceania',
      dataIndex: 'oceania',
      lightHeading: true,
    },
    {
      title: 'S. America',
      dataIndex: 'south_america',
      lightHeading: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      width: '5%',
      render: (_value, record) => {
        return (
          <ActionForm
            actionItems={[
              {
                onClick: () => handleUpdateMarketAvailability(record.collection_id),
                icon: <EditIcon />,
                label: 'Edit',
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
        columns={mainColumns}
        extraParams={{
          brand_id: user.brand.id,
        }}
        hasPagination
        customClass={styles.customTitle}
        rowKey="collection_name"
      />
      <InformationMarketAvailability
        visible={informationVisible}
        setVisible={setInformationVisible}
      />
    </>
  );
};

export default MarketAvailabilityList;

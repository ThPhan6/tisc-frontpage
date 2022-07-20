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
import { Title } from '@/components/Typography';
import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';
import styles from '../MarketAvailability/styles/index.less';
import { useState } from 'react';
import InformationMarketAvailability from './components/InformationMarketAvailability';

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
    <>
      <CustomTable
        title={
          <div className={styles.title}>
            <Title level={7}>MARKET AVAILABILITY</Title>{' '}
            <InfoIcon className={styles.iconInfor} onClick={() => setInformationVisible(true)} />
          </div>
        }
        fetchDataFunc={getMarketAvailabilityList}
        columns={mainColumns}
        extraParams={{
          brand_id: user.brand.id,
        }}
      />
      <InformationMarketAvailability
        visible={informationVisible}
        setVisible={setInformationVisible}
      />
    </>
  );
};

export default MarketAvailabilityList;

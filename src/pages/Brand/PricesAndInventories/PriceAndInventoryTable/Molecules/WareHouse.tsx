import { useEffect, useRef, useState } from 'react';

import { Spin, Table, TableColumnsType } from 'antd';

import { getListWarehouseByInventoryId } from '@/services';

import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/WareHouse.less';

interface WareHouseColumn {
  id: string;
  name: string;
  city_name: string;
  country_name: string;
  in_stock: number;
}

const WareHouse = ({ inventoryId }: { inventoryId: string }) => {
  const [dataSource, setDataSource] = useState<WareHouseColumn[]>([]);
  const [loading, setLoading] = useState(false);

  const inventoryCache = useRef<Record<string, WareHouseColumn[]>>({});

  useEffect(() => {
    if (!inventoryId) return;

    if (inventoryCache.current[inventoryId]) {
      setDataSource(inventoryCache.current[inventoryId]);
      return;
    }

    const fetchListWithInventory = async () => {
      setLoading(true);
      const res: any = await getListWarehouseByInventoryId(inventoryId);
      if (res) {
        inventoryCache.current[inventoryId] = res.warehouses;
        setDataSource(res.warehouses);
      }
      setLoading(false);
    };

    fetchListWithInventory();
  }, [inventoryId]);

  const columns: TableColumnsType<WareHouseColumn> = [
    {
      title: '#',
      dataIndex: 'key',
      width: '5%',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Warehouse Name',
      dataIndex: 'name',
      width: '5%',
    },
    {
      title: 'City',
      dataIndex: 'city_name',
      width: '5%',
    },
    {
      title: 'Country',
      dataIndex: 'country_name',
      width: '80%',
    },
    {
      title: 'In Stock',
      dataIndex: 'in_stock',
      width: '5%',
      align: 'center',
    },
  ];

  return (
    <Spin spinning={loading} tip="Loading data...">
      <Table
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        className={styles.warehouse}
      />
    </Spin>
  );
};

export default WareHouse;

import { Table, TableColumnsType } from 'antd';

import { PriceAndInventoryColumn } from '@/types';

import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/WareHouse.less';

interface WareHouseColumn {
  id: string;
  name: string;
  city_name: string;
  country_name: string;
  in_stock: number;
}

const WareHouse = ({ inventoryItem }: { inventoryItem: PriceAndInventoryColumn }) => {
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
    <Table
      pagination={false}
      columns={columns}
      dataSource={inventoryItem.warehouses}
      className={styles.warehouse}
    />
  );
};

export default WareHouse;

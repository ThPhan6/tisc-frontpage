import { Table, TableColumnsType } from 'antd';

import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/WareHouse.less';

const WareHouse = () => {
  const columns: TableColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'key',
      width: '5%',
    },
    {
      title: 'Warehouse Name',
      dataIndex: 'warehouse_name',
      width: '5%',
    },
    {
      title: 'City',
      dataIndex: 'city',
      width: '5%',
    },
    {
      title: 'Country',
      dataIndex: 'country',
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
      dataSource={[
        {
          key: 1,
          warehouse_name: 'Warehouse 1',
          city: 'New York',
          country: 'USA',
          in_stock: 1000,
        },
        {
          key: 2,
          warehouse_name: 'Warehouse 2',
          city: 'Los Angeles',
          country: 'USA',
          in_stock: 2000,
        },
      ]}
      className={styles.warehouse}
    />
  );
};

export default WareHouse;

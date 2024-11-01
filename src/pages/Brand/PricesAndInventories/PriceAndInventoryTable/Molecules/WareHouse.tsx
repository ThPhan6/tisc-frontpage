import { Table, TableColumnsType } from 'antd';

import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/WareHouse.less';

const WareHouse = () => {
  const columns: TableColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'key',
      width: 50,
    },
    {
      title: 'Warehouse Name',
      dataIndex: 'warehouseName',
      width: 150,
    },
    {
      title: 'City',
      dataIndex: 'city',
      width: 100,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      width: 100,
    },
    {
      title: 'In Stock',
      dataIndex: 'inStock',
      width: 80,
      align: 'center',
    },
  ];

  return (
    <Table pagination={false} columns={columns} dataSource={[]} className={styles.warehouse} />
  );
};

export default WareHouse;

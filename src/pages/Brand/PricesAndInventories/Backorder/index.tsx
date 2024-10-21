import { Modal, Table, TableColumnsType } from 'antd';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import styles from '@/pages/Brand/PricesAndInventories/Backorder/Backorder.less';

interface BackorderProps {
  isShowBackorder: boolean;
  onCancel: () => void;
}

const Backorder = ({ isShowBackorder, onCancel }: BackorderProps) => {
  const columns: TableColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'key',
      width: '5%',
    },
    {
      title: 'Warehouse Name',
      dataIndex: 'warehouse_name',
      width: '30%',
    },
    {
      title: 'City',
      dataIndex: 'city',
      width: '20%',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      width: '20%',
    },
    {
      title: 'In Stock',
      dataIndex: 'in_stock',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Add to',
      dataIndex: 'add_to',
      width: '10%',
      align: 'center',
      render: (_: any, item: any) => (
        <></>
        // <UpdatableCell
        //   item={item}
        //   columnKey="add_to"
        //   defaultValue="6"
        //   valueClass="indigo-dark-variant"
        // />
      ),
    },
  ];

  return (
    <Modal
      className={styles.backorder}
      confirmLoading={true}
      title={
        <hgroup className={styles.backorder_heading}>
          <h2 className={styles.backorder_heading_title}>BACKORDER COUNT</h2>
          <p className={styles.backorder_heading_count}>12</p>
        </hgroup>
      }
      open={isShowBackorder}
      onCancel={onCancel}
      closable={false}
      footer={<CustomSaveButton contentButton="Done" />}
    >
      <Table pagination={false} columns={columns} dataSource={[]} />
    </Modal>
  );
};

export default Backorder;

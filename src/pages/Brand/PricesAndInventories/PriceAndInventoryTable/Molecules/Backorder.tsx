import { Modal, Table, TableColumnsType } from 'antd';

import { ReactComponent as CDownLeftIcon } from '@/assets/icons/c-down-left.svg';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/Backorder.less';
import EditableCell from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/EditableCell';

interface BackorderProps {
  onCancel: () => void;
  isShowBackorder: boolean;
}

const Backorder = ({ isShowBackorder, onCancel }: BackorderProps) => {
  const dataSource = [
    {
      id: '1',
      warehouse_name: 'XXXXXX Name A',
      city: 'Singapore',
      country: 'Singapore',
      in_stock: 18,
      convert: 6,
    },
    {
      id: '2',
      warehouse_name: 'XXXXXX Name B',
      city: 'Bangkok',
      country: 'Thailand',
      in_stock: 12,
      convert: 6,
    },
  ];

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
      width: '75%',
    },
    {
      title: 'In Stock',
      dataIndex: 'in_stock',
      width: '5%',
      align: 'center',
    },
    {
      title: 'Convert',
      dataIndex: 'convert',
      width: '5%',
      align: 'center',
      render: (_, item) => (
        <EditableCell
          item={item}
          columnKey="convert"
          defaultValue="6"
          valueClass="indigo-dark-variant"
          onSave={() => {}}
        />
      ),
    },
  ];

  return (
    <Modal
      width={572}
      className={styles.backorder}
      confirmLoading={true}
      title={
        <article className={styles.backorder_heading}>
          <h2 className={styles.backorder_heading_title}>BACKORDER COUNT</h2>
          <div className="d-flex items-center gap-12">
            <CDownLeftIcon className={styles.backorder_heading_icon} />
            <p className={styles.backorder_heading_count}>12</p>
          </div>
        </article>
      }
      open={isShowBackorder}
      onCancel={onCancel}
      closable={false}
      footer={<CustomSaveButton contentButton="Done" onClick={() => {}} />}
    >
      <Table pagination={false} columns={columns} dataSource={dataSource} />
    </Modal>
  );
};

export default Backorder;

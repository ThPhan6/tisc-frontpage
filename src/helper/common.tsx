import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

export const confirmDelete = (onOk: () => void, onCancel: () => void) => {
  Modal.confirm({
    title: 'Are you sure delete this record?',
    icon: <ExclamationCircleOutlined />,
    content: '',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk: onOk,
    onCancel: onCancel,
    style: { top: '40%' },
  });
};

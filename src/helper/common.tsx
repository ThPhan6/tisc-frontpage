import { WarningOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import styles from './common.less';

export const confirmDelete = (onOk: () => void, onCancel?: () => void) => {
  Modal.confirm({
    title: 'Are you sure to delete this item?',
    icon: <WarningOutlined />,
    content: 'You might lose the relevant content, data and connections.',
    okText: 'Yes',
    cancelText: 'No',
    onOk: onOk,
    onCancel: onCancel,
    centered: true,
    className: styles.customModal,
    maskClosable: true,
  });
};

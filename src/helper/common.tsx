import { ReactComponent as WarningIcon } from '@/assets/icons/warning-triangle.svg';
import { Modal, ModalFuncProps } from 'antd';
import styles from './common.less';

export const confirmDelete = (onOk: () => void, props?: ModalFuncProps, onCancel?: () => void) => {
  Modal.confirm({
    title: 'Are you sure to delete this item?',
    icon: <WarningIcon className={styles.deleteModalIcon} />,
    content: 'You might lose the relevant content, data and connections.',
    okText: 'Yes',
    cancelText: 'No',
    onOk: onOk,
    onCancel: onCancel,
    centered: true,
    className: styles.customModal,
    maskClosable: true,
    ...props,
  });
};

export const getResponseMessage = (
  type: 'get-list' | 'get-one' | 'create' | 'delete' | 'update' | 'assign' | 'remove',
  action: string,
  status: 'success' | 'failed' = 'success',
  error?: any,
) => {
  if (error?.data?.message) {
    return error.data?.message;
  }

  let startWith = '';
  switch (type) {
    case 'get-list':
      startWith = 'Get list';
      break;
    case 'get-one':
      startWith = 'Get';
      break;
    case 'create':
      startWith = 'Create';
      break;
    case 'delete':
      startWith = 'Delete';
      break;
    case 'remove':
      startWith = 'Remove';
      break;
    case 'update':
      startWith = 'Update';
      break;
    case 'assign':
      startWith = 'Assign';
      break;
  }

  return `${startWith} ${action} ${status === 'success' ? 'successfully' : 'failed'}`;
};

import { Grid, Modal, ModalFuncProps } from 'antd';

import { ReactComponent as WarningIcon } from '@/assets/icons/warning-triangle.svg';

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

export const confirmModal = (props: {
  title: string;
  icon?: JSX.Element;
  content?: string;
  okText?: string;
  cancelText?: string;
  className?: string;
  centered?: boolean;
  maskClosable?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}) => {
  Modal.confirm({
    ...props,
    okText: 'Yes',
    cancelText: 'No',
    icon: <WarningIcon className={styles.deleteModalIcon} />,
    className: styles.customModal,
    centered: props.centered ?? true,
    maskClosable: props.maskClosable ?? false,
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

export const { useBreakpoint } = Grid;

export const useScreen = () => {
  const screens = useBreakpoint();

  const isTablet = (screens.xs || screens.sm || screens.md) && screens.lg === false;
  const isMobile = screens.xs;
  const isExtraLarge = screens.xl;

  return { isTablet, isMobile, isExtraLarge };
};

import { Modal } from 'antd';
import { FC } from 'react';
import { ReactComponent as CloseIcon } from '../../assets/icons/action-close-open-icon.svg';
import { MainTitle } from '@/components/Typography';

import styles from './styles/index.less';

interface TiscModalProps {
  title: string;
  visible: boolean;
  footer?: boolean;
  setVisible: (visible: boolean) => void;
}

const TISCModal: FC<TiscModalProps> = ({ title, visible, setVisible, children, ...props }) => {
  const onCancel = () => {
    /// hide modal
    setVisible(false);
  };

  return (
    <div>
      <Modal
        title={
          <MainTitle level={3} customClass="text-uppercase">
            {title}
          </MainTitle>
        }
        centered
        visible={visible}
        width={576}
        closeIcon={<CloseIcon />}
        className={styles.customModal}
        footer={false}
        onCancel={onCancel}
        {...props}
      >
        {children}
      </Modal>
    </div>
  );
};
export default TISCModal;

import styles from './PoliciesModal.less';
import { CustomModal } from '@/components/Modal';
import { FC, useState } from 'react';
import { ModalProps } from '../types';
import { CustomTabs } from '@/components/Tabs';

type key = 'terms of services' | 'privacy policy' | 'cookie policy';

export const PoliciesModal: FC<ModalProps> = ({ visible, onClose, theme = 'default' }) => {
  const listTab = [
    { tab: 'TERMS OF SERVICES', key: 'terms of services' },
    { tab: 'PRIVACY POLICY', key: 'privacy policy' },
    { tab: 'COOKIE POLICY', key: 'cookie policy' },
  ];

  const [activeTab, setActiveTab] = useState({
    tab: 'TERMS OF SERVICES',
    key: 'terms of services',
  });

  const renderTabContent = () => {
    switch (activeTab.key as key) {
      case 'terms of services':
        return <div style={{ color: 'white' }}>Content TERMS OF SERVICES</div>;
      case 'privacy policy':
        return <div style={{ color: 'white' }}>Content PRIVACY POLICY</div>;
      case 'cookie policy':
        return <div style={{ color: 'white' }}>Content COOKIE POLICY</div>;
      default:
        break;
    }
  };

  return (
    <CustomModal
      visible={visible}
      footer={false}
      containerClass={theme === 'dark' && styles.modal}
      bodyStyle={{
        backgroundColor: theme === 'dark' ? '#000' : '',
      }}
      closeIconClass={theme === 'dark' && styles.closeIcon}
      onCancel={onClose}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.customTab}>
            <CustomTabs
              listTab={listTab}
              tabPosition="top"
              tabDisplay="space"
              onChange={setActiveTab}
              activeTab={activeTab}
            />
          </div>
        </div>
        <div className={styles.body}>{renderTabContent()}</div>
      </div>
    </CustomModal>
  );
};

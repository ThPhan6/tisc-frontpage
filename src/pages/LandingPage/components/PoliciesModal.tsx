import styles from './PoliciesModal.less';
import { CustomModal } from '@/components/Modal';
import { FC, useState } from 'react';
import { AboutModalProps } from '../types';
import { CustomTabs } from '@/components/Tabs';

export const PoliciesModal: FC<AboutModalProps> = ({ visible, onClose, theme = 'default' }) => {
  const listTab = [
    { tab: 'TERMS OF SERVICES', key: '1' },
    { tab: 'PRIVACY POLICY', key: '2' },
    { tab: 'COOKIE POLICY', key: '3' },
  ];

  const [activeTab, setActiveTab] = useState({
    tab: 'TERMS OF SERVICES',
    key: '1',
  });

  const renderTabContent = () => {
    switch (activeTab.key) {
      case '1':
        return <div style={{ color: 'white' }}>Content TERMS OF SERVICES</div>;
      case '2':
        return <div style={{ color: 'white' }}>Content PRIVACY POLICY</div>;
      case '3':
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

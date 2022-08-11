import styles from './PoliciesModal.less';
import { CustomModal } from '@/components/Modal';
import { FC, useState } from 'react';
import { ModalProps } from '../types';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
// import { Documentation } from '@/pages/TISC/Adminstration/Documentation/PolicyTemplate/types';

enum PolicyTabKeys {
  terms = 'terms of services',
  privacy_policy = 'privacy policy',
  cookie_policy = 'cookie policy',
}

export const PoliciesModal: FC<ModalProps> = ({ visible, onClose, theme = 'default' }) => {
  // const [policyTemplates, setPolicyTemplates] = useState<Documentation[]>([]);
  // useEffect(() => {

  // }, []);

  // console.log(policyTemplates);

  const listTab = [
    { tab: 'TERMS OF SERVICES', key: PolicyTabKeys.terms },
    { tab: 'PRIVACY POLICY', key: PolicyTabKeys.privacy_policy },
    { tab: 'COOKIE POLICY', key: PolicyTabKeys.cookie_policy },
  ];

  const [selectedTab, setSelectedTab] = useState<PolicyTabKeys>(PolicyTabKeys.terms);

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
              onChange={(changedKey) => setSelectedTab(changedKey as PolicyTabKeys)}
              activeKey={selectedTab}
            />
          </div>
        </div>
        <div className={styles.body}>
          {/* terms of services */}
          <CustomTabPane active={selectedTab === PolicyTabKeys.terms}>
            <div>Content terms of services</div>
          </CustomTabPane>
          {/* privacy policy */}
          <CustomTabPane active={selectedTab === PolicyTabKeys.privacy_policy}>
            <div>Content privacy policy</div>
          </CustomTabPane>
          {/* cookie policy */}
          <CustomTabPane active={selectedTab === PolicyTabKeys.cookie_policy}>
            <div>Content cookie policy</div>
          </CustomTabPane>
        </div>
      </div>
    </CustomModal>
  );
};

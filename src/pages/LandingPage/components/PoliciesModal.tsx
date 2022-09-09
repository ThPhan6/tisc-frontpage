import { FC, useEffect, useState } from 'react';

import { getListPolicy } from '../services/api';

import { ModalProps, Policy } from '../types';

import { CustomModal } from '@/components/Modal';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import styles from './PoliciesModal.less';

enum PolicyTabKeys {
  terms = 'terms of services',
  privacy_policy = 'privacy policy',
  cookie_policy = 'cookie policy',
}

export const PoliciesModal: FC<ModalProps> = ({ visible, onClose, theme = 'default' }) => {
  const [termsOfService, setTermOfService] = useState<Policy>();
  const [privacy, setPrivacy] = useState<Policy>();
  const [cookie, setCookie] = useState<Policy>();

  useEffect(() => {
    getListPolicy().then((res) => {
      if (res) {
        res.data.forEach((item: any) => {
          if (item['terms_of_services']?.document) {
            setTermOfService(item['terms_of_services']);
          } else if (item['privacy_policy']?.document) {
            setPrivacy(item['privacy_policy']);
          } else {
            setCookie(item['cookie_policy']);
          }
        });
      }
    });
  }, []);

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
        height: '576px',
      }}
      closeIconClass={theme === 'dark' && styles.closeIcon}
      onCancel={onClose}>
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
            <div
              dangerouslySetInnerHTML={{
                __html: `${termsOfService?.document.document || 'N/A'}`,
              }}></div>
          </CustomTabPane>
          {/* privacy policy */}
          <CustomTabPane active={selectedTab === PolicyTabKeys.privacy_policy}>
            <div
              dangerouslySetInnerHTML={{ __html: `${privacy?.document.document || 'N/A'}` }}></div>
          </CustomTabPane>
          {/* cookie policy */}
          <CustomTabPane active={selectedTab === PolicyTabKeys.cookie_policy}>
            <div
              dangerouslySetInnerHTML={{ __html: `${cookie?.document.document || 'N/A'}` }}></div>
          </CustomTabPane>
        </div>
      </div>
    </CustomModal>
  );
};

import { FC, useEffect, useState } from 'react';

import { getListPolicy } from '../services/api';

import { ModalProps, Policy } from '../types';
import { CustomModalProps } from '@/components/Modal/types';
import { useAppSelector } from '@/reducers';
import { modalThemeSelector } from '@/reducers/modal';

import { CustomModal } from '@/components/Modal';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import styles from './PoliciesModal.less';

enum PolicyTabKeys {
  terms = 'terms of services',
  privacy_policy = 'privacy policy',
  cookie_policy = 'cookie policy',
}

export const PoliciesModal: FC<CustomModalProps & { customTheme?: ModalProps['theme'] }> = ({
  customTheme,
  ...props
}) => {
  const [termsOfService, setTermOfService] = useState<Policy>();
  const [privacy, setPrivacy] = useState<Policy>();
  const [cookie, setCookie] = useState<Policy>();

  const { darkTheme } = useAppSelector(modalThemeSelector);

  const tabs = [
    { tab: 'TERMS OF SERVICES', key: PolicyTabKeys.terms },
    { tab: 'PRIVACY POLICY', key: PolicyTabKeys.privacy_policy },
    { tab: 'COOKIE POLICY', key: PolicyTabKeys.cookie_policy },
  ];

  const [selectedTab, setSelectedTab] = useState<PolicyTabKeys>(PolicyTabKeys.terms);

  useEffect(() => {
    getListPolicy().then((res) => {
      console.log('getListPolicy', res);

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

  const getBackgroundColor = () => {
    if (customTheme) {
      return customTheme === 'dark' ? '#000' : '';
    }

    return darkTheme ? '#000' : '';
  };

  const getIconColor = () => {
    if (customTheme) {
      return customTheme === 'dark' ? styles.closeIcon : '';
    }

    return darkTheme ? styles.closeIcon : '';
  };

  return (
    <CustomModal
      bodyStyle={{
        backgroundColor: getBackgroundColor(),
        height: '576px',
      }}
      closeIconClass={getIconColor()}
      {...props}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.customTab}>
            <CustomTabs
              listTab={tabs}
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
              }}
            ></div>
          </CustomTabPane>
          {/* privacy policy */}
          <CustomTabPane active={selectedTab === PolicyTabKeys.privacy_policy}>
            <div
              dangerouslySetInnerHTML={{ __html: `${privacy?.document.document || 'N/A'}` }}
            ></div>
          </CustomTabPane>
          {/* cookie policy */}
          <CustomTabPane active={selectedTab === PolicyTabKeys.cookie_policy}>
            <div
              dangerouslySetInnerHTML={{ __html: `${cookie?.document.document || 'N/A'}` }}
            ></div>
          </CustomTabPane>
        </div>
      </div>
    </CustomModal>
  );
};

export const usePoliciesModal = (customTheme: ModalProps['theme'] = 'dark') => {
  const [open, setOpen] = useState(false);

  const renderPoliciesModal = () => (
    <PoliciesModal
      customTheme={customTheme}
      visible={open}
      secondaryModal
      onCancel={() => setOpen(false)}
      darkTheme
    />
  );

  return { renderPoliciesModal, openPoliciesModal: () => setOpen(true) };
};

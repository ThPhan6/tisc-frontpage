import { FC } from 'react';

import { Col, Row } from 'antd';

import { useScreen } from '@/helper/common';
import { useQuery } from '@/helper/hook';

import { ModalOpen } from './types';
import store from '@/reducers';
import { openModal } from '@/reducers/modal';

import { BodyText } from '@/components/Typography';

import styles from './index.less';

interface LandingPageFooteProps {
  listMenuFooter: ModalOpen[];
  customClass?: string;
}

export const LandingPageFooter: FC<LandingPageFooteProps> = ({
  listMenuFooter,
  customClass = '',
}) => {
  const { isMobile } = useScreen();

  const signature = useQuery().get('signature') || '';
  const isPublicPage = signature ? true : false;

  const footerItems = isMobile ? listMenuFooter.slice(0, -1) : listMenuFooter;

  const setOpenModal = (modal: ModalOpen) => () => {
    switch (modal) {
      case 'About':
        store.dispatch(openModal({ type: 'About', theme: 'dark' }));
        return;
      case 'Policies':
        store.dispatch(openModal({ type: 'Policies', theme: 'dark' }));
        return;
      case 'Contact':
        store.dispatch(openModal({ type: 'Contact', theme: 'dark' }));
        return;
      case 'Browser Compatibility':
        store.dispatch(openModal({ type: 'Browser Compatibility', theme: 'dark' }));
        return;
      default:
        return undefined;
    }
  };

  return (
    <div className={`${styles['footer-container']} ${customClass}`}>
      <Row justify="center">
        <Col span={isMobile ? 24 : 22}>
          <div className={styles.footer}>
            {isMobile ? null : (
              <BodyText level={5} fontFamily="Roboto">
                © TISC 2022
              </BodyText>
            )}
            <div
              className={styles['menu-wrapper']}
              style={{
                marginLeft: isMobile ? 0 : undefined,
                marginRight: isMobile ? 16 : undefined,
              }}>
              <div className={styles.menu}>
                {footerItems.map((item, index) => (
                  <BodyText
                    key={index}
                    level={5}
                    fontFamily="Roboto"
                    customClass={styles.item}
                    onClick={setOpenModal(item)}>
                    {item}
                  </BodyText>
                ))}
              </div>

              {isPublicPage ? null : (
                <BodyText
                  level={5}
                  fontFamily="Roboto"
                  customClass={styles['tisc-login']}
                  onClick={() =>
                    store.dispatch(
                      openModal({ type: 'Tisc Login', theme: 'dark', autoHeightDrawer: true }),
                    )
                  }>
                  TISC Log in
                </BodyText>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

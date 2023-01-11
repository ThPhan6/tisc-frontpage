import { FC } from 'react';

import { Col, Row } from 'antd';

import { useScreen } from '@/helper/common';
import { useQuery } from '@/helper/hook';

import store from '@/reducers';
import { ModalType, openModal } from '@/reducers/modal';

import { BodyText } from '@/components/Typography';

import styles from './index.less';

interface LandingPageFooteProps {
  listMenuFooter: ModalType[];
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
              }}
            >
              <div className={styles.menu}>
                {footerItems.map((item, index) => (
                  <BodyText
                    key={index}
                    level={5}
                    fontFamily="Roboto"
                    customClass={styles.item}
                    onClick={() =>
                      store.dispatch(
                        openModal({
                          type: item,
                          theme: 'dark',
                          autoHeightDrawer: true,
                          noBorderDrawerHeader: true,
                        }),
                      )
                    }
                  >
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
                  }
                >
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

import { FC } from 'react';

import { Col, Row } from 'antd';

import { ModalOpen } from './types';

import { BodyText } from '@/components/Typography';

import styles from './index.less';

interface LandingPageFooteProps {
  listMenuFooter: ModalOpen[];
  setOpenModal: (value: ModalOpen) => void;
  isPublicPage?: boolean;
  customClass?: string;
}

export const LandingPageFooter: FC<LandingPageFooteProps> = ({
  setOpenModal,
  isPublicPage,
  listMenuFooter,
  customClass = '',
}) => {
  return (
    <div className={`${styles['footer-container']} ${customClass}`}>
      <Row justify="center">
        <Col span={22}>
          <div className={styles.footer}>
            <BodyText level={5} fontFamily="Roboto">
              © TISC 2022
            </BodyText>
            <div className={styles['menu-wrapper']}>
              <div className={styles.menu}>
                {listMenuFooter.map((item, index) => (
                  <BodyText
                    key={index}
                    level={5}
                    fontFamily="Roboto"
                    customClass={styles.item}
                    onClick={() => setOpenModal(item)}>
                    {item}
                  </BodyText>
                ))}
              </div>

              {isPublicPage ? null : (
                <BodyText
                  level={5}
                  fontFamily="Roboto"
                  customClass={styles['tisc-login']}
                  onClick={() => setOpenModal('Tisc Login')}>
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

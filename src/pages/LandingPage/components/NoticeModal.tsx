import { FC } from 'react';

import { ModalProps } from '../types';

import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './NoticeModal.less';

const browserRecommendVersion = [
  {
    name: 'Chrome',
    version: 32,
  },
  {
    name: 'Safari',
    version: 14,
  },
  {
    name: 'Edge',
    version: 18,
  },
  {
    name: 'Firefox',
    version: 65,
  },
  {
    name: 'Samsung Internet',
    version: 4,
  },
  {
    name: 'Opera',
    version: 19,
  },
];

export const NoticeModal: FC<ModalProps> = ({ visible, onClose, theme = 'default' }) => {
  const themeStyle = () => (theme === 'default' ? '' : '-dark');

  return (
    <CustomModal
      visible={visible}
      containerClass={theme === 'dark' && styles.modal}
      bodyStyle={{
        backgroundColor: theme === 'dark' ? '#000' : '',
        height: '576px',
      }}
      closeIconClass={theme === 'dark' && styles.closeIcon}
      onCancel={onClose}>
      <div className={styles.content}>
        <div className={styles.intro}>
          <MainTitle level={1} customClass={styles[`body${themeStyle()}`]}>
            Browser Compatibility Notice
          </MainTitle>
        </div>
        <div className={styles.text}>
          <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
            Our application platform uses the latest web format and standards.
            <br />
            For a better browsing experience and security, please update the current browser or
            download one of the below browsers with a compatible version.
          </BodyText>
          <div className={styles.content}>
            <div className={styles.leftItem}>
              {browserRecommendVersion.map((item, index) => (
                <BodyText
                  level={5}
                  fontFamily="Roboto"
                  customClass={styles[`body${themeStyle()}`]}
                  key={index}>
                  {item.name}
                </BodyText>
              ))}
            </div>
            <div className={styles.rigthItem}>
              {browserRecommendVersion.map((item, index) => (
                <BodyText
                  level={5}
                  fontFamily="Roboto"
                  customClass={styles[`body${themeStyle()}`]}
                  key={index}>
                  {`version ${item.version} or later`}
                </BodyText>
              ))}
            </div>
          </div>
          <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
            TISC Team
          </BodyText>
        </div>
      </div>
    </CustomModal>
  );
};

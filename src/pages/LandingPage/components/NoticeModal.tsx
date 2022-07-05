import styles from './NoticeModal.less';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';
import { FC } from 'react';
import { AboutModalProps } from '../types';

export const NoticeModal: FC<AboutModalProps> = ({ visible, onClose, theme = 'default' }) => {
  const themeStyle = () => (theme === 'default' ? '' : '-dark');

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
        <div className={styles.intro}>
          <MainTitle level={1} customClass={styles[`body${themeStyle()}`]}>
            Browser Compatibility Notice
          </MainTitle>
        </div>
        <div className={styles.text}>
          <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
            We have detected that you may be using an outdated browser that is not compatible with
            our application image file format. For a better browsing experience and security, you
            could either update the current browser or download one of the below browsers with a
            compatible version.
          </BodyText>
          <div className={styles.content}>
            <div className={styles.leftItem}>
              {['Chrome', 'Safari', 'Edge', 'Firefox', 'Samsung Internet', 'Opera'].map(
                (item, index) => (
                  <BodyText
                    level={5}
                    fontFamily="Roboto"
                    customClass={styles[`body${themeStyle()}`]}
                    key={index}
                  >
                    {item}
                  </BodyText>
                ),
              )}
            </div>
            <div className={styles.rigthItem}>
              {[
                'version 32 or later',
                'version 14 or later',
                'version 18 or later',
                'version 65 or later',
                'version 4 or later',
                'version 19 or later',
              ].map((item, index) => (
                <BodyText
                  level={5}
                  fontFamily="Roboto"
                  customClass={styles[`body${themeStyle()}`]}
                  key={index}
                >
                  {item}
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

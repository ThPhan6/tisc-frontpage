import styles from './NoticeModal.less';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';
import { FC } from 'react';
import { AboutModalProps } from '../types';

export const NoticeModal: FC<AboutModalProps> = ({ visible, theme = 'default' }) => {
  const themeStyle = () => (theme === 'default' ? '' : '-dark');

  return (
    <CustomModal
      visible={visible.value}
      footer={false}
      containerClass={theme === 'dark' && styles.modal}
      bodyStyle={{
        backgroundColor: theme === 'dark' ? '#000' : '',
      }}
      closeIconClass={theme === 'dark' && styles.closeIcon}
      onCancel={() => visible.setValue(false)}
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
              <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
                Chrome
              </BodyText>
              <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
                Safari
              </BodyText>
              <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
                Edge
              </BodyText>
              <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
                Firefox
              </BodyText>
              <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
                Samsung Internet
              </BodyText>
              <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
                Opera
              </BodyText>
            </div>
            <div className={styles.rigthItem}>
              <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
                version 32 or later
              </BodyText>
              <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
                version 14 or later
              </BodyText>
              <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
                version 18 or later
              </BodyText>
              <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
                version 65 or later
              </BodyText>
              <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
                version 4 or later
              </BodyText>
              <BodyText level={5} fontFamily="Roboto" customClass={styles[`body${themeStyle()}`]}>
                version 19 or later
              </BodyText>
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

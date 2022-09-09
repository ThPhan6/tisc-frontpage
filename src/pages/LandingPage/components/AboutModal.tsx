import { FC } from 'react';

import { ModalProps } from '../types';

import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './AboutModal.less';

export const AboutModal: FC<ModalProps> = ({ visible, onClose, theme = 'default' }) => {
  const themeStyle = () => (theme === 'default' ? '' : '-dark');

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
        <div className={styles.intro}>
          <div className={styles.vision}>
            <BodyText level={5} customClass={styles[`body${themeStyle()}`]} fontFamily="Roboto">
              Our Vision
            </BodyText>
            <MainTitle level={2} customClass={styles[`body${themeStyle()}`]}>
              To enrich our living space with ease.
            </MainTitle>
          </div>
          <div className={styles.mission}>
            <BodyText level={5} customClass={styles[`body${themeStyle()}`]} fontFamily="Roboto">
              Our Mission
            </BodyText>
            <MainTitle level={2} customClass={styles[`body${themeStyle()}`]}>
              To accelerate the digital transformation of the design & construction eco-system
              globally.
            </MainTitle>
          </div>
        </div>
        <div className={styles.text}>
          <BodyText level={5} customClass={styles[`body${themeStyle()}`]} fontFamily="Roboto">
            Our service is the only unified solution that provides intelligence on project
            visibility, product selection, and precision marketing for brand manufacturers who need
            better sales leads, higher revenue stream and greater resource-saving.
          </BodyText>
          <BodyText level={5} customClass={styles[`body${themeStyle()}`]} fontFamily="Roboto">
            Our platform is also a cloud-based material library that offers product search and
            specification automation tools for design offices that want faster project turnaround,
            lower operation costs and superior team productivity.
          </BodyText>
        </div>
      </div>
    </CustomModal>
  );
};

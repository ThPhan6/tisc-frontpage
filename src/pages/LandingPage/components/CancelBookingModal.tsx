import { FC } from 'react';

import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as ClockIcon } from '@/assets/icons/clock-icon.svg';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as InternetIcon } from '@/assets/icons/internet-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';

import { ModalProps } from '../types';

import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle, Title } from '@/components/Typography';

import styles from './CalendarModal.less';

export const CancelBookingModal: FC<ModalProps> = ({ visible, onClose }) => {
  return (
    <CustomModal
      title={<MainTitle level={2}>Are you sure to cancel the booking?</MainTitle>}
      bodyStyle={{
        height: '576px',
        padding: '32px',
      }}
      className={styles.calendar}
      visible={visible}
      onCancel={onClose}
      footer={false}>
      <div className={styles.title}>
        <Title level={8}>Your Information</Title>
      </div>
      <div style={{ height: 'calc(100vh - 556px)' }}>
        <div className={styles.information}>
          <BrandIcon />
          <BodyText level={5} fontFamily="Roboto">
            Brand / Company Name
          </BodyText>
        </div>
        <div className={styles.information}>
          <InternetIcon />
          <BodyText level={5} fontFamily="Roboto">
            company website
          </BodyText>
        </div>
        <div className={styles.information}>
          <UserIcon />
          <BodyText level={5} fontFamily="Roboto">
            firstname lastname
          </BodyText>
        </div>
        <div className={styles.information}>
          <EmailIcon />
          <BodyText level={5} fontFamily="Roboto">
            work email
          </BodyText>
        </div>
        <div className={styles.information}>
          <ClockIcon />
          <BodyText level={5} fontFamily="Roboto">
            GMT +8:00 Singapore Standard Time
          </BodyText>
        </div>
        <Title
          level={8}
          style={{
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '32px',
          }}>
          Tue, Nov 07 2022 2:00pm - 3:00am
        </Title>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'right',
          alignItems: 'center',
        }}>
        <CustomButton properties="rounded" buttonClass={styles.button}>
          Cancel Booking
        </CustomButton>
      </div>
    </CustomModal>
  );
};

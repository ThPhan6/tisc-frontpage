import { FC } from 'react';

import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as ClockIcon } from '@/assets/icons/clock-icon.svg';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as InternetIcon } from '@/assets/icons/internet-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';

import { deleteBooking } from '../services/api';

import { InformationBooking, ModalProps, Timezones } from '../types';

import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle, Title } from '@/components/Typography';

import styles from './CalendarModal.less';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';
import moment from 'moment';

interface CancelBookingProps extends ModalProps {
  informationBooking: InformationBooking;
}

export const BrandInformation: FC<{ informationBooking: InformationBooking }> = ({
  informationBooking,
}) => {
  return (
    <>
      <div className={styles.title}>
        <Title level={8}>Your Information</Title>
      </div>
      <div style={{ height: 'calc(100vh - 556px)' }}>
        <div className={styles.information}>
          <BrandIcon />
          <BodyText level={5} fontFamily="Roboto">
            {informationBooking.brand_name}
          </BodyText>
        </div>
        <div className={styles.information}>
          <InternetIcon />
          <BodyText level={5} fontFamily="Roboto">
            {informationBooking.website}
          </BodyText>
        </div>
        <div className={styles.information}>
          <UserIcon />
          <BodyText level={5} fontFamily="Roboto">
            {informationBooking.name}
          </BodyText>
        </div>
        <div className={styles.information}>
          <EmailIcon />
          <BodyText level={5} fontFamily="Roboto">
            {informationBooking.email}
          </BodyText>
        </div>
        <div className={styles.information}>
          <ClockIcon />
          <BodyText level={5} fontFamily="Roboto">
            {Timezones[informationBooking.timezone]}
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
          {moment(informationBooking.date).format('ddd, MMM DD YYYY')}
          {informationBooking.start_time_text && (
            <span style={{ marginLeft: '16px' }}>
              {informationBooking.start_time_text} - {informationBooking.end_time_text}
            </span>
          )}
        </Title>
      </div>
    </>
  );
};

export const CancelBookingModal: FC<CancelBookingProps> = ({
  visible,
  onClose,
  informationBooking,
}) => {
  const onCancelBooking = () => {
    showPageLoading();
    deleteBooking(informationBooking.id).then((isSuccess) => {
      if (isSuccess) {
        onClose();
      }
      hidePageLoading();
    });
  };

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
      <BrandInformation informationBooking={informationBooking} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <CustomButton properties="rounded" buttonClass={styles.button} onClick={onCancelBooking}>
          Cancel Booking
        </CustomButton>
      </div>
    </CustomModal>
  );
};

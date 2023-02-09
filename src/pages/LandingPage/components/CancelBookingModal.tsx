import { FC } from 'react';

import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as ClockIcon } from '@/assets/icons/clock-icon.svg';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as InternetIcon } from '@/assets/icons/internet-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';

import { useReCaptcha } from '../hook';
import { deleteBooking } from '../services/api';
import { useLandingPageStyles } from './hook';

import { InformationBooking, Timezones } from '../types';
import { CustomModalProps } from '@/components/Modal/types';
import { useAppSelector } from '@/reducers';
import { closeModal, modalPropsSelector } from '@/reducers/modal';

import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle, Title } from '@/components/Typography';

import styles from './CalendarModal.less';
import moment from 'moment';

interface CancelBookingProps {
  informationBooking?: InformationBooking;
}

export const BrandInformation: FC<CancelBookingProps> = ({ informationBooking }) => {
  if (!informationBooking) {
    return null;
  }

  return (
    <>
      <div className={styles.title}>
        <Title level={8}>Your Information</Title>
      </div>
      <div style={{ height: 'calc(512px - 152px)' }}>
        <div className={styles.information}>
          <span>
            <BrandIcon />
          </span>
          <BodyText level={5} fontFamily="Roboto">
            {informationBooking.brand_name}
          </BodyText>
        </div>
        <div className={styles.information}>
          <span>
            <InternetIcon />
          </span>
          <BodyText level={5} fontFamily="Roboto">
            {informationBooking.website}
          </BodyText>
        </div>
        <div className={styles.information}>
          <span>
            <UserIcon />
          </span>
          <BodyText level={5} fontFamily="Roboto">
            {informationBooking.name}
          </BodyText>
        </div>
        <div className={styles.information}>
          <span>
            <EmailIcon />
          </span>
          <BodyText level={5} fontFamily="Roboto">
            {informationBooking.email}
          </BodyText>
        </div>
        <div className={styles.information}>
          <span>
            <ClockIcon />
          </span>
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
          }}
        >
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

export const CancelBookingModal: FC<CancelBookingProps & CustomModalProps> = ({ ...props }) => {
  const popupStylesProps = useLandingPageStyles();
  const { informationBooking } = useAppSelector(modalPropsSelector);
  const { handleReCaptchaVerify } = useReCaptcha();

  const onCancelBooking = async () => {
    const captcha = (await handleReCaptchaVerify()) || '';
    if (informationBooking) {
      deleteBooking(informationBooking.id, { captcha: captcha }).then((isSuccess) => {
        if (isSuccess) {
          closeModal();
        }
      });
    }
  };

  return (
    <CustomModal
      {...popupStylesProps}
      {...props}
      title={
        <MainTitle level={2} textAlign="center">
          Are you sure to cancel the booking?
        </MainTitle>
      }
      bodyStyle={{
        height: '512px',
        padding: '32px',
      }}
      className={styles.calendar}
    >
      {!informationBooking ? (
        <BodyText fontFamily="Roboto" level={5}>
          Something wrong!
        </BodyText>
      ) : (
        <>
          <BrandInformation informationBooking={informationBooking} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <CustomButton
              properties="rounded"
              buttonClass={styles.button}
              onClick={onCancelBooking}
            >
              Cancel Booking
            </CustomButton>
          </div>
        </>
      )}
    </CustomModal>
  );
};

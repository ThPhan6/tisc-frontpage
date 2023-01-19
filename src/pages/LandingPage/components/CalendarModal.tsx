import { FC, useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { Calendar, Col, Collapse, Row } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as PaginationLeftIcon } from '@/assets/icons/pagination-left.svg';
import { ReactComponent as PaginationRightIcon } from '@/assets/icons/pagination-right.svg';

import { useReCaptcha } from '../hook';
import { createBooking, getListAvailableTime, updateBooking } from '../services/api';
import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';

import { AvailableTime, InformationBooking, Timezones } from '../types';
import { CollapsingProps } from '@/features/how-to/types';
import { useAppSelector } from '@/reducers';
import { closeModal, modalPropsSelector } from '@/reducers/modal';

import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle, Title } from '@/components/Typography';

import { endDate, getAvailableDateInMonth, startDate } from '../util';
import { DEFAULT_STATE_BOOKING } from './BrandInterestedModal';
import styles from './CalendarModal.less';
import { BrandInformation } from './CancelBookingModal';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';
import moment, { Moment } from 'moment';

interface TimeZoneProps extends CollapsingProps {
  timeZone: string;
}

const TimeZoneHeader: FC<TimeZoneProps> = (props) => {
  const { timeZone, activeKey, handleActiveCollapse } = props;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
      onClick={() => handleActiveCollapse(timeZone ? 1 : -1)}
    >
      <Title
        level={8}
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {timeZone}
      </Title>
      {String(1) !== activeKey ? <DropdownIcon /> : <DropupIcon />}
    </div>
  );
};

const CalendarHeader: FC<{ dateValue: Moment; onChange: (dateValue: Moment) => void }> = ({
  dateValue,
  onChange,
}) => {
  return (
    <div
      style={{
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
      }}
    >
      <PaginationLeftIcon
        className={dateValue.month() === startDate.month() ? styles.disableIcon : styles.icon}
        onClick={() => {
          if (dateValue.month() === startDate.month()) {
            return;
          }
          onChange(moment(dateValue).subtract(1, 'months'));
        }}
      />
      <BodyText level={2}>{moment(dateValue).format('MMM YYYY')}</BodyText>
      <PaginationRightIcon
        className={endDate.month() === dateValue.month() ? styles.disableIcon : styles.icon}
        onClick={() => {
          if (endDate.month() === moment(dateValue).month()) {
            return;
          }
          onChange(moment(dateValue).add(1, 'months'));
        }}
      />
    </div>
  );
};

export const CalendarModal = () => {
  const { informationBooking, reScheduleBooking } = useAppSelector(modalPropsSelector);
  const { handleReCaptchaVerify } = useReCaptcha();
  const [bookingInfo, setBookingInfo] = useState<InformationBooking>(informationBooking);

  /// open modal

  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);

  const [activeKey, setActiveKey] = useState<string>('');

  const { isTablet, isMobile } = useScreen();

  const [timeBooked, setTimeBooked] = useState<{
    startTime: string;
    endTime: string;
    slot: number;
    date: string;
    timeZone: string;
  }>({ startTime: '', endTime: '', slot: -1, date: '', timeZone: '' });

  const haveAvailableTimeSlot = useBoolean();

  useEffect(() => {
    if (bookingInfo.slot === -1 && reScheduleBooking) {
      haveAvailableTimeSlot.setValue(false);
    } else {
      haveAvailableTimeSlot.setValue(true);
    }
  }, [bookingInfo.slot]);

  useEffect(() => {
    setTimeBooked({
      startTime: bookingInfo.start_time_text,
      endTime: bookingInfo.end_time_text,
      slot: bookingInfo.slot,
      date: bookingInfo.date,
      timeZone: bookingInfo.timezone,
    });
  }, []);

  useEffect(() => {
    getListAvailableTime(bookingInfo.date, bookingInfo.timezone).then((res) => {
      setAvailableTimes(res);
    });
  }, [bookingInfo.date, bookingInfo.timezone]);

  const checkDisableButton = () => {
    if (
      bookingInfo.date === null ||
      bookingInfo.slot === -1 ||
      bookingInfo.timezone === '' ||
      (timeBooked.slot === bookingInfo.slot &&
        timeBooked.date === bookingInfo.date &&
        timeBooked.timeZone === bookingInfo.timezone)
    ) {
      return true;
    }
    return false;
  };

  const renderListTimeZone = () => {
    return (
      <>
        {Object.keys(Timezones).map((key) => (
          <BodyText
            level={5}
            fontFamily="Roboto"
            customClass={`${styles.timeZoneText} ${
              bookingInfo.timezone === key ? styles.activeText : ''
            }`}
            onClick={() => {
              setBookingInfo({
                ...bookingInfo,
                timezone: key,
                slot: -1,
                start_time_text: '',
                end_time_text: '',
              });
              setActiveKey('');
            }}
          >
            {Timezones[key]}
          </BodyText>
        ))}
      </>
    );
  };

  const checkActiveAvailableTime = (time: AvailableTime) => {
    if (haveAvailableTimeSlot.value) {
      return bookingInfo.slot === time.slot;
    }
    return (
      timeBooked.slot === time.slot &&
      timeBooked.date === bookingInfo.date &&
      timeBooked.timeZone === bookingInfo.timezone
    );
  };

  const renderListAvailableTime = () => {
    return (
      <div className={styles.customText}>
        {availableTimes.map((time) => (
          <BodyText
            level={5}
            fontFamily="Roboto"
            customClass={`${styles.text} ${time.available ? '' : styles.disableText} ${
              checkActiveAvailableTime(time) ? styles.selectedText : ''
            }`}
            onClick={() => {
              if (time.available) {
                setBookingInfo({
                  ...bookingInfo,
                  start_time_text: moment(time.start, 'HH:mm').format('hh:mm a'),
                  end_time_text: moment(time.end, 'HH:mm').format('hh:mm a'),
                  slot: time.slot,
                });
              }
            }}
          >
            {moment(time.start, 'HH:mm').format('hh:mm a')} -{' '}
            {moment(time.end, 'HH:mm').format('hh:mm a')}
          </BodyText>
        ))}
      </div>
    );
  };

  const handleAddAppointment = async () => {
    showPageLoading();
    const captcha = (await handleReCaptchaVerify()) || '';
    const handleSubmit = reScheduleBooking
      ? updateBooking(bookingInfo.id, {
          date: bookingInfo.date,
          slot: bookingInfo.slot,
          timezone: bookingInfo.timezone,
          captcha: captcha,
        })
      : createBooking({
          brand_name: bookingInfo.brand_name,
          website: bookingInfo.website,
          name: bookingInfo.name,
          email: bookingInfo.email,
          date: bookingInfo.date,
          slot: bookingInfo.slot,
          timezone: bookingInfo.timezone,
          captcha: captcha,
        });

    handleSubmit.then((isSuccess) => {
      if (isSuccess) {
        setBookingInfo(DEFAULT_STATE_BOOKING);
        closeModal();

        pushTo(PATH.landingPage);
      }
      hidePageLoading();
    });
  };

  const contentStylesProps = isTablet
    ? {
        marginBottom: 32,
      }
    : undefined;

  return (
    <CustomModal
      visible
      onOk={closeModal}
      onCancel={closeModal}
      secondaryModal
      noHeaderBorder={false}
      className={styles.modalContainer}
      width={isTablet ? 576 : 1152}
      closeIconClass={styles.closeIcon}
      title={
        <MainTitle level={2} textAlign="center">
          {reScheduleBooking ? 'Re-select Date & Time' : 'Select Available Date & Time'}
        </MainTitle>
      }
    >
      <Row
        gutter={[32, 0]}
        style={{
          flexDirection: isTablet ? 'column' : undefined,
          padding: isMobile ? 20 : 32,
        }}
        className={styles.calendar}
      >
        <Col span={24} lg={8} style={contentStylesProps}>
          <Calendar
            fullscreen={false}
            value={moment(bookingInfo.date)}
            headerRender={({ value, onChange }) => (
              <CalendarHeader dateValue={moment(value)} onChange={onChange} />
            )}
            validRange={[moment(), endDate]}
            onSelect={(date) => {
              setBookingInfo({
                ...bookingInfo,
                date: getAvailableDateInMonth(date),
                start_time_text: '',
                end_time_text: '',
                slot: -1,
              });
            }}
            disabledDate={(date) => {
              if (moment(date).day() % 6 == 0) {
                return true;
              }
              return false;
            }}
          />
        </Col>
        <Col span={24} lg={8} style={contentStylesProps}>
          <div className={styles.timeSelection}>
            <Collapse ghost activeKey={activeKey}>
              <Collapse.Panel
                showArrow={false}
                key={1}
                className={`${styles.timeZone} ${
                  String(1) !== activeKey ? styles['bottomMedium'] : ''
                }`}
                header={
                  <TimeZoneHeader
                    timeZone={Timezones[bookingInfo.timezone]}
                    activeKey={activeKey}
                    handleActiveCollapse={() =>
                      setActiveKey(activeKey === String(1) ? '' : String(1))
                    }
                  />
                }
              >
                {renderListTimeZone()}
              </Collapse.Panel>
            </Collapse>
            {renderListAvailableTime()}
          </div>
        </Col>
        <Col span={24} lg={8}>
          <BrandInformation
            informationBooking={
              haveAvailableTimeSlot.value
                ? bookingInfo
                : {
                    ...bookingInfo,
                    date: timeBooked.date,
                    start_time_text: timeBooked.startTime,
                    end_time_text: timeBooked.endTime,
                    timezone: timeBooked.timeZone,
                    slot: timeBooked.slot,
                  }
            }
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <CustomButton
              properties="rounded"
              buttonClass={`${styles.button} ${checkDisableButton() ? styles.disableButton : ''}`}
              onClick={checkDisableButton() ? undefined : handleAddAppointment}
            >
              Book Now
            </CustomButton>
          </div>
        </Col>
      </Row>
    </CustomModal>
  );
};

import { FC, useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { Calendar, Col, Collapse, Row } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as PaginationLeftIcon } from '@/assets/icons/pagination-left.svg';
import { ReactComponent as PaginationRightIcon } from '@/assets/icons/pagination-right.svg';

import { createBooking, getListAvailableTime, updateBooking } from '../services/api';
import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';

import { AvailableTime, InformationBooking, Timezones } from '../types';
import { CollapsingProps } from '@/features/how-to/types';
import { closeModal } from '@/reducers/modal';

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

export const useCalendarModal = (
  informationBooking: InformationBooking,
  setInformationBooking: (informationBooking: InformationBooking) => void,
) => {
  const bookingId = useGetParamId();
  const isUpdateBooking = bookingId ? true : false;

  /// open modal
  const [open, setOpen] = useState(false);

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
    if (informationBooking.slot === -1 && isUpdateBooking) {
      haveAvailableTimeSlot.setValue(false);
    } else {
      haveAvailableTimeSlot.setValue(true);
    }
  }, [informationBooking.slot]);

  useEffect(() => {
    setTimeBooked({
      startTime: informationBooking.start_time_text,
      endTime: informationBooking.end_time_text,
      slot: informationBooking.slot,
      date: informationBooking.date,
      timeZone: informationBooking.timezone,
    });
  }, []);

  useEffect(() => {
    getListAvailableTime(informationBooking.date, informationBooking.timezone).then((res) => {
      setAvailableTimes(res);
    });
  }, [informationBooking.date, informationBooking.timezone]);

  const checkDisableButton = () => {
    if (
      informationBooking.date === null ||
      informationBooking.slot === -1 ||
      informationBooking.timezone === '' ||
      (timeBooked.slot === informationBooking.slot &&
        timeBooked.date === informationBooking.date &&
        timeBooked.timeZone === informationBooking.timezone)
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
              informationBooking.timezone === key ? styles.activeText : ''
            }`}
            onClick={() => {
              setInformationBooking({
                ...informationBooking,
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
      return informationBooking.slot === time.slot;
    }
    return (
      timeBooked.slot === time.slot &&
      timeBooked.date === informationBooking.date &&
      timeBooked.timeZone === informationBooking.timezone
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
            onClick={() =>
              time.available &&
              setInformationBooking({
                ...informationBooking,
                start_time_text: moment(time.start, 'HH:mm').format('hh:mm a'),
                end_time_text: moment(time.end, 'HH:mm').format('hh:mm a'),
                slot: time.slot,
              })
            }
          >
            {moment(time.start, 'HH:mm').format('hh:mm a')} -{' '}
            {moment(time.end, 'HH:mm').format('hh:mm a')}
          </BodyText>
        ))}
      </div>
    );
  };

  const handleAddAppointment = () => {
    showPageLoading();
    const handleSubmit = isUpdateBooking
      ? updateBooking(informationBooking.id, {
          date: informationBooking.date,
          slot: informationBooking.slot,
          timezone: informationBooking.timezone,
        })
      : createBooking({
          brand_name: informationBooking.brand_name,
          website: informationBooking.website,
          name: informationBooking.name,
          email: informationBooking.email,
          date: informationBooking.date,
          slot: informationBooking.slot,
          timezone: informationBooking.timezone,
        });

    handleSubmit.then((isSuccess) => {
      if (isSuccess) {
        setInformationBooking(DEFAULT_STATE_BOOKING);
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

  const renderCalendarModal = () =>
    !open ? null : (
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
            {isUpdateBooking ? 'Re-select Date & Time' : 'Select Available Date & Time'}
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
              value={moment(informationBooking.date)}
              headerRender={({ value, onChange }) => (
                <CalendarHeader dateValue={moment(value)} onChange={onChange} />
              )}
              validRange={[moment(), endDate]}
              onSelect={(date) => {
                setInformationBooking({
                  ...informationBooking,
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
                      timeZone={Timezones[informationBooking.timezone]}
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
                  ? informationBooking
                  : {
                      ...informationBooking,
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

  return {
    renderCalendarModal,
    openCalendarModal: () => setOpen(true),
  };
};

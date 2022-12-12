import { FC, useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { Calendar, Col, Collapse, Row } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as PaginationLeftIcon } from '@/assets/icons/pagination-left.svg';
import { ReactComponent as PaginationRightIcon } from '@/assets/icons/pagination-right.svg';

import { createBooking, getListAvailableTime, updateBooking } from '../services/api';
import { pushTo } from '@/helper/history';

import { AvailableTime, InformationBooking, ModalProps, Timezones } from '../types';
import { CollapsingProps } from '@/features/how-to/types';

import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle, Title } from '@/components/Typography';

import { endDate, getAvailableDateInMonth, startDate } from '../util';
import styles from './CalendarModal.less';
import { BrandInformation } from './CancelBookingModal';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';
import moment, { Moment } from 'moment';

interface CalendarModalProps extends ModalProps {
  informationBooking: InformationBooking;
  isUpdateBooking: boolean;
  onChangeValue: (informationBooking: InformationBooking) => void;
}
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
      onClick={() => handleActiveCollapse(timeZone ? 1 : -1)}>
      <Title
        level={8}
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
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
      }}>
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

export const CalendarModal: FC<CalendarModalProps> = ({
  visible,
  onClose,
  informationBooking,
  isUpdateBooking,
  onChangeValue,
}) => {
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);

  const [activeKey, setActiveKey] = useState<string>('');

  useEffect(() => {
    getListAvailableTime(informationBooking.date, informationBooking.timezone).then((res) => {
      setAvailableTimes(res);
    });
  }, [informationBooking.date, informationBooking.timezone]);

  const checkDisableButton = () => {
    if (
      informationBooking.date === null ||
      informationBooking.slot === -1 ||
      informationBooking.timezone === ''
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
            style={{
              height: '36px',
              alignItems: 'center',
              display: 'flex',
              cursor: 'pointer',
            }}
            onClick={() => {
              onChangeValue({ ...informationBooking, timezone: key });
              setActiveKey('');
            }}>
            {Timezones[key]}
          </BodyText>
        ))}
      </>
    );
  };

  const renderListAvailableTime = () => {
    return (
      <div style={{ padding: '8px 16px' }}>
        {availableTimes.map((time) => (
          <BodyText
            level={5}
            fontFamily="Roboto"
            customClass={`${styles.text} ${time.available ? '' : styles.disableText} ${
              informationBooking.slot === time.slot ? styles.selectedText : ''
            }`}
            onClick={() =>
              time.available &&
              onChangeValue({
                ...informationBooking,
                start_time_text: time.start,
                end_time_text: time.end,
                slot: time.slot,
              })
            }>
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
        onClose();
        pushTo(PATH.landingPage);
      }
      hidePageLoading();
    });
  };

  return (
    <div>
      <CustomModal
        visible={visible}
        footer={false}
        width="1152px"
        bodyStyle={{
          height: '576px',
          padding: '32px',
        }}
        className={styles.calendar}
        title={
          <MainTitle level={2}>
            {isUpdateBooking ? 'Re-select Date & Time' : 'Select Available Date & Time'}
          </MainTitle>
        }
        onCancel={onClose}>
        <Row gutter={[32, 0]}>
          <Col span={8}>
            <Calendar
              fullscreen={false}
              value={moment(informationBooking.date)}
              headerRender={({ value, onChange }) => (
                <CalendarHeader dateValue={moment(value)} onChange={onChange} />
              )}
              validRange={[moment(), endDate]}
              onSelect={(date) => {
                onChangeValue({
                  ...informationBooking,
                  date: getAvailableDateInMonth(date),
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
          <Col span={8}>
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
                  }>
                  {renderListTimeZone()}
                </Collapse.Panel>
              </Collapse>
              {renderListAvailableTime()}
            </div>
          </Col>
          <Col span={8}>
            <BrandInformation informationBooking={informationBooking} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <CustomButton
                properties="rounded"
                buttonClass={`${styles.button} ${checkDisableButton() ? styles.disableButton : ''}`}
                onClick={checkDisableButton() ? undefined : handleAddAppointment}>
                Book Now
              </CustomButton>
            </div>
          </Col>
        </Row>
      </CustomModal>
    </div>
  );
};

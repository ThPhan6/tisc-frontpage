import { FC, useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { Calendar, Col, Collapse, Row } from 'antd';

import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as ClockIcon } from '@/assets/icons/clock-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as InternetIcon } from '@/assets/icons/internet-icon.svg';
import { ReactComponent as PaginationLeftIcon } from '@/assets/icons/pagination-left.svg';
import { ReactComponent as PaginationRightIcon } from '@/assets/icons/pagination-right.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';

import { createBooking, getListAvailableTime, updateBooking } from '../services/api';
import { pushTo } from '@/helper/history';

import { AvailableTime, InformationBooking, ModalProps, Timezones } from '../types';
import { CollapsingProps } from '@/features/how-to/types';

import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle, Title } from '@/components/Typography';

import styles from './CalendarModal.less';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';
import { Moment } from 'moment';
import moment from 'moment-timezone';

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

const currentDate = moment();
const defaultDate = moment(moment(), 'DD-MM-YYYY').add(90, 'days');

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
        className={dateValue.month() === currentDate.month() ? styles.disableIcon : styles.icon}
        onClick={() => {
          if (dateValue.month() === currentDate.month()) {
            return;
          }
          onChange(moment(dateValue).subtract(1, 'months'));
        }}
      />
      <BodyText level={2}>{moment(dateValue).format('MMM YYYY')}</BodyText>
      <PaginationRightIcon
        className={defaultDate.month() === dateValue.month() ? styles.disableIcon : styles.icon}
        onClick={() => {
          if (defaultDate.month() === moment(dateValue).month()) {
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
  // const [dateChosen, setDateChosen] = useState<Moment>(moment().add(24, 'hours'));

  const [timeChosen, setTimeChosen] = useState<{ start: string; end: string; slot: number }>({
    start: '',
    end: '',
    slot: informationBooking.slot,
  });

  // const [timeZoneChosen, setTimeZoneChosen] = useState<{ id: string; name: string }>({
  //   id: 'Asia/Singapore',
  //   name: Timezones['Asia/Singapore'],
  // });

  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);

  const [activeKey, setActiveKey] = useState<string>('');

  const handleChangeDate = (date: Moment) => {
    // setDateChosen(moment(date));
    onChangeValue({ ...informationBooking, date: moment(date).format('YYYY-MM-DD') });
  };

  useEffect(() => {
    getListAvailableTime(informationBooking.date).then((res) => {
      setAvailableTimes(res);
      setTimeChosen({ start: '', end: '', slot: -1 });
    });
  }, [informationBooking.date]);

  useEffect(() => {
    if (timeChosen.slot === -1) {
      setTimeChosen({ start: '', end: '', slot: informationBooking.slot });
    }
  }, [timeChosen]);

  console.log(timeChosen);
  const renderAvailableTimes = (time: string) => {
    const selectedDateTime = `${informationBooking.date} ${time}`;
    const defaultTime = moment.tz(selectedDateTime, 'Asia/Singapore');
    const dateTimeByTimeZone = defaultTime.clone().tz(informationBooking.timezone);
    const startTime = moment(dateTimeByTimeZone).format('HH:mm:ss');
    const endTime = moment(startTime, 'HH:mm').add(60, 'minutes').format('hh:mm a');
    return `${moment(startTime, 'HH:mm').format('hh:mm a')} - ${endTime}`;
  };

  const checkDisableButton = () => {
    if (
      informationBooking.date === null ||
      timeChosen.slot === -1 ||
      informationBooking.timezone === ''
    ) {
      return true;
    }
    return false;
  };

  const hanleAddAppointment = () => {
    showPageLoading();
    const handleSubmit = isUpdateBooking
      ? updateBooking(informationBooking.id, {
          date: informationBooking.date,
          slot: timeChosen.slot,
          timezone: informationBooking.timezone,
        })
      : createBooking({
          brand_name: informationBooking.brand_name,
          website: informationBooking.website,
          name: informationBooking.name,
          email: informationBooking.email,
          date: informationBooking.date,
          slot: timeChosen.slot,
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
              onChange={handleChangeDate}
              headerRender={({ value, onChange }) => (
                <CalendarHeader dateValue={moment(value)} onChange={onChange} />
              )}
              validRange={[currentDate, defaultDate]}
              onSelect={(date) => {
                if (defaultDate.diff(date) < 0) {
                  // setDateChosen(defaultDate);
                  onChangeValue({
                    ...informationBooking,
                    date: moment(defaultDate).format('YYYY-MM-DD'),
                  });
                }
                if (currentDate.diff(date) > 0) {
                  // setDateChosen(currentDate);
                  onChangeValue({
                    ...informationBooking,
                    date: moment(currentDate).format('YYYY-MM-DD'),
                  });
                }
                if (moment(date).day() % 6 == 0) {
                  // setDateChosen(moment(date).day('Friday'));
                  onChangeValue({
                    ...informationBooking,
                    date: moment(date).day('Friday').format('YYYY-MM-DD'),
                  });
                }
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
                        // setTimeZoneChosen({ id: key, name: Timezones[key] });
                        onChangeValue({ ...informationBooking, timezone: key });
                        setActiveKey('');
                      }}>
                      {Timezones[key]}
                    </BodyText>
                  ))}
                </Collapse.Panel>
              </Collapse>
              <div style={{ padding: '8px 16px' }}>
                {availableTimes.map((time) => (
                  <BodyText
                    level={5}
                    fontFamily="Roboto"
                    customClass={`${styles.text} ${time.available ? '' : styles.disableText} ${
                      timeChosen.slot === time.slot ? styles.selectedText : ''
                    }`}
                    onClick={() =>
                      time.available &&
                      setTimeChosen({ start: time.start, end: time.end, slot: time.slot })
                    }>
                    {renderAvailableTimes(time.start)}
                  </BodyText>
                ))}
              </div>
            </div>
          </Col>
          <Col span={8}>
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
                {timeChosen.start && (
                  <span style={{ marginLeft: '16px' }}>
                    {renderAvailableTimes(timeChosen.start)}
                  </span>
                )}
              </Title>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'right',
                alignItems: 'center',
              }}>
              <CustomButton
                properties="rounded"
                buttonClass={`${styles.button} ${checkDisableButton() ? styles.disableButton : ''}`}
                onClick={checkDisableButton() ? undefined : hanleAddAppointment}>
                Book Now
              </CustomButton>
            </div>
          </Col>
        </Row>
      </CustomModal>
    </div>
  );
};

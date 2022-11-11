import { FC } from 'react';

import { Calendar, Col, Collapse, Row } from 'antd';

import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as ClockIcon } from '@/assets/icons/clock-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as EmailIcon } from '@/assets/icons/email-icon-18px.svg';
import { ReactComponent as InternetIcon } from '@/assets/icons/internet-icon.svg';
import { ReactComponent as UserIcon } from '@/assets/icons/user-icon-18px.svg';

import { ModalProps } from '../types';

import CustomButton from '@/components/Button';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle, Title } from '@/components/Typography';

import styles from './CalendarModal.less';

export const CalendarModal: FC<ModalProps> = ({ visible, onClose }) => {
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
        title={<MainTitle level={2}>Select Available Date & Time</MainTitle>}
        onCancel={onClose}>
        <Row gutter={[24, 16]}>
          <Col span={8}>
            <Calendar headerRender={() => null} />
          </Col>
          <Col span={8}>
            <div className={styles.timeSelection}>
              <Collapse ghost>
                <Collapse.Panel
                  showArrow={false}
                  key={1}
                  header={
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}>
                      <Title level={8}>GMT +8:00 Singapore Standard Time</Title>
                      <div className={styles.icon}>
                        {1 !== 1 ? <DropdownIcon /> : <DropupIcon />}
                      </div>
                    </div>
                  }>
                  <BodyText
                    level={5}
                    fontFamily="Roboto"
                    style={{ height: '36px', alignItems: 'center' }}>
                    GMT +8:00 Singapore Standard Time
                  </BodyText>
                </Collapse.Panel>
              </Collapse>
              <div style={{ padding: '8px 16px' }}>
                <BodyText
                  level={5}
                  fontFamily="Roboto"
                  style={{
                    height: '48px',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                  }}>
                  8:00 am - 9:00 am
                </BodyText>
                <BodyText
                  level={5}
                  fontFamily="Roboto"
                  style={{
                    height: '48px',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                  }}>
                  9:00 am - 10:00 am
                </BodyText>
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
                Book Now
              </CustomButton>
            </div>
          </Col>
        </Row>
      </CustomModal>
    </div>
  );
};

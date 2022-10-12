import { FC } from 'react';

import Popover from '@/components/Modal/Popover';
import { RobotoBodyText, Title } from '@/components/Typography';

import styles from './styles/schedule-modal.less';

interface ScheduleModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const ScheduleModal: FC<ScheduleModalProps> = ({ visible, setVisible }) => {
  return (
    <Popover
      title="FINISH SCHEDULE"
      visible={visible}
      setVisible={setVisible}
      className={styles.modal}
      noFooter>
      <div className="flex-start" style={{ height: '24px', marginBottom: '8px' }}>
        <Title level={8}>Finish Schedule by Room</Title>
        <RobotoBodyText level={5} style={{ paddingLeft: '16px' }}>
          (select all relevant areas)
        </RobotoBodyText>
      </div>

      <table className={styles.description}>
        <thead>
          <tr style={{ height: '24px', boxShadow: '0 0.7px #000' }}>
            <th className={styles.borderBottom} style={{ width: '30%' }}>
              <RobotoBodyText level={5} style={{ fontWeight: 500 }}>
                CODE
              </RobotoBodyText>
            </th>
            <th style={{ width: '70%' }}>
              <RobotoBodyText level={5} style={{ fontWeight: 500 }}>
                DESCRIPTION
              </RobotoBodyText>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ minHeight: '18px' }}>
            <td>
              <RobotoBodyText level={5} style={{ paddingRight: '16px' }}>
                Lorem ipsum dolor sit
              </RobotoBodyText>
            </td>
            <td>
              <RobotoBodyText level={5}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur in quia iusto,
                itaque accusantium voluptatum iure! Obcaecati adipisci iure accusantium, eum eos
                deserunt sint in consequuntur deleniti voluptatum ad ea?
              </RobotoBodyText>
            </td>
          </tr>
        </tbody>
      </table>

      <table className={styles.mainInfo}>
        <thead>
          <tr>
            {[
              'FLOOR',
              'BASE',
              'FRONT WALL',
              'LEFT WALL',
              'BACK WALL',
              'RIGHT WALL',
              'CEILING',
              'DOOR',
              'CABINET',
            ].map((el) => (
              <th>
                <RobotoBodyText level={5} customClass={styles.title}>
                  {el}
                </RobotoBodyText>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ROOM ID-1</td>
            <td>ROOM NAME</td>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr>
        </tbody>
      </table>
    </Popover>
  );
};

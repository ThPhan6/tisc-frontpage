import { FC, Fragment, ReactNode, useEffect } from 'react';

import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import { getFinishScheduleList } from '@/features/project/services';
import { cloneDeep } from 'lodash';

import { setFinishScheduleData } from '@/features/product/reducers';
import store, { useAppSelector } from '@/reducers';

import Popover from '@/components/Modal/Popover';
import { RobotoBodyText, Title } from '@/components/Typography';

import { CodeOrderTabProps } from './CodeOrderTab';
import styles from './styles/schedule-modal.less';

type KeyField = 'ceiling' | 'floor' | 'frame' | 'panel' | 'carcass' | 'door';

interface ScheduleModalProps extends CodeOrderTabProps {
  materialCode: ReactNode | string;
  description: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const ScheduleModal: FC<ScheduleModalProps> = ({
  materialCode = '',
  description = '',
  projectProductId,
  roomIds,
  visible,
  setVisible,
}) => {
  const selectedRoomIds = roomIds.length ? roomIds.map((roomId) => roomId).join(',') : undefined;

  const finishSchedulesData = useAppSelector(
    (state) => state.product.details.specifiedDetail?.finish_schedules,
  );

  useEffect(() => {
    if (projectProductId) {
      getFinishScheduleList(projectProductId, selectedRoomIds ?? []);
    }
  }, [selectedRoomIds]);

  const onChangeData =
    (index: number, type: string, field?: KeyField) => (e: CheckboxChangeEvent) => {
      if (finishSchedulesData) {
        const dataClone = cloneDeep(finishSchedulesData);
        const newData = dataClone[index];
        if (field) {
          newData[type][field] = e.target.checked;
        } else {
          newData[type] = e.target.checked;
        }

        store.dispatch(setFinishScheduleData(dataClone));
      }
    };

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
                Code
              </RobotoBodyText>
            </th>
            <th style={{ width: '70%' }}>
              <RobotoBodyText level={5} style={{ fontWeight: 500 }}>
                Description
              </RobotoBodyText>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ minHeight: '18px' }}>
            <td>
              <RobotoBodyText level={5} style={{ paddingRight: '16px' }}>
                {materialCode ?? ''}
              </RobotoBodyText>
            </td>
            <td>
              <RobotoBodyText level={5}>{description ?? ''}</RobotoBodyText>
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
          {finishSchedulesData?.map((el, index) => {
            return (
              <Fragment key={el.id ?? index}>
                <tr className={styles.groupRoomInfo}>
                  <td>
                    <RobotoBodyText level={6} customClass={styles.roomInfo}>
                      {el.room_id_text}
                    </RobotoBodyText>
                  </td>
                  <td>
                    <RobotoBodyText level={6} customClass={styles.roomInfo}>
                      {el.room_name}
                    </RobotoBodyText>
                  </td>
                </tr>

                <tr key={el.id ?? index} className={styles.groupRoom}>
                  <td>
                    <Checkbox
                      className={styles.checkBoxCenter}
                      checked={el.floor}
                      onChange={onChangeData(index, 'floor')}
                    />
                  </td>
                  <td>
                    <tr>
                      <td>
                        <Checkbox
                          className={styles.rowInfo}
                          checked={el.base.ceiling}
                          onChange={onChangeData(index, 'base', 'ceiling')}>
                          <RobotoBodyText level={7} customClass={styles.text}>
                            Ceiling
                          </RobotoBodyText>
                        </Checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Checkbox
                          className={styles.rowInfo}
                          checked={el.base.floor}
                          onChange={onChangeData(index, 'base', 'floor')}>
                          <RobotoBodyText level={7} customClass={styles.text}>
                            Floor
                          </RobotoBodyText>
                        </Checkbox>
                      </td>
                    </tr>
                  </td>
                  <td>
                    <Checkbox
                      className={styles.checkBoxCenter}
                      checked={el.front_wall}
                      onChange={onChangeData(index, 'front_wall')}
                    />
                  </td>
                  <td>
                    <Checkbox
                      className={styles.checkBoxCenter}
                      checked={el.left_wall}
                      onChange={onChangeData(index, 'left_wall')}
                    />
                  </td>
                  <td>
                    <Checkbox
                      className={styles.checkBoxCenter}
                      checked={el.back_wall}
                      onChange={onChangeData(index, 'back_wall')}
                    />
                  </td>
                  <td>
                    <Checkbox
                      className={styles.checkBoxCenter}
                      checked={el.right_wall}
                      onChange={onChangeData(index, 'right_wall')}
                    />
                  </td>
                  <td>
                    <Checkbox
                      className={styles.checkBoxCenter}
                      checked={el.ceiling}
                      onChange={onChangeData(index, 'ceiling')}
                    />
                  </td>
                  <td>
                    <tr>
                      <td>
                        <Checkbox
                          className={styles.rowInfo}
                          checked={el.door.frame}
                          onChange={onChangeData(index, 'door', 'frame')}>
                          <RobotoBodyText level={7} customClass={styles.text}>
                            Frame
                          </RobotoBodyText>
                        </Checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Checkbox
                          className={styles.rowInfo}
                          checked={el.door.panel}
                          onChange={onChangeData(index, 'door', 'panel')}>
                          <RobotoBodyText level={7} customClass={styles.text}>
                            Panel
                          </RobotoBodyText>
                        </Checkbox>
                      </td>
                    </tr>
                  </td>
                  <td>
                    <tr>
                      <td>
                        <Checkbox
                          className={styles.rowInfo}
                          checked={el.cabinet.carcass}
                          onChange={onChangeData(index, 'cabinet', 'carcass')}>
                          <RobotoBodyText level={7} customClass={styles.text}>
                            Carcass
                          </RobotoBodyText>
                        </Checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Checkbox
                          className={styles.rowInfo}
                          checked={el.cabinet.door}
                          onChange={onChangeData(index, 'cabinet', 'door')}>
                          <RobotoBodyText level={7} customClass={styles.text}>
                            Door
                          </RobotoBodyText>
                        </Checkbox>
                      </td>
                    </tr>
                  </td>
                </tr>

                <tr style={{ height: '18px' }}></tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </Popover>
  );
};

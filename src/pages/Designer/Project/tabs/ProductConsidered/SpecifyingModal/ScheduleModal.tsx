import { FC, Fragment, ReactNode, useEffect, useState } from 'react';

import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import { getFinishScheduleList } from '@/features/project/services';

import { FinishScheduleRequestBody } from './types';

import Popover from '@/components/Modal/Popover';
import { RobotoBodyText, Title } from '@/components/Typography';

import { CodeOrderTabProps } from './CodeOrderTab';
import styles from './styles/schedule-modal.less';

export interface RoomFinishScheduleInfo {
  id: string;
  project_product_id: string;
  room_id: string;
  room_id_text: string;
  room_name: string;
  floor: boolean;
  base_ceiling: boolean;
  base_floor: boolean;
  front_wall: boolean;
  left_wall: boolean;
  back_wall: boolean;
  right_wall: boolean;
  ceiling: boolean;
  door_frame: boolean;
  door_panel: boolean;
  cabinet_carcass: boolean;
  cabinet_door: boolean;
}

type FieldName = keyof Omit<
  RoomFinishScheduleInfo,
  'id' | 'project_product_id' | 'room_id' | 'room_id_text' | 'room_name'
>;

interface ScheduleModalProps extends CodeOrderTabProps {
  materialCode: ReactNode | string;
  description: string;
  onChange: (data: FinishScheduleRequestBody[]) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const ScheduleModal: FC<ScheduleModalProps> = ({
  materialCode = '',
  description = '',
  projectProductId,
  roomIds,
  onChange,
  visible,
  setVisible,
}) => {
  const selectedRoomIds = roomIds.length ? roomIds.map((roomId) => roomId).join(',') : undefined;
  const [finishSchedules, setFinishSchedule] = useState<RoomFinishScheduleInfo[]>([]);

  console.log('finishSchedules', finishSchedules);
  console.log('projectProductId', projectProductId);
  console.log('selectedRoomIds', selectedRoomIds);

  useEffect(() => {
    if (projectProductId) {
      getFinishScheduleList(projectProductId, selectedRoomIds ?? []).then((res) => {
        if (res) {
          setFinishSchedule(
            res.map((el) => ({
              id: el.id ?? '',
              project_product_id: el.project_product_id,
              room_id: el.room_id,
              room_id_text: el.room_id_text,
              room_name: el.room_name,
              floor: el.floor,
              base_ceiling: el.base.ceiling,
              base_floor: el.base.floor,
              front_wall: el.front_wall,
              left_wall: el.left_wall,
              back_wall: el.back_wall,
              right_wall: el.right_wall,
              ceiling: el.ceiling,
              door_frame: el.door.frame,
              door_panel: el.door.panel,
              cabinet_carcass: el.cabinet.carcass,
              cabinet_door: el.cabinet.door,
            })),
          );
        }
      });
    }
  }, [selectedRoomIds]);

  const onChangeData =
    (fieldName: FieldName, groupRoom: RoomFinishScheduleInfo) => (e: CheckboxChangeEvent) => {
      groupRoom[fieldName] = e.target.checked;
      onChange([
        {
          floor: groupRoom.floor,
          base: {
            ceiling: groupRoom.base_ceiling,
            floor: groupRoom.base_floor,
          },
          front_wall: groupRoom.front_wall,
          left_wall: groupRoom.left_wall,
          back_wall: groupRoom.back_wall,
          right_wall: groupRoom.right_wall,
          ceiling: groupRoom.ceiling,
          door: {
            frame: groupRoom.door_frame,
            panel: groupRoom.door_panel,
          },
          cabinet: {
            carcass: groupRoom.cabinet_carcass,
            door: groupRoom.cabinet_door,
          },
        },
      ]);
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
          {finishSchedules?.map((el, index) => {
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
                      onChange={onChangeData('floor', el)}
                    />
                  </td>
                  <td>
                    <tr>
                      <td>
                        <Checkbox
                          className={styles.rowInfo}
                          checked={el.base_ceiling}
                          onChange={onChangeData('base_ceiling', el)}>
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
                          checked={el.base_floor}
                          onChange={onChangeData('base_floor', el)}>
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
                      onChange={onChangeData('front_wall', el)}
                    />
                  </td>
                  <td>
                    <Checkbox
                      className={styles.checkBoxCenter}
                      checked={el.left_wall}
                      onChange={onChangeData('left_wall', el)}
                    />
                  </td>
                  <td>
                    <Checkbox
                      className={styles.checkBoxCenter}
                      checked={el.back_wall}
                      onChange={onChangeData('back_wall', el)}
                    />
                  </td>
                  <td>
                    <Checkbox
                      className={styles.checkBoxCenter}
                      checked={el.right_wall}
                      onChange={onChangeData('right_wall', el)}
                    />
                  </td>
                  <td>
                    <Checkbox
                      className={styles.checkBoxCenter}
                      checked={el.ceiling}
                      onChange={onChangeData('ceiling', el)}
                    />
                  </td>
                  <td>
                    <tr>
                      <td>
                        <Checkbox
                          className={styles.rowInfo}
                          checked={el.door_frame}
                          onChange={onChangeData('door_frame', el)}>
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
                          checked={el.door_panel}
                          onChange={onChangeData('door_panel', el)}>
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
                          checked={el.cabinet_carcass}
                          onChange={onChangeData('cabinet_carcass', el)}>
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
                          checked={el.cabinet_door}
                          onChange={onChangeData('cabinet_door', el)}>
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

import { FC, Fragment, ReactNode, useEffect } from 'react';

import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import { getFinishScheduleList } from '@/features/project/services';
import { cloneDeep } from 'lodash';

import { setFinishScheduleData } from '@/features/product/reducers';
import store, { useAppSelector } from '@/reducers';

import Popover from '@/components/Modal/Popover';
import { RobotoBodyText } from '@/components/Typography';
import { updateCustomProductSpecifiedDetail } from '@/pages/Designer/Products/CustomLibrary/slice';

import { CodeOrderTabProps } from './CodeOrderTab';
import styles from './styles/schedule-modal.less';

const mainTitle = [
  'FLOOR',
  'BASE BOARD',
  'FRONT WALL',
  'LEFT WALL',
  'BACK WALL',
  'RIGHT WALL',
  'CEILING',
  'DOOR',
  'CABINET',
];

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
  customProduct,
}) => {
  const selectedRoomIds = roomIds.length ? roomIds.map((roomId) => roomId).join(',') : undefined;

  const finishSchedulesData = useAppSelector((state) =>
    customProduct
      ? state.customProduct.details.specifiedDetail?.finish_schedules
      : state.product.details.specifiedDetail?.finish_schedules,
  );

  useEffect(() => {
    if (projectProductId) {
      getFinishScheduleList(projectProductId, selectedRoomIds ?? [], customProduct);
    }
  }, [selectedRoomIds, customProduct]);

  const onChangeData =
    (index: number, type: string, field?: KeyField) => (e: CheckboxChangeEvent) => {
      if (finishSchedulesData) {
        const newScheduleData = cloneDeep(finishSchedulesData);
        const newData = newScheduleData[index];
        if (field) {
          newData[type][field] = e.target.checked;
        } else {
          newData[type] = e.target.checked;
        }
        if (customProduct) {
          store.dispatch(
            updateCustomProductSpecifiedDetail({
              finish_schedules: newScheduleData,
            }),
          );
        } else {
          store.dispatch(setFinishScheduleData(newScheduleData));
        }
      }
    };

  return (
    <Popover
      title="FINISH ROOM SCHEDULE"
      visible={visible}
      setVisible={setVisible}
      secondaryModal
      className={styles.modal}
      width={1100}
      // only for close modal
      onFormSubmit={() => setVisible(false)}
    >
      <table className={styles.description}>
        <thead>
          <tr style={{ height: '24px', borderBottom: 'solid 0.7px #000' }}>
            <th>
              <RobotoBodyText level={7} customClass={styles.textBold} style={{ paddingRight: 16 }}>
                Code
              </RobotoBodyText>
            </th>
            <th>
              <RobotoBodyText level={7} customClass={styles.textBold}>
                Description
              </RobotoBodyText>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ minHeight: '18px' }}>
            <td style={{ whiteSpace: 'nowrap', width: '60px' }}>
              <RobotoBodyText
                level={7}
                customClass={styles.textThick}
                style={{ paddingRight: '16px' }}
              >
                {materialCode ?? ''}
              </RobotoBodyText>
            </td>
            <td>
              <RobotoBodyText level={7} customClass={styles.textThick}>
                {description ?? ''}
              </RobotoBodyText>
            </td>
          </tr>
        </tbody>
      </table>

      <table className={styles.mainInfo}>
        <thead className={styles.backgroundDark}>
          <tr>
            {mainTitle.map((el) => (
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
                  <td colSpan={8}>
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
                    <Checkbox
                      className={styles.rowInfo}
                      checked={el.base.ceiling}
                      onChange={onChangeData(index, 'base', 'ceiling')}
                    >
                      <RobotoBodyText level={7} customClass={styles.text}>
                        Ceiling Level
                      </RobotoBodyText>
                    </Checkbox>
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
                    <Checkbox
                      className={styles.rowInfo}
                      checked={el.door.frame}
                      onChange={onChangeData(index, 'door', 'frame')}
                    >
                      <RobotoBodyText level={7} customClass={styles.text}>
                        Door Frame
                      </RobotoBodyText>
                    </Checkbox>
                  </td>
                  <td>
                    <Checkbox
                      className={styles.rowInfo}
                      checked={el.cabinet.carcass}
                      onChange={onChangeData(index, 'cabinet', 'carcass')}
                    >
                      <RobotoBodyText level={7} customClass={styles.text}>
                        Cabinet Carcass
                      </RobotoBodyText>
                    </Checkbox>
                  </td>
                </tr>
                <tr className={styles.groupRoom}>
                  <td></td>
                  <td>
                    <Checkbox
                      className={styles.rowInfo}
                      checked={el.base.floor}
                      onChange={onChangeData(index, 'base', 'floor')}
                    >
                      <RobotoBodyText level={7} customClass={styles.text}>
                        Floor Level
                      </RobotoBodyText>
                    </Checkbox>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <Checkbox
                      className={styles.rowInfo}
                      checked={el.door.panel}
                      onChange={onChangeData(index, 'door', 'panel')}
                    >
                      <RobotoBodyText level={7} customClass={styles.text}>
                        Door Panel
                      </RobotoBodyText>
                    </Checkbox>
                  </td>
                  <td>
                    <Checkbox
                      className={styles.rowInfo}
                      checked={el.cabinet.door}
                      onChange={onChangeData(index, 'cabinet', 'door')}
                    >
                      <RobotoBodyText level={7} customClass={styles.text}>
                        Cabinet Door
                      </RobotoBodyText>
                    </Checkbox>
                  </td>
                </tr>

                <tr className={styles.borderTop}>
                  <td colSpan={9}></td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </Popover>
  );
};

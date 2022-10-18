import { FC, useEffect, useState } from 'react';

import { ItemType } from 'antd/lib/menu/hooks/useItems';

import { getFullName } from '@/helper/utils';
import { getActionTaskList, updateActionTaskStatus } from '@/pages/Brand/GeneralInquiries/services';

import { ActionTaskModelParams, ActionTaskProps } from '@/pages/Brand/GeneralInquiries/types';

import CustomPlusButton from '../Table/components/CustomPlusButton';
import { CustomDropDown } from '@/features/product/components';

import { MainTitle, RobotoBodyText } from '../Typography';
import { ActionTaskModal } from './modal';
import styles from './table.less';
import moment from 'moment';

enum ActionTaskStatus {
  'To-Do-List',
  'In Progress',
  'Cancelled',
  'Completed',
}

export const ActionTaskTable: FC<ActionTaskModelParams> = ({ model_id, model_name }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [reloadTable, setReloadTable] = useState<boolean>(false);

  const [actionTaskList, setActionTaskList] = useState<ActionTaskProps[]>([]);

  useEffect(() => {
    getActionTaskList({ model_id: model_id, model_name: model_name }).then(setActionTaskList);
  }, [reloadTable === true && modalVisible === false]);

  const renderStatusDropdown = (record: ActionTaskProps) => {
    const handleClickStatus = (curStatus: number, newStatus: number) => {
      if (curStatus === newStatus) return;

      updateActionTaskStatus(record.id, newStatus).then((isSuccess) => {
        if (isSuccess) {
          getActionTaskList({ model_id: model_id, model_name: model_name }).then(setActionTaskList);
        }
      });
    };

    const menuItems: ItemType[] = [
      {
        key: ActionTaskStatus['Completed'],
        label: 'Completed',
        onClick: () => {
          handleClickStatus(record.status, ActionTaskStatus['Completed']);
        },
      },
      {
        key: ActionTaskStatus['To-Do-List'],
        label: 'To-Do-List',
        onClick: () => {
          handleClickStatus(record.status, ActionTaskStatus['To-Do-List']);
        },
      },
      {
        key: ActionTaskStatus['In Progress'],
        label: 'In Progress',
        onClick: () => {
          handleClickStatus(record.status, ActionTaskStatus['In Progress']);
        },
      },
      {
        key: ActionTaskStatus['Cancelled'],
        label: 'Cancelled',
        onClick: () => {
          handleClickStatus(record.status, ActionTaskStatus['Cancelled']);
        },
      },
    ];

    return (
      <CustomDropDown
        alignRight={false}
        textCapitalize={false}
        items={menuItems}
        viewAllTop
        placement="bottomRight"
        menuStyle={{ width: 160, height: 'auto' }}
        labelProps={{ className: 'flex-start' }}>
        <RobotoBodyText level={6}>{ActionTaskStatus[record.status]}</RobotoBodyText>
      </CustomDropDown>
    );
  };

  return (
    <div>
      <div className={styles.actionTask}>
        <div className={styles.actionTask_content} onClick={() => setModalVisible(true)}>
          <MainTitle level={4} customClass={styles.actionTask_text}>
            Actions/Tasks
          </MainTitle>
          <CustomPlusButton size={18} />
        </div>
      </div>
      <table className={styles.tableActionTask}>
        <thead>
          <tr className={styles.title}>
            <th>
              <RobotoBodyText level={6}>Date</RobotoBodyText>
            </th>
            <th>
              <RobotoBodyText level={6}>Actions</RobotoBodyText>
            </th>
            <th>
              <RobotoBodyText level={6}>Teams</RobotoBodyText>
            </th>
            <th>
              <RobotoBodyText level={6}>Status</RobotoBodyText>
            </th>
          </tr>
        </thead>
        <tbody>
          {actionTaskList.map((el: ActionTaskProps, index) => {
            return (
              <tr key={el.id ?? index}>
                <td>
                  <RobotoBodyText level={6}>
                    {moment(el.created_at).format('YYYY-MM-DD')}
                  </RobotoBodyText>
                </td>
                <td>
                  <RobotoBodyText level={6}>{el.action_name}</RobotoBodyText>
                </td>
                <td>
                  <RobotoBodyText level={6}>{getFullName(el)}</RobotoBodyText>
                </td>
                <td>{renderStatusDropdown(el)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {modalVisible ? (
        <ActionTaskModal
          visible={modalVisible}
          setVisible={setModalVisible}
          setReloadTable={setReloadTable}
          model_id={model_id}
          model_name={model_name}
        />
      ) : null}
    </div>
  );
};

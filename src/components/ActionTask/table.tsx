import { FC, useEffect, useState } from 'react';

import {
  ProjectRequestStatus,
  ProjectTrackingNotificationStatus,
} from '@/pages/Brand/ProjectTracking/constant';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

import { getFullName } from '@/helper/utils';
import {
  getActionTaskList,
  getGeneralInquirySummary,
  updateActionTaskStatus,
} from '@/pages/Brand/GeneralInquiries/services';
import { getProjectTrackingSummary } from '@/services/project-tracking.api';
import { cloneDeep } from 'lodash';

import { ActionTaskModalProps, ActionTaskProps } from '@/pages/Brand/GeneralInquiries/types';
import store, { useAppSelector } from '@/reducers';
import { ModalType, openModal } from '@/reducers/modal';

import CustomPlusButton from '../Table/components/CustomPlusButton';
import { CustomDropDown } from '@/features/product/components';

import { MainTitle, RobotoBodyText } from '../Typography';
import { setActionTaskModalVisible, setReloadActionTaskTable } from './slice';
import styles from './table.less';
import moment from 'moment';

enum ActionTaskStatus {
  'To-Do-List',
  'In Progress',
  'Cancelled',
  'Completed',
}

export const ActionTaskTable: FC<ActionTaskModalProps> = ({ setData, indexItem }) => {
  const {
    reloadActionTaskTable: reloadTable,
    modalVisible,
    model_id,
    model_name,
  } = useAppSelector((state) => state.actionTasks);

  const [actionTaskList, setActionTaskList] = useState<ActionTaskProps[]>([]);

  const updateData = () => {
    setData?.((prevData) => {
      const newData = cloneDeep(prevData);
      if (model_name === 'request') {
        newData.projectRequests[Number(indexItem)].status = ProjectRequestStatus.Responded;
      } else {
        newData.notifications[Number(indexItem)].status =
          ProjectTrackingNotificationStatus['Followed-up'];
      }
      return newData;
    });
  };

  // console.log('model_id && model_name', model_id, model_name);

  useEffect(() => {
    if (model_id && model_name !== 'none') {
      getActionTaskList({ model_id, model_name }).then(setActionTaskList);
      if (reloadTable) {
        if (model_name === 'inquiry') {
          getGeneralInquirySummary();
        } else {
          getProjectTrackingSummary();
          updateData();
        }
      }
    }

    return () => setActionTaskList([]);
  }, [reloadTable === true && modalVisible === false, model_id && model_name !== 'none']);

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
        labelProps={{ className: 'flex-between' }}
      >
        <RobotoBodyText level={6}>{ActionTaskStatus[record.status]}</RobotoBodyText>
      </CustomDropDown>
    );
  };

  const getModalType = () => {
    let modalType: ModalType = 'none';

    if (model_name === 'notification' || model_name === 'inquiry' || model_name === 'request') {
      modalType = 'Actions Tasks';
    }

    return modalType;
  };

  return (
    <div>
      <div className={styles.actionTask}>
        <div
          className={styles.actionTask_content}
          onClick={() => {
            store.dispatch(setActionTaskModalVisible(true));
            store.dispatch(setReloadActionTaskTable(false));
            store.dispatch(
              openModal({
                type: getModalType(),
                title: 'SELECT ACTIONS/TASKS',
              }),
            );
          }}
        >
          <MainTitle level={4} customClass={styles.actionTask_text}>
            Actions/Tasks
          </MainTitle>
          <CustomPlusButton size={18} />
        </div>
      </div>

      <div style={{ overflow: 'auto' }}>
        <table className={styles.tableActionTask}>
          <thead>
            <tr className={styles.title}>
              <th style={{ minWidth: 75 }}>
                <RobotoBodyText level={6}>Date</RobotoBodyText>
              </th>
              <th style={{ width: '89%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                  <td style={{ whiteSpace: 'nowrap' }}>{renderStatusDropdown(el)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!actionTaskList.length ? (
          <div className={styles.noContent}>
            <RobotoBodyText level={6}>no actions/tasks yet</RobotoBodyText>
          </div>
        ) : null}
      </div>
    </div>
  );
};

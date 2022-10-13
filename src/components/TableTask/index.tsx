import { FC } from 'react';

import { Popover } from 'antd';

import { useBoolean } from '@/helper/hook';
import { setDefaultWidthForEachColumn } from '@/helper/utils';

// import { getProjectTrackingPagination } from '@/services/project-tracking.api';
import { TableColumnItem } from '../Table/types';
import { InquiryMessageTask } from '@/pages/Brand/GeneralInquiries/types';

import CustomPlusButton from '../Table/components/CustomPlusButton';

import { HeaderDropdown } from '../HeaderDropdown';
import CustomTable from '../Table';
import { BodyText, RobotoBodyText } from '../Typography';
import styles from './index.less';
import moment from 'moment';

interface TableTaskProps {
  tasks?: InquiryMessageTask;
}
export const TableTask: FC<TableTaskProps> = (tasks) => {
  const openModal = useBoolean(false);
  const mainColumns: TableColumnItem<InquiryMessageTask>[] = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: '70',
      render: (value) => <RobotoBodyText>{moment(value).format('YYYY-MM-DD')}</RobotoBodyText>,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
    },
    {
      title: 'Teams',
      dataIndex: 'teams',
    },
    {
      title: 'Tasks',
      dataIndex: 'tasks',
      render: () => (
        <div className={styles.taskDropDown}>
          <HeaderDropdown />
        </div>
      ),
    },
  ];
  return (
    <>
      <div className={styles.actionTask} onClick={() => openModal.setValue(true)}>
        <BodyText level={3} customClass={styles.text}>
          Actions/Tasks
        </BodyText>
        <CustomPlusButton size={18} />
      </div>

      <CustomTable
        columns={setDefaultWidthForEachColumn(mainColumns, 2)}
        fetchDataFunc={() => {}}
      />
      <Popover
        title="SELECT ACTIONS/TASKS"
        visible={openModal.value}
        setVisible={() => openModal.setValue(false)}
        groupCheckboxList={tasks}
      />
    </>
  );
};

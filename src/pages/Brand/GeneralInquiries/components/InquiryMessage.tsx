import { useEffect, useState } from 'react';

import {
  getActionTaskPagination,
  getInquiryMessageActionTask,
  getInquiryMessageForGeneralInquiry,
} from '../services';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { useBoolean } from '@/helper/hook';
import { setDefaultWidthForEachColumn } from '@/helper/utils';

import { InquiryMessageOfGeneralInquiry, InquiryMessageTask } from '../types';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { TableColumnItem } from '@/components/Table/types';

import BrandProductBasicHeader from '@/components/BrandProductBasicHeader';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import TextForm from '@/components/Form/TextForm';
import Popover from '@/components/Modal/Popover';
import CustomTable from '@/components/Table';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText, RobotoBodyText } from '@/components/Typography';

import styles from '../detail.less';
import { StatusDropDown } from './StatusDropDown';
import moment from 'moment';

const DEFAULT_STATE = {
  inquiry_for: '',
  title: '',
  message: '',
  role: '',
  tasks: [],
};

export const InquiryMessage = () => {
  useAutoExpandNestedTableColumn(0, { rightColumnExcluded: 1 });
  const openModal = useBoolean(false);
  const [inquiryMessageData, setInquiryMessageData] =
    useState<InquiryMessageOfGeneralInquiry>(DEFAULT_STATE);
  const [actionTasks, setActionTasks] = useState<CheckboxValue[]>([
    { label: 'con', value: 0 },
    { label: 'con 1', value: 1 },
    { label: 'con 2', value: 2 },
    { label: 'con 3', value: 3 },
  ]);

  useEffect(() => {
    getInquiryMessageForGeneralInquiry().then((res) => {
      if (res) {
        setInquiryMessageData(res);
      }
    });

    getInquiryMessageActionTask().then((res) => {
      if (res) {
        setActionTasks(
          res.map((el) => ({
            label: el.name,
            value: el.id,
          })),
        );
      }
    });
  }, []);

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
          <StatusDropDown />
        </div>
      ),
    },
  ];

  return (
    <div>
      <BrandProductBasicHeader
        image=""
        text_1=""
        text_2=""
        text_3=""
        customClass={styles.brandProduct}
      />

      <TextForm boxShadow label="Inquiry For">
        {inquiryMessageData.inquiry_for}
      </TextForm>

      <TextForm boxShadow label="Title">
        {inquiryMessageData.title}
      </TextForm>

      <FormGroup
        label="Message"
        layout="vertical"
        labelColor="mono-color-dark"
        formClass={styles.messageForm}>
        <CustomTextArea
          value={inquiryMessageData.message}
          borderBottomColor="mono-medium"
          disabled
        />
      </FormGroup>

      <div className={styles.actionTask} onClick={() => openModal.setValue(true)}>
        <BodyText level={3} customClass={styles.text}>
          Actions/Tasks
        </BodyText>
        <CustomPlusButton size={18} />
      </div>

      <CustomTable
        columns={setDefaultWidthForEachColumn(mainColumns, 2)}
        fetchDataFunc={getActionTaskPagination}
      />

      <Popover
        title="SELECT ACTIONS/TASKS"
        visible={openModal.value}
        setVisible={(visible) => (visible ? undefined : openModal.setValue(false))}
        groupCheckboxList={actionTasks}
      />
    </div>
  );
};

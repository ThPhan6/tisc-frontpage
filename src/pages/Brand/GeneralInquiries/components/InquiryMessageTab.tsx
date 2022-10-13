import { FC } from 'react';

import { getActionTaskPagination } from '../services';
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

export const InquiryMessageTab: FC<
  InquiryMessageOfGeneralInquiry & { actionTaskData: CheckboxValue[] }
> = ({
  title,
  inquiry_for,
  message,
  product_collection,
  product_description,
  product_image,
  official_website,
  actionTaskData,
}) => {
  useAutoExpandNestedTableColumn(0, { rightColumnExcluded: 1 });
  const openModal = useBoolean(false);
  // const [actionTasks, setActionTasks] = useState<CheckboxValue[]>([]);

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
        image={product_image}
        text_1={product_collection}
        text_2={product_description}
        text_3={official_website}
        customClass={styles.brandProduct}
      />

      <TextForm boxShadow label="Inquiry For">
        {inquiry_for || ''}
      </TextForm>

      <TextForm boxShadow label="Title">
        {title || ''}
      </TextForm>

      <FormGroup
        label="Message"
        layout="vertical"
        labelColor="mono-color-dark"
        formClass={styles.messageForm}>
        <CustomTextArea value={message || ''} borderBottomColor="mono-medium" disabled />
      </FormGroup>

      <div className={styles.actionTask}>
        <div className={styles.actionTask_content} onClick={() => openModal.setValue(true)}>
          <BodyText level={3} customClass={styles.actionTask_text}>
            Actions/Tasks
          </BodyText>
          <CustomPlusButton size={18} />
        </div>
      </div>

      <CustomTable
        columns={setDefaultWidthForEachColumn(mainColumns, 2)}
        fetchDataFunc={getActionTaskPagination}
      />

      <Popover
        title="SELECT ACTIONS/TASKS"
        visible={openModal.value}
        setVisible={(visible) => (visible ? undefined : openModal.setValue(false))}
        groupCheckboxList={actionTaskData}
        className={styles.actionTaskList}
      />
    </div>
  );
};

import { useEffect, useRef, useState } from 'react';

import { FilterValues, GlobalFilter } from './constants/filters';
import { PATH } from '@/constants/path';

import { ReactComponent as NotificationIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';
import { ReactComponent as PendingIcon } from '@/assets/icons/pending-icon.svg';
import { ReactComponent as RespondedIcon } from '@/assets/icons/responded-icon.svg';

import { getGeneralInquiryPagination } from './services';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { pushTo } from '@/helper/history';
import { setDefaultWidthForEachColumn } from '@/helper/utils';

import { GeneralInquiryListProps } from './types';
import { TableColumnItem } from '@/components/Table/types';
import { useAppSelector } from '@/reducers';

import { GeneralInquiryContainer } from './components/GeneralInquiryContainer';
import CustomTable from '@/components/Table';
import { RobotoBodyText } from '@/components/Typography';

import styles from './index.less';
import moment from 'moment';

const GeneralInquiries = () => {
  useAutoExpandNestedTableColumn(0, { rightColumnExcluded: 1 });
  const tableRef = useRef<any>();
  const [legendModalVisible, setLegendModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);
  const userId = useAppSelector((state) => state.user.user?.id);

  /// reload table depends on filter
  useEffect(() => {
    tableRef.current.reload();
  }, [selectedFilter]);

  const mainColumns: TableColumnItem<GeneralInquiryListProps>[] = [
    {
      title: 'Date',
      dataIndex: 'created_at',
      width: '70',
      sorter: true,
      render: (value, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RobotoBodyText level={5}>{moment(value).format('YYYY-MM-DD')}</RobotoBodyText>
          {/* check if user has readed or hasn't readed*/}
          {record.read.some((el) => el === userId) ? null : (
            <NotificationIcon style={{ marginLeft: '14px' }} />
          )}
        </div>
      ),
    },
    {
      title: 'Design Firm',
      dataIndex: 'design_firm',
      sorter: true,
    },
    {
      title: 'Firm Location',
      dataIndex: 'firm_location',
      sorter: true,
    },
    {
      title: 'Inquirer',
      dataIndex: 'inquirer',
    },
    {
      title: 'Inquiry For',
      dataIndex: 'inquiry_for',
      sorter: true,
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '5%',
      render: (_v, record) =>
        record.status === FilterValues.pending ? (
          <PendingIcon className="flex-center" style={{ width: '100%' }} />
        ) : (
          <RespondedIcon className="flex-center" style={{ width: '100%' }} />
        ),
    },
  ];
  return (
    <GeneralInquiryContainer
      visible={legendModalVisible}
      setVisible={setLegendModalVisible}
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      isShowFilter>
      <CustomTable
        title="GENERAL INQUIRIES"
        columns={setDefaultWidthForEachColumn(mainColumns, 5)}
        fetchDataFunc={getGeneralInquiryPagination}
        ref={tableRef}
        customClass={styles.customHeader}
        rightAction={
          <InfoIcon className={styles.iconInfor} onClick={() => setLegendModalVisible(true)} />
        }
        onRow={(rowRecord: GeneralInquiryListProps) => ({
          onClick: () => {
            // add userId to know that user is readed
            const userHasReaded = rowRecord.read.some((el) => el === userId);
            if (!userHasReaded && userId) {
              rowRecord.read.push(userId);
            }
            pushTo(PATH.brandGeneralInquiryDetail.replace(':id', rowRecord.id));
          },
        })}
        hasPagination
        extraParams={
          selectedFilter && selectedFilter.id !== FilterValues.global
            ? {
                filter: {
                  status: selectedFilter.id,
                },
              }
            : undefined
        }
      />
    </GeneralInquiryContainer>
  );
};
export default GeneralInquiries;

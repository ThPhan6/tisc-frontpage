import { useRef, useState } from 'react';

import { FilterValues, GlobalFilter } from '@/pages/Designer/Project/constants/filter';

import { ReactComponent as NotificationIcon } from '@/assets/icons/action-unreaded-icon.svg';

// import { getGeneralInquiryPagination } from './services';
import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { getProjectPagination } from '@/features/project/services';
import { setDefaultWidthForEachColumn } from '@/helper/utils';

import { GeneralInquiryProps } from './types';
import { TableColumnItem } from '@/components/Table/types';

import { GeneralInquiryContainer } from './components/GeneralInquiryContainer';
import CustomTable from '@/components/Table';
import { RobotoBodyText } from '@/components/Typography';

import moment from 'moment';

const GeneralInquiries = () => {
  useAutoExpandNestedTableColumn(0, { rightColumnExcluded: 1 });
  const tableRef = useRef<any>();
  const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);

  const mainColumns: TableColumnItem<GeneralInquiryProps>[] = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: '70',
      render: (value, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RobotoBodyText>{moment(value).format('YYYY-MM-DD')}</RobotoBodyText>
          {record.unreaded ? <NotificationIcon style={{ marginLeft: '14px' }} /> : null}
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
      title: 'Inquier',
      dataIndex: 'inquier',
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
    },
  ];
  return (
    <GeneralInquiryContainer
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      isShowFilter>
      <CustomTable
        title="GENERAL INQUIRIES"
        columns={setDefaultWidthForEachColumn(mainColumns, 5)}
        fetchDataFunc={getProjectPagination}
        ref={tableRef}
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

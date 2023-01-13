import { useEffect, useRef } from 'react';

import { PATH } from '@/constants/path';

import { ReactComponent as ViewIcon } from '@/assets/icons/eye-icon.svg';

import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { formatNumber } from '@/helper/utils';

import { ProjectListingResponse } from './type';
import { TableColumnItem } from '@/components/Table/types';

import { ProjectListingHeader } from './components/ProjectListingHeader';
import CustomTable from '@/components/Table';
import { ActionMenu } from '@/components/TableAction';

import { getProjectListingPagination } from './api';
import moment from 'moment';

const ProjectListing = () => {
  const tableRef = useRef<any>();
  const { isTablet } = useScreen();

  const handleViewProjectListing = (id: string) => {
    pushTo(PATH.tiscProjectListingDetail.replace(':id', id));
  };

  useEffect(() => {
    tableRef.current.reload();
  }, []);

  const MainColumns: TableColumnItem<ProjectListingResponse>[] = [
    {
      title: 'Created',
      sorter: true,
      dataIndex: 'created_at',
      defaultSortOrder: 'descend',
      render: (_value, record) => {
        return <span>{moment(record.created_at).format('YYYY-MM-DD')}</span>;
      },
    },
    {
      title: 'Name',
      sorter: true,
      dataIndex: 'name',
    },
    {
      title: 'Status',
      sorter: true,
      dataIndex: 'status',
    },
    {
      title: 'Country',
      sorter: true,
      dataIndex: 'country_name',
    },
    {
      title: 'City',
      sorter: true,
      dataIndex: 'city_name',
    },
    {
      title: 'Building Type',
      sorter: true,
      dataIndex: 'building_type',
    },
    {
      title: 'Project Type',
      sorter: true,
      dataIndex: 'project_type',
    },
    {
      title: 'Area (sq.m.)',
      dataIndex: 'metricArea',
      render: (_value, record) => {
        return <span>{formatNumber(record.metricArea)}</span>;
      },
    },
    {
      title: 'Area (sq.ft.)',
      dataIndex: 'imperialArea',
      render: (_value, record) => {
        return <span>{formatNumber(record.imperialArea)}</span>;
      },
    },
    {
      title: 'Products',
      dataIndex: 'productCount',
    },
    {
      title: 'Considered',
      lightHeading: true,
      dataIndex: 'consider',
    },
    {
      title: 'Unlisted',
      lightHeading: true,
      dataIndex: 'unlisted',
    },
    {
      title: 'Specified',
      lightHeading: true,
      dataIndex: 'specified',
    },
    {
      title: 'Cancelled',
      lightHeading: true,
      dataIndex: 'cancelled',
    },
    {
      title: 'Deleted',
      lightHeading: true,
      dataIndex: 'deleted',
    },
    {
      title: 'Action',
      width: '5%',
      align: 'center',
      render: (_value, record) => {
        if (isTablet) {
          return (
            <div className="flex-center">
              <ViewIcon onClick={() => handleViewProjectListing(record.id)} />
            </div>
          );
        }
        return (
          <ActionMenu
            actionItems={[
              {
                type: 'view',
                onClick: () => handleViewProjectListing(record.id),
              },
            ]}
          />
        );
      },
    },
  ];
  return (
    <ProjectListingHeader>
      <CustomTable
        columns={MainColumns}
        fetchDataFunc={getProjectListingPagination}
        title="PROJECT LISTING"
        hasPagination
        autoLoad={false}
        ref={tableRef}
        onRow={(rowRecord: ProjectListingResponse) => ({
          onClick: () => {
            pushTo(PATH.tiscProjectListingDetail.replace(':id', rowRecord.id));
          },
        })}
      />
    </ProjectListingHeader>
  );
};

export default ProjectListing;

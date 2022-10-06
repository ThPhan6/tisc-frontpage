import { useEffect, useRef, useState } from 'react';

import {
  FilterStatusIcons,
  FilterValues,
  GlobalFilter,
} from '@/pages/Designer/Project/constants/filter';
import { PageContainer } from '@ant-design/pro-layout';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

import { ReactComponent as UnreadIcon } from '@/assets/icons/action-unreaded-icon.svg';
import { ReactComponent as HighPriorityIcon } from '@/assets/icons/high-priority-icon.svg';
import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';
import { ReactComponent as LowPriorityIcon } from '@/assets/icons/low-priority-icon.svg';
import { ReactComponent as MidPriorityIcon } from '@/assets/icons/mid-priority-icon.svg';
import { ReactComponent as NonPriorityIcon } from '@/assets/icons/non-priority-icon.svg';
import { ReactComponent as UserAddIcon } from '@/assets/icons/user-add-icon.svg';

import { useAutoExpandNestedTableColumn } from '@/components/Table/hooks';
import { getProjectPagination } from '@/features/project/services';
import { getBrandSummary } from '@/features/user-group/services';
import { setDefaultWidthForEachColumn } from '@/helper/utils';
import { isEmpty } from 'lodash';

import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import { TableColumnItem } from '@/components/Table/types';
import { ProjecTrackingList, ProjectPriority } from '@/types/project-tracking.type';

import { LegendModal } from '../../../components/LegendModal/LegendModal';
// import AssignTeam from '@/components/AssignTeam';
import { MenuSummary } from '@/components/MenuSummary';
import CustomTable from '@/components/Table';
import TeamIcon from '@/components/TeamIcon/TeamIcon';
import { CustomDropDown } from '@/features/product/components';
import ProjectFilter from '@/pages/Designer/Project/components/ProjectListHeader/ProjectFilter';

import styles from './index.less';
import moment from 'moment';

const Priority = {
  non: 4,
  high: 5,
  mid: 6,
  low: 7,
};
const PriorityIcons = {
  [Priority.non]: <NonPriorityIcon className="icon-align" />,
  [Priority.high]: <HighPriorityIcon className="icon-align" />,
  [Priority.mid]: <MidPriorityIcon className="icon-align" />,
  [Priority.low]: <LowPriorityIcon className="icon-align" />,
};
const ProjectTracking = () => {
  useAutoExpandNestedTableColumn(0, { rightColumnExcluded: 1 });
  const tableRef = useRef<any>();
  const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);
  const [openInformationModal, setOpenInformationModal] = useState(false);
  const [summaryData, setSummaryData] = useState<DataMenuSummaryProps[]>([]);

  useEffect(() => {
    getBrandSummary().then((data) => {
      if (data) {
        setSummaryData(data);
      }
    });
  }, []);

  const renderPriorityDropdown = (_value: any, record: any) => {
    const menuItems: ItemType[] = [
      {
        key: ProjectPriority['Non'],
        label: 'Non',
        icon: <NonPriorityIcon />,
        onClick: () => {},
      },
      {
        key: ProjectPriority['High priority'],
        label: 'High priority',
        icon: <HighPriorityIcon />,
        onClick: () => {},
      },
      {
        key: ProjectPriority['Mid priority'],
        label: 'Mid priority',
        icon: <MidPriorityIcon />,
        onClick: () => {},
      },
      {
        key: ProjectPriority['Low priority'],
        label: 'Low priority',
        icon: <LowPriorityIcon />,
        onClick: () => {},
      },
    ];

    return (
      <CustomDropDown items={menuItems}>{PriorityIcons[record.priority] ?? 'n.a'}</CustomDropDown>
    );
  };
  const MainColumns: TableColumnItem<ProjecTrackingList>[] = [
    {
      title: 'Created',
      dataIndex: 'created',
      sorter: true,
      render: (value) => {
        return (
          <div>
            {moment(value).format('YYYY-MM-DD')} <UnreadIcon style={{ marginLeft: '8px' }} />
          </div>
        );
      },
    },
    {
      title: 'Project Name',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Project Location',
      dataIndex: 'location',
      sorter: true,
    },
    {
      title: 'Project Type',
      dataIndex: 'project_type',
      sorter: true,
    },
    {
      title: 'Design Firm',
      dataIndex: 'design_firm',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '5%',
      align: 'center',
      render: (value) => FilterStatusIcons[value] ?? 'n.a',
    },
    {
      title: 'Requests',
      dataIndex: 'requests',
      render: (_value, record) => {
        return (
          <div>
            {record.requests} <UnreadIcon style={{ marginLeft: '8px' }} />
          </div>
        );
      },
    },
    {
      title: 'Notifications',
      dataIndex: 'notifications',
      render: (_value, record) => {
        return (
          <div>
            {record.requests} <UnreadIcon style={{ marginLeft: '8px' }} />
          </div>
        );
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render: renderPriorityDropdown,
    },
    {
      title: 'Assign Team',
      dataIndex: 'assign_teams',
      align: 'center',
      render: (_value, record) => {
        if (isEmpty(record.assign_teams)) {
          return <UserAddIcon className="icon-align" />;
        }
        return (
          <div className={styles.asignTeamMember}>
            {record.assign_teams.map((teamProfile, key) => (
              <TeamIcon key={key} avatar={teamProfile.avatar} name={teamProfile.name} />
            ))}
          </div>
        );
      },
    },
    {
      title: 'Subscription',
      dataIndex: 'subscription',
      align: 'center',
      width: '5%',
    },
  ];

  return (
    <div>
      <PageContainer
        pageHeaderRender={() => {
          return (
            <div className={styles.customHeader}>
              <MenuSummary typeMenu={'brand'} menuSummaryData={summaryData} />
              <ProjectFilter
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
              />
            </div>
          );
        }}>
        <CustomTable
          title={'PROJECT TRACKING'}
          rightAction={
            <InfoIcon className={styles.iconInfor} onClick={() => setOpenInformationModal(true)} />
          }
          columns={setDefaultWidthForEachColumn(MainColumns, 4)}
          fetchDataFunc={getProjectPagination}
          extraParams={
            selectedFilter && selectedFilter.id !== FilterValues.global
              ? {
                  filter: {
                    status: selectedFilter.id,
                  },
                }
              : undefined
          }
          ref={tableRef}
          hasPagination
          autoLoad={false}
          customClass={styles.customTitle}
        />
      </PageContainer>
      <LegendModal visible={openInformationModal} setVisible={setOpenInformationModal} />
      {/* <AssignTeam
        visible={openAssignTeam}
        setVisible={setOpenAssignTeam}
        selected={selected}
        setSelected={handleSubmitAssignTeam}
        teams={assignTeam}
      /> */}
    </div>
  );
};
export default ProjectTracking;

import { message } from 'antd';
import { request } from 'umi';
import { MESSAGE_NOTIFICATION } from '@/constants/message';

import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import { ProjectListProps } from '@/types';

interface IProjectPaginationResponse {
  data: {
    projects: ProjectListProps[];
    pagination: PaginationResponse;
  };
}

export async function getProjectPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/project/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: IProjectPaginationResponse) => {
      const { projects, pagination } = response.data;
      callback({
        data: projects,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
      });
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_LIST_FAILED);
    });
}

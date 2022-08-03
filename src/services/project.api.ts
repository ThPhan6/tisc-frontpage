import { message } from 'antd';
import { request } from 'umi';
import { MESSAGE_NOTIFICATION } from '@/constants/message';

import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import {
  ProjectListProps,
  GeneralData,
  KeyValueData,
  ProjectBodyRequest,
  ProjectDetailProps,
  ProjectSummaryData,
} from '@/types';

interface ProjectPaginationResponse {
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
    .then((response: ProjectPaginationResponse) => {
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

export async function getProjectBuildingTypes() {
  return request<{ data: GeneralData[] }>(`/api/project/building-types`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_BUILDING_TYPE_FAILED);
      return [] as GeneralData[];
    });
}
export async function getProjectTypes() {
  return request<{ data: GeneralData[] }>(`/api/project/project-types`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_TYPE_FAILED);
      return [] as GeneralData[];
    });
}
export async function getProjectMeasurementUnits() {
  return request<KeyValueData[]>(`/api/project/measurement-units`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_MEASUREMENT_UNIT_FAILED,
      );
      return [] as KeyValueData[];
    });
}

export async function createProject(data: ProjectBodyRequest) {
  return request(`/api/project/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_PROJECT_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_PROJECT_FAILED);
      return false;
    });
}
export async function updateProject(id: string, data: ProjectBodyRequest) {
  return request(`/api/project/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_PROJECT_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_PROJECT_FAILED);
      return false;
    });
}
export async function getProjectById(id: string) {
  return request<{ data: ProjectDetailProps }>(`/api/project/get-one/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_DATA_FAILED);
    });
}
export async function deleteProject(id: string) {
  return request(`/api/project/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_PROJECT_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_PROJECT_FAILED);
      return false;
    });
}
export async function getProjectSummary() {
  return request<ProjectSummaryData>(`/api/project/get-summary`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_SUMMARY_DATA_FAILED);
    });
}

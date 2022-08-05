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
import { getResponseMessage } from '@/helper/common';
import { ProjectItem, setProjectList } from '@/features/project/reducers';
import store from '@/reducers';

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

export async function getAllProjects() {
  request(`/api/project/get-all`, {
    method: 'GET',
  })
    .then((response: { data: ProjectItem[] }) => {
      store.dispatch(setProjectList(response.data));
    })
    .catch((error) => {
      console.log('getAllProjects', error);
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
    .then((res: { data: { id: string } }) => {
      message.success(MESSAGE_NOTIFICATION.CREATE_PROJECT_SUCCESS);
      // console.log('res', res);
      return res.data.id;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_PROJECT_FAILED);
      return '';
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

export async function getConsideredProducts(projectId: string) {
  return request<ProjectSummaryData>(`/api/considered-product/get-list/${projectId}`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_SUMMARY_DATA_FAILED);
    });
}

export async function assignProductToProject(data: {
  is_entire: boolean;
  product_id: string;
  project_id: string;
  project_zone_ids: string[];
}) {
  return request<ProjectSummaryData>(`/api/product/assign`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(getResponseMessage('assign', 'product'));
      return true;
    })
    .catch((error) => {
      console.log('assignProductToProject error', error);
      message.error(getResponseMessage('assign', 'product', 'failed', error));
      return false;
    });
}

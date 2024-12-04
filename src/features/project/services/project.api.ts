import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { COMMON_TYPES } from '@/constants/util';
import { ProjectStatus } from '@/pages/Brand/ProjectTracking/constant';
import { message } from 'antd';
import { request } from 'umi';

import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import { setProjectList } from '@/features/project/reducers';
import {
  ProjectBodyRequest,
  ProjectDetailProps,
  ProjectItem,
  ProjectListProps,
  ProjectSummaryData,
} from '@/features/project/types';
import store from '@/reducers';
import { GeneralData } from '@/types';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

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
      hidePageLoading();
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_LIST_FAILED);
    });
}

export async function getDesignerWorkspace(
  params: { filter?: { status?: ProjectStatus } },
  callback: (data: ProjectListProps[]) => void,
) {
  showPageLoading();
  await request(`/api/designer/workspace`, { method: 'GET', params })
    .then((response: { data: { projects: ProjectListProps[] } }) => {
      callback(response.data.projects);
      hidePageLoading();
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_LIST_FAILED);
      hidePageLoading();
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
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_LIST_FAILED);
    });
}

export async function getProjectBuildingTypes() {
  return request<{ data: GeneralData[] }>(
    `/api/setting/common-type/${COMMON_TYPES.PROJECT_BUILDING}`,
  )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_BUILDING_TYPE_FAILED);
      return [] as GeneralData[];
    });
}
export async function getProjectTypes() {
  return request<{ data: GeneralData[] }>(`/api/setting/common-type/${COMMON_TYPES.PROJECT_TYPE}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_TYPE_FAILED);
      return [] as GeneralData[];
    });
}
export async function getProjectMeasurementUnits() {
  return request<GeneralData[]>(`/api/setting/measurement-units`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_MEASUREMENT_UNIT_FAILED,
      );
      return [] as GeneralData[];
    });
}

export async function createProject(data: ProjectBodyRequest) {
  return request(`/api/project/create`, {
    method: 'POST',
    data,
  })
    .then((res: { data: { id: string } }) => {
      message.success(MESSAGE_NOTIFICATION.CREATE_PROJECT_SUCCESS);
      hidePageLoading();
      return res.data.id;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_PROJECT_FAILED);
      hidePageLoading();
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
      hidePageLoading();
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_PROJECT_FAILED);
      hidePageLoading();
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

export async function getProjectSummary(workspace?: boolean) {
  return request<ProjectSummaryData>(
    workspace ? `/api/designer/workspace/summary` : `/api/project/get-summary`,
  )
    .then((res) => {
      return res;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECT_SUMMARY_DATA_FAILED);
      return {} as ProjectSummaryData;
    });
}

export async function createAssignTeamByProjectId(projectId: string, data: string[]) {
  return request<boolean>(`/api/project/${projectId}/assign-team`, {
    method: 'PATCH',
    data: { team_profile_ids: data },
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_LIST_ASSIGN_TEAM_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_LIST_ASSIGN_TEAM_ERROR);
      return false;
    });
}

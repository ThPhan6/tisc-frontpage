import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { ProjectsDesignFirm } from '@/features/project/types';
import { MaterialCode } from '@/features/project/types/project-specifying.type';
import {
  DesignFirm,
  DesignFirmDetail,
  LocationGroupedByCountry,
  MaterialCodeDesignFirm,
  TeamsDesignFirm,
} from '@/types';
import { message } from 'antd';
import { request } from 'umi';

interface DesignFirmListResponse {
  designers: DesignFirm;
  pagination: PaginationResponse;
}

export async function getDesignFirmPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/design/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: { data: DesignFirmListResponse }) => {
      const { designers, pagination } = response.data;
      callback({
        data: designers,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
      });
    })
    .catch((error) => {
      console.log('error', error);
      message.error(error.message);
    });
}

export async function getOneDesignFirm(id: string) {
  return request<{ data: DesignFirmDetail }>(`/api/design/get-one/${id}`, { method: 'GET' })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_DESIGN_FIRM_ERROR);
    });
}

export async function getSummary() {
  return request<{ data: DataMenuSummaryProps[] }>(`/api/design/summary`, { method: 'GET' })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_SUMMARY);
    });
}

export async function getLocationsByDesignFirm(id: string) {
  return request<{ data: LocationGroupedByCountry[] }>(`/api/location/design/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LOCATIONS_BY_DESIGN_FIRM);
    });
}

export async function getTeamsByDesignFirm(id: string) {
  return request<{ data: TeamsDesignFirm[] }>(`/api/team-profile/design/${id}`, { method: 'GET' })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_TEAMS_BY_DESIGN_FIRM);
    });
}

export async function getProjectsByDesignFirm(id: string) {
  return request<{ data: ProjectsDesignFirm[] }>(
    `/api/project/get-list-group-by-status?design_id=${id}`,
    {
      method: 'GET',
    },
  )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_PROJECTS_BY_DESIGN_FIRM);
    });
}

export async function getMaterialCodeByDesignFirm(id: string) {
  return request<{ data: MaterialCodeDesignFirm[] }>(`/api/material-code/get-list-group/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_MATERIAL_CODE_BY_DESIGN_FIRM);
      return [] as MaterialCodeDesignFirm[];
    });
}

export async function getAllMaterialCode() {
  return request<{ data: MaterialCode[] }>(`/api/material-code/get-list-code`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_MATERIAL_CODE_BY_DESIGN_FIRM);
      return [] as MaterialCode[];
    });
}

export async function updateStatusDesignFirm(id: string, data: { status: number }) {
  return request<boolean>(`/api/design/update-status/${id}`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_STATUS_DESIGN_FIRM_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_STATUS_DESIGN_FIRM_ERROR);
      return false;
    });
}

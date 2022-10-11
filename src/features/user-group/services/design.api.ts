import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { BrandDesignProfile, DesignFirm } from '../types';
import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import { LocationGroupedByCountry } from '@/features/locations/type';
import { ProjectsDesignFirm } from '@/features/project/types';
import { MaterialCode } from '@/features/project/types/project-specifying.type';
import { TeamProfileGroupCountry } from '@/features/team-profiles/types';
import { KeyValueData, MaterialCodeDesignFirm } from '@/types';

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
  return request<{ data: BrandDesignProfile }>(`/api/design/get-one/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_DESIGN_FIRM_ERROR);
    });
}

export async function getDesignStatuses() {
  return request<KeyValueData[]>(`/api/design/statuses`, {
    method: 'GET',
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_DESIGN_STATUSES_ERROR);
      return [] as KeyValueData[];
    });
}

export async function getDesignFirmSummary() {
  return request<{ data: DataMenuSummaryProps[] }>(`/api/design/summary`, { method: 'GET' })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_SUMMARY);
      return [] as DataMenuSummaryProps[];
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
      return [] as LocationGroupedByCountry[];
    });
}

export async function getTeamsByDesignFirm(id: string) {
  return request<{ data: TeamProfileGroupCountry[] }>(`/api/team-profile/design/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_TEAMS_BY_DESIGN_FIRM);
      return [] as TeamProfileGroupCountry[];
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
  return request<{ data: MaterialCodeDesignFirm[] }>(
    `/api/material-code/get-list?design_id=${id}`,
    {
      method: 'GET',
    },
  )
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

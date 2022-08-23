import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { getUserInfoMiddleware } from '@/pages/LandingPage/services/api';

import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';
import store from '@/reducers';
import {
  TeamProfileDetailProps,
  TeamProfileGroupCountry,
  TeamProfileRequestBody,
  TeamProfileTableProps,
} from '@/types';

interface TeamProfilePaginationResponse {
  data: {
    users: TeamProfileTableProps[];
    pagination: PaginationResponse;
    summary: SummaryResponse[];
  };
}

export async function getTeamProfileList(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request('/api/team-profile/get-list', { method: 'GET', params })
    .then((response: TeamProfilePaginationResponse) => {
      const { users, pagination, summary } = response.data;
      callback({
        data: users,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary: summary,
      });
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_TEAM_PROFILE_ERROR);
      return false;
    });
}

export async function getListTeamProfileUserGroupByBrandId(brandId: string) {
  return request<{ data: TeamProfileGroupCountry[] }>(`/api/team-profile/brand/${brandId}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_TEAM_PROFILE_ERROR);
      return [] as TeamProfileGroupCountry[];
    });
}

export async function getOneTeamProfile(id: string) {
  return request<{ data: TeamProfileDetailProps }>(`/api/team-profile/get-one/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_TEAM_PROFILE_ERROR);
    });
}

export async function createTeamProfile(data: TeamProfileRequestBody) {
  return request<{ data: TeamProfileDetailProps }>(`/api/team-profile/create`, {
    method: 'POST',
    data,
  })
    .then((res) => {
      message.success(MESSAGE_NOTIFICATION.CREATE_TEAM_PROFILE_SUCCESS);
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_TEAM_PROFILE_ERROR);
    });
}

export async function updateTeamProfile(id: string, data: TeamProfileRequestBody) {
  return request(`/api/team-profile/update/${id}`, {
    method: 'POST',
    data,
  })
    .then(() => {
      const globalState = store.getState();
      if (globalState.user.user?.id === id) {
        getUserInfoMiddleware();
      }
      message.success(MESSAGE_NOTIFICATION.UPDATE_TEAM_PROFILE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_TEAM_PROFILE_ERROR);
      return false;
    });
}

export async function deleteTeamProfile(id: string) {
  return request(`/api/team-profile/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_TEAM_PROFILE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_TEAM_PROFILE_ERROR);
      return false;
    });
}

export async function inviteUser(userId: string) {
  return request(`/api/team-profile/invite/${userId}`, {
    method: 'POST',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.SEND_INVITE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.SEND_INVITE_ERROR);
      return false;
    });
}

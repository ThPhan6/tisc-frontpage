import { request } from 'umi';
import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
  ISummaryResponse,
} from '@/components/Table/types';
import {
  ICountryGroup,
  ITeamProfileGetOneResponseForm,
  ITeamProfilesResponseForm,
  TeamProfilesSubmitData,
} from '@/types';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';

interface ITeamProfilePaginationResponse {
  data: {
    users: ITeamProfilesResponseForm[];
    pagination: IPaginationResponse;
    summary: ISummaryResponse[];
  };
}

export async function getTeamProfileList(
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
) {
  request('/api/team-profile/get-list', { method: 'GET', params })
    .then((response: ITeamProfilePaginationResponse) => {
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

export async function getOneTeamProfile(id: string) {
  return request<{ data: ITeamProfileGetOneResponseForm }>(`/api/team-profile/get-one/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_TEAM_PROFILE_ERROR);
      return {} as ITeamProfileGetOneResponseForm;
    });
}

export async function createTeamProfile() {
  return request<{ data: ITeamProfilePaginationResponse[] }>(`/api/team-profile/create`, {
    method: 'POST',
  })
    .then((response) => {
      message.success(MESSAGE_NOTIFICATION.CREATE_TEAM_PROFILE_SUCCESS);
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_TEAM_PROFILE_ERROR);
      return [] as ITeamProfilePaginationResponse[];
    });
}

export async function updateTeamProfile(id: string, data: TeamProfilesSubmitData) {
  return request<boolean>(`/api/team-profile/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_TEAM_PROFILE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_TEAM_PROFILE_ERROR);
      return false;
    });
}

export async function deleteTeamProfile(id: string) {
  return request<boolean>(`/api/team-profile/delete/${id}`, {
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

export async function getTeamProfileLocationList() {
  return request<{ data: ICountryGroup[] }>(`/api/location/get-list-with-country-group`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_WITH_COUNTRY_GROUP_ERROR);
      return [] as ICountryGroup[];
    });
}

import { ILocationDetail } from '@/types';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { ICity, ICountry, IState } from '@/types/';
import { message } from 'antd';
import { request } from 'umi';
import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
  ISummaryResponse,
} from '@/components/Table/types';

interface ILocationPaginationResponse {
  data: {
    locations: ILocationDetail[];
    pagination: IPaginationResponse;
    summary: ISummaryResponse[];
  };
}

export async function getLocationList(
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/location/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: ILocationPaginationResponse) => {
      const { locations, pagination, summary } = response.data;

      callback({
        data: locations,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary: summary,
      });
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_LOCATION_ERROR);
      return [] as ILocationDetail[];
    });
}

export async function getCountries() {
  return request<{ data: ICountry[] }>(`/api/location/get-countries`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_COUNTRIES_ERROR);
      return [] as ICountry[];
    });
}

export async function getStatesByCountryId(countryId: string) {
  return request<{ data: IState[] }>(`/api/location/get-states`, {
    method: 'GET',
    params: { country_id: countryId },
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_STATES_ERROR);
      return [] as IState[];
    });
}

export async function getCitiesByCountryIdAndStateId(countryId: string, stateId: string) {
  return request<{ data: ICity[] }>(`/api/location/get-cities`, {
    method: 'GET',
    params: { country_id: countryId, state_id: stateId },
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_CITIES_ERROR);
      return [] as ICity[];
    });
}

export async function getListCountryGroup() {
  return request(`/api/location/get-list-with-country-group`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_COUNTRY_GROUP);
      return [];
    });
}

export async function getCountryById(id: string) {
  return request(`/api/location/get-country/${id}`, { method: 'GET' })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_COUNTRY_ERROR);
    });
}

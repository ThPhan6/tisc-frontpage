import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { ICity, ICountry, IState } from '@/types/location.types';
import { message } from 'antd';
import { request } from 'umi';

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

export async function getStates(countryId: string) {
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

export async function getCities(countryId: string, stateId: string) {
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

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type {
  ICity,
  ICountry,
  IState,
  ILocationDetail,
  FunctionalTypeData,
  LocationForm,
} from '@/types';
import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
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

export async function getLocationPagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  return request<{
    data: {
      locations: ILocationDetail[];
      pagination: PaginationResponse;
    };
  }>(`/api/location/get-list`, {
    method: 'GET',
    params,
  })
    .then((response) => {
      const { locations, pagination } = response.data;
      callback({
        data: locations,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function getListFunctionalType() {
  return request<{ data: FunctionalTypeData[] }>(`/api/functional-type/get-list`)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return [] as FunctionalTypeData[];
    });
}

export async function createLocation(data: LocationForm) {
  return request(`/api/location/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_LOCATION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_LOCATION_FAILED);
      return false;
    });
}
export async function getLocationById(id: string) {
  return request<{ data: ILocationDetail }>(`/api/location/get-one/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LOCATION_FAILED);
    });
}
export async function updateLocation(id: string, data: LocationForm) {
  return request(`/api/location/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_LOCATION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_LOCATION_FAILED);
      return false;
    });
}

export async function deleteLocationById(id: string) {
  return request(`/api/location/delete/${id}`, { method: 'DELETE' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_LOCATION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_LOCATION_FAILED);
      return false;
    });
}

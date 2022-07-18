import {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
  ISummaryResponse,
} from '@/components/Table/types';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { IInspirationalQuotationForm } from '@/types';
import { message } from 'antd';
import { request } from 'umi';

interface IQuotationPaginationResponse {
  data: {
    quotations: IInspirationalQuotationForm[];
    pagination: IPaginationResponse;
    summary: ISummaryResponse[];
  };
}

export async function getQuotationPagination(
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/quotation/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: IQuotationPaginationResponse) => {
      const { quotations, pagination, summary } = response.data;
      callback({
        data: quotations,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary: summary,
      });
    })
    .catch((error) => {
      message.error(
        error.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_INSPIRATIONAL_QUOTATION_ERROR,
      );
    });
}

export async function getOneQuotation(id: string) {
  return request<{ data: IInspirationalQuotationForm }>(`/api/quotation/get-one/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(
        error.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_INSPIRATIONAL_QUOTATION_ERROR,
      );
      return {} as IInspirationalQuotationForm;
    });
}

export async function createQuotation(data: IInspirationalQuotationForm) {
  return request<boolean>(`/api/quotation/create`, { method: 'POST', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_INSPIRATIONAL_QUOTATION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(
        error.data?.message ?? MESSAGE_NOTIFICATION.CREATE_INSPIRATIONAL_QUOTATION_ERROR,
      );
      return false;
    });
}

export async function updateQuotation(id: string, data: IInspirationalQuotationForm) {
  return request<boolean>(`/api/quotation/update/${id}`, { method: 'PUT', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_INSPIRATIONAL_QUOTATION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(
        error.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_INSPIRATIONAL_QUOTATION_ERROR,
      );
      return false;
    });
}

export async function deleteQuotation(id: string) {
  return request<boolean>(`/api/quotation/delete/${id}`, { method: 'DELETE' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_INSPIRATIONAL_QUOTATION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(
        error.data?.message ?? MESSAGE_NOTIFICATION.DELETE_INSPIRATIONAL_QUOTATION_ERROR,
      );
      return false;
    });
}

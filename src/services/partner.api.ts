import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import { Company, CompanyForm } from '@/types';

import { CommonPartnerType } from '@/pages/Brand/Adminstration/Partners/PartnersTable';

import { hidePageLoading } from '@/features/loading/loading';

interface PartnerCompanyResponse {
  data: {
    pagination: PaginationResponse;
    partners: Company[];
  };
}

export const getListPartnerCompanies = (
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) => {
  request(`/api/partner/get-list-partner`, {
    method: 'GET',
    params,
  })
    .then((response: PartnerCompanyResponse) => {
      const { partners, pagination } = response.data;
      callback({
        data: partners,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
      });
    })
    .catch((error) => {
      message.error(error.message);
      hidePageLoading();
    });
};

export const getCommonPartnerTypes = async () => {
  return request<{ data: CommonPartnerType }>(`/api/setting/common-partner-type`)
    .then((response) => response.data)
    .catch((error) => {
      message.error(
        error?.data?.message || MESSAGE_NOTIFICATION.GET_LIST_COMMON_PARTNER_TYPE_ERROR,
      );
      return null;
    });
};

export const createPartner = async (data: CompanyForm) => {
  return request<{ data: CompanyForm }>(`/api/partner/create-partner`, {
    method: 'POST',
    data,
  })
    .then((response) => {
      message.success(MESSAGE_NOTIFICATION.CREATE_PARTNER_COMPANY_SUCCESS);
      hidePageLoading();
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_PARTNER_COMPANY_ERROR);
      hidePageLoading();
      return undefined;
    });
};

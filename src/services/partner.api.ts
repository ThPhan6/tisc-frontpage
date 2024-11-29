import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
} from '@/components/Table/types';
import store from '@/reducers';
import { setCompaniesPage, setContactsPage } from '@/reducers/partner';
import { Company, CompanyForm, ContactForm } from '@/types';

import { CommonPartnerType } from '@/pages/Brand/Adminstration/Partners/PartnersTable';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

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
      store.dispatch(setCompaniesPage(pagination.page));
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

export const getListPartnerContacts = (
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) => {
  request(`/api/partner-contact/get-list`, {
    method: 'GET',
    params,
  })
    .then((response) => {
      const { partner_contacts, pagination } = response.data;
      store.dispatch(setContactsPage(pagination.page));
      callback({
        data: partner_contacts,
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
  return request<{ data: CommonPartnerType }>(`/api/setting/partner-common-type`)
    .then((response) => response.data)
    .catch((error) => {
      message.error(
        error?.data?.message || MESSAGE_NOTIFICATION.GET_LIST_COMMON_PARTNER_TYPE_ERROR,
      );
      return null;
    });
};

export const getPartner = async (id: string) => {
  return request<{ data: CompanyForm }>(`/api/partner/get-one/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.GET_PARTNER_ERROR);
      return null;
    });
};

export const getPartnerContact = async (id: string) => {
  return request<{ data: ContactForm }>(`/api/partner-contact/get-one/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      message.error(error?.data?.message || MESSAGE_NOTIFICATION.GET_PARTNER_ERROR);
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

export const createPartnerContact = async (data: ContactForm) => {
  showPageLoading();

  return request<{ data: ContactForm }>(`/api/partner-contact/create`, {
    method: 'POST',
    data,
  })
    .then((response) => {
      message.success(MESSAGE_NOTIFICATION.CREATE_PARTNER_CONTACT_SUCCESS);
      hidePageLoading();
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_PARTNER_CONTACT_ERROR);
      hidePageLoading();
      return undefined;
    });
};

export async function updatePartner(id: string, data: CompanyForm) {
  return request<{ data: CompanyForm }>(`/api/partner/update/${id}`, { method: 'PUT', data })
    .then((res) => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_PARTNER_COMPANY_SUCCESS);
      hidePageLoading();
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_PARTNER_COMPANY_ERROR);
      hidePageLoading();
      return null;
    });
}

export async function updatePartnerContact(id: string, data: ContactForm) {
  showPageLoading();

  return request<{ data: ContactForm }>(`/api/partner-contact/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then((res) => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_PARTNER_CONTACT_SUCCESS);
      hidePageLoading();
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_PARTNER_CONTACT_ERROR);
      hidePageLoading();
      return null;
    });
}

export async function deletePartner(id: string) {
  return request<boolean>(`/api/partner/delete/${id}`, { method: 'DELETE' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_PARTNER_COMPANY_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_PARTNER_COMPANY_ERROR);
      return false;
    });
}

export async function deletePartnerContact(id: string) {
  showPageLoading();

  return request<boolean>(`/api/partner-contact/delete/${id}`, { method: 'DELETE' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_PARTNER_CONTACT_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_PARTNER_CONTACT_ERROR);
      return false;
    });
}

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { STATUS_RESPONSE } from '@/constants/util';
import { message } from 'antd';
import { request } from 'umi';

import type {
  AvailableTime,
  BookingPayloadRequest,
  ContactRequestBody,
  InformationBooking,
  LoginInput,
  LoginResponseProps,
  PasswordRequestBody,
  Quotation,
  SignUpDesignerRequestBody,
} from '../types';
import {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';
import store from '@/reducers';
import { setUserProfile } from '@/reducers/user';
import { UserDetail } from '@/types/user.type';

interface QuotationPaginationResponse {
  data: {
    pagination: PaginationResponse;
    quotations: Quotation[];
    summary: SummaryResponse[];
  };
}
export async function loginMiddleware(
  data: LoginInput,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/auth/login`, {
    method: 'POST',
    data,
  })
    .then((response: LoginResponseProps) => {
      localStorage.setItem('access_token', response.token);
      callback(STATUS_RESPONSE.SUCCESS);
    })
    .catch((error) => {
      callback(STATUS_RESPONSE.ERROR, error?.data?.message || MESSAGE_NOTIFICATION.LOGIN_ERROR);
    });
}

export async function loginByBrandOrDesigner(
  data: LoginInput,
  callback: (type: STATUS_RESPONSE, message?: string, dataResponse?: LoginResponseProps) => void,
) {
  request(`/api/auth/brand-design/login`, {
    method: 'POST',
    data,
  })
    .then((response: LoginResponseProps) => {
      localStorage.setItem('access_token', response.token);
      callback(STATUS_RESPONSE.SUCCESS, '', response);
    })
    .catch((error) => {
      callback(STATUS_RESPONSE.ERROR, error?.data?.message || MESSAGE_NOTIFICATION.LOGIN_ERROR);
    });
}

export async function resetPasswordMiddleware(
  data: PasswordRequestBody,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/auth/reset-password-and-login`, {
    method: 'POST',
    data,
  })
    .then((response: LoginResponseProps) => {
      localStorage.setItem('access_token', response.token);
      callback(STATUS_RESPONSE.SUCCESS);
    })
    .catch((error) => {
      callback(
        STATUS_RESPONSE.ERROR,
        error?.data?.message || MESSAGE_NOTIFICATION.RESET_PASSWORD_SUCCESS,
      );
    });
}

export enum ForgotType {
  TISC = 1,
  OTHER = 2,
}

export async function forgotPasswordMiddleware(
  data: {
    email: string;
    type: ForgotType;
  },
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/auth/forgot-password`, {
    method: 'POST',
    data,
  })
    .then(() => {
      callback(STATUS_RESPONSE.SUCCESS);
    })
    .catch((error) => {
      callback(STATUS_RESPONSE.ERROR, error?.data?.message);
    });
}

export async function getUserInfoMiddleware() {
  const dataRes = await request<{
    data: UserDetail;
  }>(`/api/team-profile/get-me`, {
    method: 'get',
  });
  store.dispatch(setUserProfile(dataRes.data));
  return dataRes.data;
}

export async function validateToken(token: string | null) {
  return request<{ data: boolean }>(`/api/auth/token/${token ?? ''}/validate`)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return false;
    });
}
export async function createPasswordVerify(token: string, data: PasswordRequestBody) {
  return request(`/api/auth/create-password-verify/${token}`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_PASSSWORD_VERIFICATION_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_PASSSWORD_VERIFICATION_FAILED,
      );
      return false;
    });
}

export async function signUpDesigner(data: SignUpDesignerRequestBody) {
  return request(`/api/auth/register`, { method: 'POST', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.SIGN_UP_DESIGNER_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.SIGN_UP_DESIGNER_ERROR);
      return false;
    });
}

export async function verifyAccount(verification_token: string | null) {
  return request<{ data: boolean }>(`/api/auth/verify/${verification_token ?? ''}`, {
    method: 'POST',
  })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

export async function checkEmailAlreadyUsed(email: string) {
  return request(`/api/auth/check-email/${email}`, { method: 'GET' })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

export async function contact(data: ContactRequestBody) {
  return request<boolean>(`/api/contact/create`, { method: 'POST', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CONTACT_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CONTACT_ERROR);
      return false;
    });
}

export async function getListPolicy() {
  return request(`/api/documentation/get-list-policy`, { method: 'GET' })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_POLICY);
    });
}

export async function getListQuotation(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/quotation/landing-page/get-list`, { method: 'GET', params })
    .then((response: QuotationPaginationResponse) => {
      const { quotations, pagination, summary } = response.data;
      callback({
        data: quotations,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary,
      });
    })
    .catch((error) => {
      message.error(error.message);
    });
}

export async function getListAvailableTime(date: string, timezone: string) {
  return request<{ data: AvailableTime[] }>(
    `/api/booking/available-schedule?date=${date}&timezone=${timezone}`,
    {
      method: 'GET',
    },
  )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return [] as AvailableTime[];
    });
}

export async function createBooking(data: BookingPayloadRequest) {
  return request<boolean>(`/api/booking/create`, { method: 'POST', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_BOOKING_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return false;
    });
}

export async function getBooking(id: string) {
  return request<{ data: InformationBooking }>(`/api/booking/${id}`, { method: 'GET' })
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      return;
    });
}

export async function deleteBooking(id: string) {
  return request<boolean>(`/api/booking/${id}/cancel`, { method: 'DELETE' })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CANCEL_BOOKING_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return false;
    });
}

export async function updateBooking(
  id: string,
  data: {
    date: string;
    slot: number;
    timezone: string;
  },
) {
  return request<boolean>(`/api/booking/${id}/re-schedule`, { method: 'PATCH', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_BOOKING_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message);
      return false;
    });
}

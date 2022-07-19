import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { STATUS_RESPONSE } from '@/constants/util';
import { request } from 'umi';
import type {
  LoginInput,
  LoginResponseProp,
  ResetPasswordRequestBody,
  UserInfoDataProp,
} from '../types';

export async function loginMiddleware(
  data: LoginInput,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/auth/login`, {
    method: 'POST',
    data,
  })
    .then((response: LoginResponseProp) => {
      localStorage.setItem('access_token', response.token);
      callback(STATUS_RESPONSE.SUCCESS);
    })
    .catch((error) => {
      callback(STATUS_RESPONSE.ERROR, error?.data?.message || MESSAGE_NOTIFICATION.LOGIN_ERROR);
    });
}

export async function brandLoginMiddleware(
  data: LoginInput,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/auth/login/brand`, {
    method: 'POST',
    data,
  })
    .then((response: LoginResponseProp) => {
      localStorage.setItem('access_token', response.token);
      callback(STATUS_RESPONSE.SUCCESS);
    })
    .catch((error) => {
      callback(STATUS_RESPONSE.ERROR, error?.data?.message || MESSAGE_NOTIFICATION.LOGIN_ERROR);
    });
}

export async function resetPasswordMiddleware(
  data: ResetPasswordRequestBody,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/auth/reset-password-and-login`, {
    method: 'POST',
    data,
  })
    .then((response: LoginResponseProp) => {
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

export async function forgotPasswordMiddleware(
  data: {
    email: string;
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
    data: UserInfoDataProp;
  }>(`/api/team-profile/get-me`, {
    method: 'get',
  });
  return dataRes.data;
}

export async function validateResetToken(token: string | null) {
  return request<{ data: boolean }>(`/api/auth/is-valid-reset-password-token/${token ?? ''}`)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return false;
    });
}

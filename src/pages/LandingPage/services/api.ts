import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { STATUS_RESPONSE } from '@/constants/util';
import { request } from 'umi';
import type {
  LoginBodyProp,
  LoginResponseProp,
  UserInfoDataProp,
  ResetPasswordBodyProp,
} from '../types';

export async function loginMiddleware(
  data: LoginBodyProp,
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

export async function resetPasswordMiddleware(
  data: ResetPasswordBodyProp,
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

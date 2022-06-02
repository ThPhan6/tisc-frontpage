import { MESSENGER_NOTIFICATION } from '@/constants/message';
import { STATUS_RESPONSE } from '@/constants/util';
import { request } from 'umi';
import { LoginBodyProp, LoginResponseProp, UserInfoDataProp } from '../types';

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
      callback(STATUS_RESPONSE.ERROR, error?.data?.message || MESSENGER_NOTIFICATION.LOGIN_ERROR);
    });
}

export async function resendEmailMiddleware(
  type: 'forgot_password' | 'verification',
  email: string,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/auth/resend-email/${type}/${email}`, {
    method: 'POST',
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

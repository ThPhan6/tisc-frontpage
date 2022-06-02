import { MESSENGER_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';
import { LoginBodyProp, LoginResponseProp, UserInfoDataProp } from '../types';

export async function loginMiddleware(
  data: LoginBodyProp,
  callback: (dataRes: LoginResponseProp) => void,
) {
  request(`/api/auth/login`, {
    method: 'POST',
    data,
  })
    .then((response: LoginResponseProp) => {
      callback(response);
    })
    .catch((error) => {
      message.error(error?.data?.message || MESSENGER_NOTIFICATION.LOGIN_ERROR);
    });
}

export async function getInfoUserMiddleware() {
  const dataRes = await request<{
    data: UserInfoDataProp;
  }>(`/api/team-profile/get-me`, {
    method: 'get',
  });
  return dataRes.data;
}

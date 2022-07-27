import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { STATUS_RESPONSE } from '@/constants/util';
import { request } from 'umi';
import type {
  LoginInput,
  LoginResponseProp,
  ResetPasswordRequestBody,
  CreatePasswordRequestBody,
} from '../types';
import { UserDetail } from '@/types';
import { message } from 'antd';
import { setUserProfile } from '@/reducers/user';
import store from '@/reducers';

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
  request(`/api/auth/brand-design/login`, {
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
    data: UserDetail;
  }>(`/api/team-profile/get-me`, {
    method: 'get',
  });
  store.dispatch(setUserProfile(dataRes.data));
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
export async function createPasswordVerify(token: string, data: CreatePasswordRequestBody) {
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
